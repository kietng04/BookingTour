package com.example.tour.service;

import com.example.tour.dto.CreateCustomTourRequest;
import com.example.tour.dto.CustomTourResponse;
import com.example.tour.dto.UpdateCustomTourStatusRequest;
import com.example.tour.model.CustomTour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomTourService {


    CustomTourResponse createCustomTour(Long userId, CreateCustomTourRequest request);


    CustomTourResponse getCustomTourById(Long id);


    List<CustomTourResponse> getCustomToursByUserId(Long userId);


    Page<CustomTourResponse> getAllCustomTours(CustomTour.CustomTourStatus status, Pageable pageable);


    Page<CustomTourResponse> getCustomToursWithFilters(
        CustomTour.CustomTourStatus status,
        Long userId,
        String keyword,
        Pageable pageable);


    CustomTourResponse updateCustomTourStatus(Long id, UpdateCustomTourStatusRequest request);


    void deleteCustomTour(Long id);


    long countByStatus(CustomTour.CustomTourStatus status);
}
