package com.example.user.service;

import com.example.user.dto.github.GithubAccessTokenResponse;
import com.example.user.dto.github.GithubEmailResponse;
import com.example.user.dto.github.GithubUserResponse;
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
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
public class GithubOAuthService {

    private static final String TOKEN_URL = "https://github.com/login/oauth/access_token";
    private static final String USER_URL = "https://api.github.com/user";
    private static final String EMAILS_URL = "https://api.github.com/user/emails";
    private static final Logger logger = LoggerFactory.getLogger(GithubOAuthService.class);

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate;

    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;

    public GithubOAuthService(UserRepository userRepository,
                              JwtUtil jwtUtil,
                              PasswordEncoder passwordEncoder,
                              @Value("${oauth.github.client-id:}") String clientId,
                              @Value("${oauth.github.client-secret:}") String clientSecret,
                              @Value("${oauth.github.redirect-uri:http://localhost:3000/auth/callback}") String redirectUri) {
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
            throw new IllegalStateException("GitHub client id is not configured");
        }

        return UriComponentsBuilder.fromHttpUrl("https://github.com/login/oauth/authorize")
                .queryParam("client_id", clientId)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("scope", "user:email")
                .queryParam("state", "github")
                .build()
                .toUriString();
    }

    @Transactional
    public OAuthLoginResult handleGithubCallback(String code, String state) {
        if (!StringUtils.hasText(code)) {
            throw new IllegalArgumentException("Authorization code is required");
        }

        String accessToken = exchangeCodeForToken(code);
        GithubUserResponse userResponse = fetchGithubUser(accessToken);
        String email = resolveEmail(accessToken, userResponse);

        User user = upsertUser(userResponse, email);
        String token = jwtUtil.generateToken(user.getUsername(), user.getEmail());

        return new OAuthLoginResult(
                token,
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getPhoneNumber(),
                user.getAvatar(),
                "Login successful",
                user.getId()
        );
    }

    private String exchangeCodeForToken(String code) {
        if (!StringUtils.hasText(clientId) || !StringUtils.hasText(clientSecret)) {
            throw new IllegalStateException("GitHub OAuth credentials are not configured");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        GithubAccessTokenRequest requestBody = new GithubAccessTokenRequest(clientId, clientSecret, code, redirectUri);

        HttpEntity<GithubAccessTokenRequest> requestEntity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<GithubAccessTokenResponse> response;
        try {
            logger.info("Exchanging GitHub code={}", code);
            response = restTemplate.postForEntity(TOKEN_URL, requestEntity, GithubAccessTokenResponse.class);
        } catch (RestClientException ex) {
            logger.warn("GitHub token exchange failed: {}", ex.getMessage(), ex);
            throw new IllegalStateException("Failed to exchange authorization code with GitHub", ex);
        }

        GithubAccessTokenResponse body = response.getBody();
        if (body == null || !StringUtils.hasText(body.getAccessToken())) {
            String errorMessage = body != null && StringUtils.hasText(body.getErrorDescription())
                    ? body.getErrorDescription()
                    : "GitHub token response was empty";
            logger.warn("GitHub token response invalid: status={} body={}", response.getStatusCode(), body);
            throw new IllegalStateException(errorMessage);
        }

        return body.getAccessToken();
    }

    private GithubUserResponse fetchGithubUser(String accessToken) {
        HttpEntity<Void> entity = new HttpEntity<>(buildAuthHeaders(accessToken));

        try {
            logger.info("Fetching GitHub user profile from GitHub API");
            ResponseEntity<GithubUserResponse> response = restTemplate.exchange(
                    USER_URL,
                    HttpMethod.GET,
                    entity,
                    GithubUserResponse.class
            );

            GithubUserResponse body = response.getBody();
            if (body == null || body.id() == null || !StringUtils.hasText(body.login())) {
                logger.warn("GitHub user profile invalid: status={} body={}", response.getStatusCode(), body);
                throw new IllegalStateException("GitHub user profile response was invalid");
            }
            return body;
        } catch (RestClientException ex) {
            logger.warn("GitHub user profile fetch failed: {}", ex.getMessage(), ex);
            throw new IllegalStateException("Failed to fetch GitHub user profile", ex);
        }
    }

    private String resolveEmail(String accessToken, GithubUserResponse userResponse) {
        if (StringUtils.hasText(userResponse.email())) {
            return userResponse.email();
        }

        try {
            HttpEntity<Void> entity = new HttpEntity<>(buildAuthHeaders(accessToken));
            ResponseEntity<GithubEmailResponse[]> response = restTemplate.exchange(
                    EMAILS_URL,
                    HttpMethod.GET,
                    entity,
                    GithubEmailResponse[].class
            );

            GithubEmailResponse[] emails = response.getBody();
            if (emails != null) {
                for (GithubEmailResponse emailResponse : emails) {
                    if (emailResponse.isPrimary() && emailResponse.isVerified() && StringUtils.hasText(emailResponse.email())) {
                        return emailResponse.email();
                    }
                }
                for (GithubEmailResponse emailResponse : emails) {
                    if (StringUtils.hasText(emailResponse.email())) {
                        return emailResponse.email();
                    }
                }
            }
        } catch (RestClientException ex) {
        }

        return null;
    }

    private User upsertUser(GithubUserResponse userResponse, String email) {
        String providerId = String.valueOf(userResponse.id());
        String fallbackEmail = providerId + "@users.noreply.github.com";
        String resolvedEmail = StringUtils.hasText(email) ? email : fallbackEmail;

        Optional<User> existingUser = userRepository.findByProviderId(providerId);

        if (existingUser.isEmpty() && StringUtils.hasText(email)) {
            existingUser = userRepository.findByEmail(email);
        }

        User user = existingUser.orElseGet(User::new);

        if (user.getId() == null) {
            String login = userResponse.login();
            String baseUsername = StringUtils.hasText(login) ? login : "github-user";
            user.setUsername(generateUniqueUsername(baseUsername));
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        }

        String fullName = StringUtils.hasText(userResponse.name()) ? userResponse.name() : userResponse.login();

        user.setEmail(resolvedEmail);
        user.setFullName(fullName);
        user.setAvatar(userResponse.avatarUrl());
        user.setProvider("GITHUB");
        user.setProviderId(providerId);
        user.setIsOAuthUser(true);

        return userRepository.save(user);
    }

    private String generateUniqueUsername(String baseUsername) {
        String sanitized = baseUsername.replaceAll("[^a-zA-Z0-9._-]", "");
        if (!StringUtils.hasText(sanitized)) {
            sanitized = "github-user";
        }

        String candidate = sanitized;
        int suffix = 1;
        while (userRepository.existsByUsername(candidate)) {
            candidate = sanitized + "-" + suffix++;
        }
        return candidate;
    }

    private HttpHeaders buildAuthHeaders(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        return headers;
    }

    private static class GithubAccessTokenRequest {
        private final String client_id;
        private final String client_secret;
        private final String code;
        private final String redirect_uri;

        private GithubAccessTokenRequest(String clientId, String clientSecret, String code, String redirectUri) {
            this.client_id = clientId;
            this.client_secret = clientSecret;
            this.code = code;
            this.redirect_uri = redirectUri;
        }

        public String getClient_id() {
            return client_id;
        }

        public String getClient_secret() {
            return client_secret;
        }

        public String getCode() {
            return code;
        }

        public String getRedirect_uri() {
            return redirect_uri;
        }
    }

}
