package com.example.user.controller;

import com.example.user.dto.LoginRequest;
import com.example.user.dto.LoginResponse;
import com.example.user.dto.RegisterRequest;
import com.example.user.dto.RegisterResponse;
import com.example.user.service.AuthService;
import com.example.user.service.GithubOAuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import java.io.IOException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final GithubOAuthService githubOAuthService;

    @Value("${oauth.github.frontend-success-uri:http://localhost:3000/auth/callback}")
    private String frontendSuccessUri;

    @Value("${oauth.github.frontend-error-uri:http://localhost:3000/auth/error}")
    private String frontendErrorUri;

    public AuthController(AuthService authService, GithubOAuthService githubOAuthService) {
        this.authService = authService;
        this.githubOAuthService = githubOAuthService;
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
        String authorizationUrl = githubOAuthService.buildAuthorizationUrl();
        response.sendRedirect(authorizationUrl);
    }

    @PostMapping("/github/callback")
    public ResponseEntity<?> githubCallback(@RequestBody GitHubCallbackRequest request) {
        try {
            GithubOAuthService.GithubLoginResult result = githubOAuthService.handleGithubCallback(request.getCode(), request.getState());
            return ResponseEntity.ok(new LoginResponse(
                    result.getToken(),
                    result.getUsername(),
                    result.getEmail(),
                    result.getFullName(),
                    result.getAvatar(),
                    result.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("GitHub OAuth failed: " + e.getMessage()));
        }
    }

    @GetMapping("/github/callback")
    public void githubCallback(@RequestParam String code, @RequestParam(required = false) String state,
                               HttpServletResponse response) throws IOException {
        try {
            GithubOAuthService.GithubLoginResult result = githubOAuthService.handleGithubCallback(code, state);

            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(frontendSuccessUri)
                    .queryParam("token", result.getToken())
                    .queryParam("username", result.getUsername())
                    .queryParam("email", result.getEmail());

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
        } catch (Exception e) {
            String errorRedirect = UriComponentsBuilder.fromUriString(frontendErrorUri)
                    .queryParam("message", e.getMessage())
                    .build()
                    .encode()
                    .toUriString();
            response.sendRedirect(errorRedirect);
        }
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

    static class GitHubCallbackRequest {
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
