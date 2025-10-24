package com.example.user.controller;

import com.example.user.dto.LoginRequest;
import com.example.user.dto.LoginResponse;
import com.example.user.dto.RegisterRequest;
import com.example.user.dto.RegisterResponse;
import com.example.user.service.AuthService;
import com.example.user.service.GithubOAuthService;
import com.example.user.service.GoogleOAuthService;
import com.example.user.service.OAuthLoginResult;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final GithubOAuthService githubOAuthService;
    private final GoogleOAuthService googleOAuthService;
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Value("${oauth.github.frontend-success-uri:http://localhost:3000/auth/callback}")
    private String frontendSuccessUri;

    @Value("${oauth.github.frontend-error-uri:http://localhost:3000/auth/error}")
    private String frontendErrorUri;

    @Value("${oauth.google.frontend-success-uri:http://localhost:3000/auth/callback}")
    private String googleFrontendSuccessUri;

    @Value("${oauth.google.frontend-error-uri:http://localhost:3000/auth/error}")
    private String googleFrontendErrorUri;

    public AuthController(AuthService authService,
                          GithubOAuthService githubOAuthService,
                          GoogleOAuthService googleOAuthService) {
        this.authService = authService;
        this.githubOAuthService = githubOAuthService;
        this.googleOAuthService = googleOAuthService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            RegisterResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/start-oauth/github")
    public void startGithubOAuth(HttpServletResponse response) throws IOException {
        logger.debug("Handling GitHub OAuth start request");
        String authorizationUrl = githubOAuthService.buildAuthorizationUrl();
        response.sendRedirect(authorizationUrl);
    }

    @GetMapping("/start-oauth/google")
    public void startGoogleOAuth(HttpServletResponse response) throws IOException {
        try {
            logger.debug("Handling Google OAuth start request");
            String authorizationUrl = googleOAuthService.buildAuthorizationUrl();
            response.sendRedirect(authorizationUrl);
        } catch (Exception ex) {
            logger.error("Failed to initiate Google OAuth", ex);
            response.sendError(HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage());
        }
    }

    @PostMapping("/github/callback")
    public ResponseEntity<?> githubCallback(@RequestBody OAuthCallbackRequest request) {
        try {
            OAuthLoginResult result = githubOAuthService.handleGithubCallback(request.getCode(), request.getState());
            return ResponseEntity.ok(toLoginResponse(result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("GitHub OAuth failed: " + e.getMessage()));
        }
    }

    @GetMapping("/github/callback")
    public void githubCallback(@RequestParam String code, @RequestParam(required = false) String state,
                               HttpServletResponse response) throws IOException {
        try {
            OAuthLoginResult result = githubOAuthService.handleGithubCallback(code, state);

            sendSuccessRedirect(response, result, frontendSuccessUri, "github");
        } catch (Exception e) {
            sendErrorRedirect(response, frontendErrorUri, e.getMessage(), "github");
        }
    }

    @PostMapping("/google/callback")
    public ResponseEntity<?> googleCallback(@RequestBody OAuthCallbackRequest request) {
        try {
            OAuthLoginResult result = googleOAuthService.handleGoogleCallback(request.getCode(), request.getState());
            return ResponseEntity.ok(toLoginResponse(result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Google OAuth failed: " + e.getMessage()));
        }
    }

    @GetMapping("/google/callback")
    public void googleCallback(@RequestParam String code, @RequestParam(required = false) String state,
                               HttpServletResponse response) throws IOException {
        try {
            OAuthLoginResult result = googleOAuthService.handleGoogleCallback(code, state);
            sendSuccessRedirect(response, result, googleFrontendSuccessUri, "google");
        } catch (Exception e) {
            sendErrorRedirect(response, googleFrontendErrorUri, e.getMessage(), "google");
        }
    }

    private LoginResponse toLoginResponse(OAuthLoginResult result) {
        return new LoginResponse(
                result.getToken(),
                result.getUsername(),
                result.getEmail(),
                result.getFullName(),
                result.getAvatar(),
                result.getMessage()
        );
    }

    private void sendSuccessRedirect(HttpServletResponse response,
                                     OAuthLoginResult result,
                                     String successUri,
                                     String provider) throws IOException {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(successUri)
                .queryParam("token", result.getToken())
                .queryParam("username", result.getUsername())
                .queryParam("email", result.getEmail())
                .queryParam("provider", provider);

        if (result.getFullName() != null) {
            builder.queryParam("fullName", result.getFullName());
        }

        if (result.getAvatar() != null) {
            builder.queryParam("avatar", result.getAvatar());
        }

        String redirectUrl = builder
                .build()
                .encode()
                .toUriString();

        response.sendRedirect(redirectUrl);
    }

    private void sendErrorRedirect(HttpServletResponse response,
                                   String errorUri,
                                   String message,
                                   String provider) throws IOException {
        String errorRedirect = UriComponentsBuilder.fromUriString(errorUri)
                .queryParam("message", message)
                .queryParam("provider", provider)
                .build()
                .encode()
                .toUriString();
        response.sendRedirect(errorRedirect);
    }

    static class ErrorResponse {
        private String error;

        public ErrorResponse(String error) {
            this.error = error;
        }

        public String getError() {
            return error;
        }

        public void setError(String error) {
            this.error = error;
        }
    }

    static class OAuthCallbackRequest {
        private String code;
        private String state;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getState() {
            return state;
        }

        public void setState(String state) {
            this.state = state;
        }
    }
}

