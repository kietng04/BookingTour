package com.example.tour.service;

import com.example.tour.dto.CreateTourRequest;
import com.example.tour.dto.UpdateTourRequest;
import com.example.tour.model.Tour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TourService {

    Page<Tour> listTours(Integer regionId, Integer provinceId, String status, String keyword, Pageable pageable);

    Tour getTourById(Long id);

    Tour createTour(CreateTourRequest request);

    Tour updateTour(Long id, UpdateTourRequest request);

    void deleteTour(Long id);
}

