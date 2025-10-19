package com.example.user.dto.github;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GithubEmailResponse(
        String email,
        boolean primary,
        boolean verified
) {
    public boolean isPrimary() {
        return primary;
    }

    public boolean isVerified() {
        return verified;
    }
}

