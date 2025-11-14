package com.example.tour.client;

import com.example.tour.dto.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * Client for communicating with user-service via service discovery
 */
@Component
public class UserServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceClient.class);
    private static final String USER_SERVICE_URL = "http://user-service";

    @Autowired
    private RestTemplate restTemplate;

    /**
     * Fetch user information by user ID from user-service
     * @param userId the user ID
     * @return UserDTO containing user information, or null if not found
     */
    public UserDTO getUserById(Long userId) {
        try {
            String url = USER_SERVICE_URL + "/users/" + userId;
            logger.info("Fetching user info from user-service: {}", url);

            UserDTO user = restTemplate.getForObject(url, UserDTO.class);

            if (user != null) {
                logger.info("Successfully fetched user info for userId: {}", userId);
            } else {
                logger.warn("User not found for userId: {}", userId);
            }

            return user;
        } catch (Exception e) {
            logger.error("Error fetching user info for userId: {}. Error: {}", userId, e.getMessage());
            // Return null if user-service is down or user not found
            // ReviewService will handle this gracefully with fallback
            return null;
        }
    }
}
