package com.example.tour.service;

import com.example.tour.dto.CreateTourRequest;
import com.example.tour.dto.UpdateTourRequest;
import com.example.tour.model.Tour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TourService {

    /**
     * List tours with filters and pagination
     * Filter by: regionId, provinceId, status, keyword
     */
    Page<Tour> listTours(Integer regionId, Integer provinceId, String status, String keyword, Pageable pageable);

    /**
     * Get tour by ID with details
     */
    Tour getTourById(Long id);

    /**
     * Create new tour
     * Logic: validate basic fields, log action
     */
    Tour createTour(CreateTourRequest request);

    /**
     * Update existing tour
     * Logic: partial update, log action
     */
    Tour updateTour(Long id, UpdateTourRequest request);

    /**
     * Delete tour
     * Logic: soft/hard delete, log action
     */
    void deleteTour(Long id);
}

