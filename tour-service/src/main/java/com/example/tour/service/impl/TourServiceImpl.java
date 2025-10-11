package com.example.tour.service.impl;

import com.example.tour.dto.CreateTourRequest;
import com.example.tour.dto.UpdateTourRequest;
import com.example.tour.model.Tour;
import com.example.tour.repository.TourRepository;
import com.example.tour.service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class TourServiceImpl implements TourService {

    @Autowired
    private TourRepository tourRepository;

    @Override
    public Page<Tour> listTours(Integer regionId, Integer provinceId, String status, String keyword, Pageable pageable) {
        // TODO: Implement filter logic with keyword/region/province/status
        // For now, return all tours
        return tourRepository.findAll(pageable);
    }

    @Override
    public Tour getTourById(Long id) {
        // TODO: Load detail + aggregations (lazy/explicit fetch)
        return tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tour not found with id: " + id));
    }

    @Override
    public Tour createTour(CreateTourRequest request) {
        // TODO: Validate basic fields, log action
        Tour tour = new Tour();
        tour.setTourName(request.getTourName());
        tour.setRegionId(request.getRegionId());
        tour.setProvinceId(request.getProvinceId());
        tour.setDescription(request.getDescription());
        tour.setDays(request.getDays());
        tour.setNights(request.getNights());
        tour.setDeparturePoint(request.getDeparturePoint());
        tour.setMainDestination(request.getMainDestination());
        tour.setAdultPrice(request.getAdultPrice());
        tour.setChildPrice(request.getChildPrice());
        
        return tourRepository.save(tour);
    }

    @Override
    public Tour updateTour(Long id, UpdateTourRequest request) {
        // TODO: Partial update, log action
        Tour tour = getTourById(id);
        
        if (request.getTourName() != null) tour.setTourName(request.getTourName());
        if (request.getRegionId() != null) tour.setRegionId(request.getRegionId());
        if (request.getProvinceId() != null) tour.setProvinceId(request.getProvinceId());
        if (request.getDescription() != null) tour.setDescription(request.getDescription());
        if (request.getDays() != null) tour.setDays(request.getDays());
        if (request.getNights() != null) tour.setNights(request.getNights());
        if (request.getDeparturePoint() != null) tour.setDeparturePoint(request.getDeparturePoint());
        if (request.getMainDestination() != null) tour.setMainDestination(request.getMainDestination());
        if (request.getAdultPrice() != null) tour.setAdultPrice(request.getAdultPrice());
        if (request.getChildPrice() != null) tour.setChildPrice(request.getChildPrice());
        if (request.getStatus() != null) {
            tour.setStatus(Tour.TourStatus.valueOf(request.getStatus()));
        }
        
        return tourRepository.save(tour);
    }

    @Override
    public void deleteTour(Long id) {
        // TODO: Soft/hard delete, log action
        Tour tour = getTourById(id);
        tourRepository.delete(tour);
    }
}

