package com.example.tour.service;

import com.example.tour.dto.CreateCustomTourRequest;
import com.example.tour.dto.CustomTourResponse;
import com.example.tour.dto.UpdateCustomTourStatusRequest;
import com.example.tour.model.CustomTour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomTourService {

    /**
     * Create a new custom tour request
     * @param userId User ID who is requesting the custom tour
     * @param request Custom tour request data
     * @return Created custom tour response
     */
    CustomTourResponse createCustomTour(Long userId, CreateCustomTourRequest request);

    /**
     * Get custom tour by ID
     * @param id Custom tour ID
     * @return Custom tour response
     */
    CustomTourResponse getCustomTourById(Long id);

    /**
     * Get all custom tours by user ID
     * @param userId User ID
     * @return List of custom tours for the user
     */
    List<CustomTourResponse> getCustomToursByUserId(Long userId);

    /**
     * Get all custom tours with optional status filter and pagination
     * @param status Optional status filter
     * @param pageable Pagination parameters
     * @return Page of custom tours
     */
    Page<CustomTourResponse> getAllCustomTours(CustomTour.CustomTourStatus status, Pageable pageable);

    /**
     * Get custom tours with filters
     * @param status Optional status filter
     * @param userId Optional user ID filter
     * @param keyword Optional keyword search
     * @param pageable Pagination parameters
     * @return Page of custom tours
     */
    Page<CustomTourResponse> getCustomToursWithFilters(
        CustomTour.CustomTourStatus status,
        Long userId,
        String keyword,
        Pageable pageable);

    /**
     * Update custom tour status (admin function)
     * @param id Custom tour ID
     * @param request Update request with new status and admin notes
     * @return Updated custom tour response
     */
    CustomTourResponse updateCustomTourStatus(Long id, UpdateCustomTourStatusRequest request);

    /**
     * Delete custom tour
     * @param id Custom tour ID
     */
    void deleteCustomTour(Long id);

    /**
     * Get count of custom tours by status
     * @param status Status to count
     * @return Count of custom tours
     */
    long countByStatus(CustomTour.CustomTourStatus status);
}
