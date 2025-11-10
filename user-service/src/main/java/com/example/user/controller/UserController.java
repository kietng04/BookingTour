package com.example.user.controller;

import com.example.user.dto.UpdateProfileRequest;
import com.example.user.model.User;
import com.example.user.repository.UserRepository;
import com.example.user.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().build();
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().build();
        }
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setUsername(updatedUser.getUsername());
            user.setEmail(updatedUser.getEmail());
            user.setFullName(updatedUser.getFullName());
            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String token,
                                           @RequestBody UpdateProfileRequest request) {
        try {
            // Extract token from Bearer
            String jwtToken = token.substring(7);
            String email = jwtUtil.extractEmail(jwtToken);
            
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Update allowed fields for OAuth users
            if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
                user.setFullName(request.getFullName().trim());
            }
            
            if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty()) {
                user.setPhoneNumber(request.getPhoneNumber().trim());
            }

            userRepository.save(user);

            return ResponseEntity.ok().body("{\"message\": \"Profile updated successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        try {
            // Extract token from Bearer
            String jwtToken = token.substring(7);
            String email = jwtUtil.extractEmail(jwtToken);
            
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("User Service is healthy!");
    }
}

