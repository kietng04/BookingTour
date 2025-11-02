package com.example.user.service;

import com.example.user.dto.google.GoogleAccessTokenResponse;
import com.example.user.dto.google.GoogleUserResponse;
import com.example.user.model.User;
import com.example.user.repository.UserRepository;
import com.example.user.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
public class GoogleOAuthService {

    private static final String AUTHORIZATION_URL = "https://accounts.google.com/o/oauth2/v2/auth";
    private static final String TOKEN_URL = "https://oauth2.googleapis.com/token";
    private static final String USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate;

    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;
    private static final Logger logger = LoggerFactory.getLogger(GoogleOAuthService.class);

    public GoogleOAuthService(UserRepository userRepository,
                              JwtUtil jwtUtil,
                              PasswordEncoder passwordEncoder,
                              @Value("${oauth.google.client-id:}") String clientId,
                              @Value("${oauth.google.client-secret:}") String clientSecret,
                              @Value("${oauth.google.redirect-uri:http://localhost:3000/auth/callback}") String redirectUri) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.restTemplate = new RestTemplate();
    }

    public String buildAuthorizationUrl() {
        if (!StringUtils.hasText(clientId)) {
            throw new IllegalStateException("Google client id is not configured");
        }

        logger.debug("Building Google authorization URL with redirectUri={} and clientId={}", redirectUri, clientId);

        return UriComponentsBuilder.fromHttpUrl(AUTHORIZATION_URL)
                .queryParam("client_id", clientId)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("response_type", "code")
                .queryParam("scope", "openid email profile")
                .queryParam("access_type", "offline")
                .queryParam("prompt", "consent")
                .queryParam("state", "google")
                .build()
                .toUriString();
    }

    @Transactional
    public OAuthLoginResult handleGoogleCallback(String code, String state) {
        if (!StringUtils.hasText(code)) {
            throw new IllegalArgumentException("Authorization code is required");
        }

        String accessToken = exchangeCodeForToken(code);
        GoogleUserResponse userResponse = fetchGoogleUser(accessToken);

        User user = upsertUser(userResponse);
        String token = jwtUtil.generateToken(user.getUsername(), user.getEmail());

        return new OAuthLoginResult(token,
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatar(),
                "Login successful",
                user.getId());
    }

    private String exchangeCodeForToken(String code) {
        if (!StringUtils.hasText(clientId) || !StringUtils.hasText(clientSecret)) {
            throw new IllegalStateException("Google OAuth credentials are not configured");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code", code);
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("redirect_uri", redirectUri);
        body.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<GoogleAccessTokenResponse> response;
        try {
            logger.info("Exchanging Google code={}", code);
            response = restTemplate.postForEntity(TOKEN_URL, requestEntity, GoogleAccessTokenResponse.class);
        } catch (RestClientException ex) {
            logger.warn("Google token exchange failed: {}", ex.getMessage(), ex);
            throw new IllegalStateException("Failed to exchange authorization code with Google", ex);
        }

        GoogleAccessTokenResponse responseBody = response.getBody();
        if (responseBody == null || !StringUtils.hasText(responseBody.getAccessToken())) {
            logger.warn("Google token response invalid: status={} body={}", response.getStatusCode(), responseBody);
            throw new IllegalStateException("Google token response was empty");
        }

        return responseBody.getAccessToken();
    }

    private GoogleUserResponse fetchGoogleUser(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            logger.info("Fetching Google user profile from Google API");
            ResponseEntity<GoogleUserResponse> response = restTemplate.exchange(
                    USER_INFO_URL,
                    HttpMethod.GET,
                    entity,
                    GoogleUserResponse.class
            );

            GoogleUserResponse body = response.getBody();
            if (body == null || !StringUtils.hasText(body.sub())) {
                logger.warn("Google user profile invalid: status={} body={}", response.getStatusCode(), body);
                throw new IllegalStateException("Google user profile response was invalid");
            }
            return body;
        } catch (RestClientException ex) {
            logger.warn("Google user profile fetch failed: {}", ex.getMessage(), ex);
            throw new IllegalStateException("Failed to fetch Google user profile", ex);
        }
    }

    private User upsertUser(GoogleUserResponse userResponse) {
        String providerId = userResponse.sub();
        String email = userResponse.email();
        boolean isEmailVerified = Boolean.TRUE.equals(userResponse.emailVerified());
        String resolvedEmail = StringUtils.hasText(email) && (isEmailVerified || !userRepository.existsByEmail(email))
                ? email
                : providerId + "@users.noreply.google.com";

        Optional<User> existingUser = userRepository.findByProviderId(providerId);

        if (existingUser.isEmpty() && StringUtils.hasText(email)) {
            existingUser = userRepository.findByEmail(email);
        }

        User user = existingUser.orElseGet(User::new);

        if (user.getId() == null) {
            String baseUsername = deriveBaseUsername(userResponse);
            user.setUsername(generateUniqueUsername(baseUsername));
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        }

        String fullName = StringUtils.hasText(userResponse.name())
                ? userResponse.name()
                : (StringUtils.hasText(userResponse.givenName()) ? userResponse.givenName() : providerId);

        user.setEmail(resolvedEmail);
        user.setFullName(fullName);
        user.setAvatar(userResponse.picture());
        user.setProvider("GOOGLE");
        user.setProviderId(providerId);
        user.setIsOAuthUser(true);

        return userRepository.save(user);
    }

    private String deriveBaseUsername(GoogleUserResponse userResponse) {
        if (StringUtils.hasText(userResponse.email())) {
            String email = userResponse.email();
            int atIndex = email.indexOf('@');
            if (atIndex > 0) {
                return email.substring(0, atIndex);
            }
        }

        if (StringUtils.hasText(userResponse.givenName())) {
            return userResponse.givenName();
        }

        if (StringUtils.hasText(userResponse.name())) {
            return userResponse.name();
        }

        return "google-user";
    }

    private String generateUniqueUsername(String baseUsername) {
        String sanitized = baseUsername.replaceAll("[^a-zA-Z0-9._-]", "");
        if (!StringUtils.hasText(sanitized)) {
            sanitized = "google-user";
        }

        String candidate = sanitized;
        int suffix = 1;
        while (userRepository.existsByUsername(candidate)) {
            candidate = sanitized + "-" + suffix++;
        }
        return candidate;
    }
}
