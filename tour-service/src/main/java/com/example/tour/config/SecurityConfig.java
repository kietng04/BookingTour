package com.example.tour.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - GET requests for tours
                        .requestMatchers("GET", "/tours/**").permitAll()
                        .requestMatchers("/actuator/**").permitAll()
                        // Protected endpoints - POST/PUT/DELETE require authentication
                        // TODO: Add JWT filter and role-based authorization (ADMIN only)
                        .anyRequest().permitAll() // Temporarily permit all for development
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        return http.build();
    }
}

