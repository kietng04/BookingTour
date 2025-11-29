package com.example.tour.controller;

import com.example.tour.dto.CreateCustomTourRequest;
import com.example.tour.dto.CustomTourResponse;
import com.example.tour.dto.UpdateCustomTourStatusRequest;
import com.example.tour.model.CustomTour;
import com.example.tour.service.CustomTourService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/custom-tours")
public class CustomTourController {

    @Autowired
    private CustomTourService customTourService;




    @PostMapping
    public ResponseEntity<CustomTourResponse> createCustomTour(
            @RequestParam Long userId,
            @Valid @RequestBody CreateCustomTourRequest request) {
        CustomTourResponse response = customTourService.createCustomTour(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @GetMapping("/{id}")
    public ResponseEntity<CustomTourResponse> getCustomTourById(@PathVariable Long id) {
        CustomTourResponse response = customTourService.getCustomTourById(id);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CustomTourResponse>> getCustomToursByUserId(@PathVariable Long userId) {
        List<CustomTourResponse> customTours = customTourService.getCustomToursByUserId(userId);
        return ResponseEntity.ok(customTours);
    }




    @GetMapping("/admin")
    public ResponseEntity<Page<CustomTourResponse>> getAllCustomTours(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());


        CustomTour.CustomTourStatus customTourStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                customTourStatus = CustomTour.CustomTourStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        Page<CustomTourResponse> customTours;
        if (userId != null || keyword != null || customTourStatus != null) {
            customTours = customTourService.getCustomToursWithFilters(
                    customTourStatus, userId, keyword, pageable);
        } else {
            customTours = customTourService.getAllCustomTours(null, pageable);
        }

        return ResponseEntity.ok(customTours);
    }


    @PutMapping("/{id}/status")
    public ResponseEntity<CustomTourResponse> updateCustomTourStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCustomTourStatusRequest request) {
        CustomTourResponse response = customTourService.updateCustomTourStatus(id, request);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomTour(@PathVariable Long id) {
        customTourService.deleteCustomTour(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(java.util.Map.of(
                "pending", customTourService.countByStatus(CustomTour.CustomTourStatus.PENDING),
                "completed", customTourService.countByStatus(CustomTour.CustomTourStatus.COMPLETED),
                "rejected", customTourService.countByStatus(CustomTour.CustomTourStatus.REJECTED)
        ));
    }
}
