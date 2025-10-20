package com.example.user.service;

import com.example.user.model.User;
import com.example.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        processOAuth2User(userRequest, oAuth2User);
        return oAuth2User;
    }

    private User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String providerId = oAuth2User.getName();
        String email = resolveEmail(userRequest, oAuth2User, providerId);
        String name = oAuth2User.getAttribute("name");
        String avatar = oAuth2User.getAttribute("avatar_url");

        Optional<User> existingUser = userRepository.findByProviderId(providerId);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            user.setEmail(email != null ? email : user.getEmail());
            user.setFullName(name != null ? name : user.getFullName());
            user.setAvatar(avatar);
            user.setIsOAuthUser(true);
            user.setProvider(registrationId.toUpperCase());
        } else {
            user = new User();
            user.setUsername(providerId);
            user.setEmail(email);
            user.setFullName(name);
            user.setProvider(registrationId.toUpperCase());
            user.setProviderId(providerId);
            user.setAvatar(avatar);
            user.setIsOAuthUser(true);
            user.setPassword("");
        }

        return userRepository.save(user);
    }

    private String resolveEmail(OAuth2UserRequest userRequest, OAuth2User oAuth2User, String providerId) {
        String email = oAuth2User.getAttribute("email");
        if (email != null && !email.isBlank()) {
            return email;
        }

        if ("github".equalsIgnoreCase(userRequest.getClientRegistration().getRegistrationId())) {
            String primaryEmail = fetchPrimaryGithubEmail(userRequest);
            if (primaryEmail != null && !primaryEmail.isBlank()) {
                return primaryEmail;
            }
        }

        return providerId + "@users.noreply.github.com";
    }

    private String fetchPrimaryGithubEmail(OAuth2UserRequest userRequest) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(userRequest.getAccessToken().getTokenValue());
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    "https://api.github.com/user/emails",
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<>() {}
            );

            if (response.getBody() == null) {
                return null;
            }

            for (Map<String, Object> emailEntry : response.getBody()) {
                Boolean primary = (Boolean) emailEntry.get("primary");
                Boolean verified = (Boolean) emailEntry.get("verified");
                String emailValue = (String) emailEntry.get("email");
                if (Boolean.TRUE.equals(primary) && Boolean.TRUE.equals(verified) && emailValue != null && !emailValue.isBlank()) {
                    return emailValue;
                }
            }

            for (Map<String, Object> emailEntry : response.getBody()) {
                String emailValue = (String) emailEntry.get("email");
                if (emailValue != null && !emailValue.isBlank()) {
                    return emailValue;
                }
            }
        } catch (RestClientException ex) {
        }

        return null;
    }
}

