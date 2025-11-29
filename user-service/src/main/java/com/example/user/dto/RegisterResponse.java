package com.example.user.dto;

public class RegisterResponse {
    private String token;
    private String username;
    private String email;
    private String message;
    private Long userId;

    public RegisterResponse() {}

    public RegisterResponse(String token, String username, String email, String message, Long userId) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.message = message;
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
