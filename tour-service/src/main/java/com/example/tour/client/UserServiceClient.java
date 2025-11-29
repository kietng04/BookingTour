package com.example.tour.client;

import com.example.tour.dto.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;


@Component
public class UserServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceClient.class);
    private static final String USER_SERVICE_URL = "http://user-service";

    @Autowired
    private RestTemplate restTemplate;


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


            return null;
        }
    }
}
