package com.example.user.service;

public class OAuthLoginResult {
    private final String token;
    private final String username;
    private final String email;
    private final String fullName;
    private final String avatar;
    private final String message;
    private final Long userId;

    public OAuthLoginResult(String token,
                            String username,
                            String email,
                            String fullName,
                            String avatar,
                            String message,
                            Long userId) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.avatar = avatar;
        this.message = message;
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public String getAvatar() {
        return avatar;
    }

    public String getMessage() {
        return message;
    }

    public Long getUserId() {
        return userId;
    }
}
