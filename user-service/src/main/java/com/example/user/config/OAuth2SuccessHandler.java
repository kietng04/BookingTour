package com.example.user.config;

import com.example.user.model.User;
import com.example.user.repository.UserRepository;
import com.example.user.util.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String providerId = oAuth2User.getName();

        Optional<User> userOpt = userRepository.findByProviderId(providerId);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String jwtToken = jwtUtil.generateToken(user.getUsername(), user.getEmail());
            
            String redirectUrl = String.format(
                "http://localhost:3000/auth/callback?token=%s&username=%s&email=%s",
                URLEncoder.encode(jwtToken, StandardCharsets.UTF_8),
                URLEncoder.encode(user.getUsername(), StandardCharsets.UTF_8),
                URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8)
            );
            
            response.sendRedirect(redirectUrl);
        } else {
            response.sendRedirect("http://localhost:3000/auth/error?message=User not found");
        }
    }
}
