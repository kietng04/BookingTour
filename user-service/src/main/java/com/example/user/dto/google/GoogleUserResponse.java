package com.example.user.dto.google;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GoogleUserResponse(
        String sub,
        String name,
        String email,
        @JsonProperty("email_verified") Boolean emailVerified,
        @JsonProperty("picture") String picture,
        @JsonProperty("given_name") String givenName,
        @JsonProperty("family_name") String familyName
) {
}

