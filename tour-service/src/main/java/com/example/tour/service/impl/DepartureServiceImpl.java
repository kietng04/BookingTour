package com.example.tour.service.impl;

import com.example.tour.dto.CreateDepartureRequest;
import com.example.tour.model.Departure;
import com.example.tour.model.Tour;
import com.example.tour.repository.DepartureRepository;
import com.example.tour.repository.TourRepository;
import com.example.tour.service.DepartureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DepartureServiceImpl implements DepartureService {

    @Autowired
    private DepartureRepository departureRepository;

    @Autowired
    private TourRepository tourRepository;

    @Override
    public List<Departure> listDepartures(Long tourId, LocalDate from, LocalDate to, String status) {
        // TODO: Implement filters
        Departure.DepartureStatus departureStatus = status != null ? Departure.DepartureStatus.valueOf(status) : null;
        return departureRepository.findByTourIdAndFilters(tourId, from, to, departureStatus);
    }

    @Override
    public Departure addDeparture(Long tourId, CreateDepartureRequest request) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new RuntimeException("Tour not found"));

        Departure departure = new Departure();
        departure.setTour(tour);
        departure.setStartDate(request.getStartDate());
        departure.setEndDate(request.getEndDate());
        departure.setTotalSlots(request.getTotalSlots());
        departure.setRemainingSlots(request.getTotalSlots());

        return departureRepository.save(departure);
    }

    @Override
    public Departure updateDeparture(Long tourId, Long departureId, CreateDepartureRequest request) {
        // TODO: Verify departure belongs to tour
        Departure departure = departureRepository.findById(departureId)
                .orElseThrow(() -> new RuntimeException("Departure not found"));

        if (request.getStartDate() != null) {
            departure.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            departure.setEndDate(request.getEndDate());
        }
        if (request.getTotalSlots() != null) {
            departure.setTotalSlots(request.getTotalSlots());
        }

        return departureRepository.save(departure);
    }

    @Override
    public void deleteDeparture(Long tourId, Long departureId) {
        // TODO: Verify departure belongs to tour
        Departure departure = departureRepository.findById(departureId)
                .orElseThrow(() -> new RuntimeException("Departure not found"));
        departureRepository.delete(departure);
    }

    @Override
    public Map<String, Object> getAvailability(Long tourId, Long departureId) {
        // TODO: Check availability
        Departure departure = departureRepository.findById(departureId)
                .orElseThrow(() -> new RuntimeException("Departure not found"));

        Map<String, Object> availability = new HashMap<>();
        availability.put("departureId", departure.getId());
        availability.put("remainingSlots", departure.getRemainingSlots());
        availability.put("status", departure.getStatus());
        availability.put("available", departure.getRemainingSlots() > 0);

        return availability;
    }

    @Override
    public void reserveSlots(Long departureId, Integer quantity) {
        // TODO: Decrease remainingSlots (called by SAGA)
        // TODO: Add idempotency check
        Departure departure = departureRepository.findById(departureId)
                .orElseThrow(() -> new RuntimeException("Departure not found"));

        if (departure.getRemainingSlots() < quantity) {
            throw new RuntimeException("Not enough slots available");
        }

        departure.setRemainingSlots(departure.getRemainingSlots() - quantity);
        departureRepository.save(departure);
    }

    @Override
    public void releaseSlots(Long departureId, Integer quantity) {
        // TODO: Increase remainingSlots
        // TODO: Add idempotency check
        Departure departure = departureRepository.findById(departureId)
                .orElseThrow(() -> new RuntimeException("Departure not found"));

        departure.setRemainingSlots(departure.getRemainingSlots() + quantity);
        departureRepository.save(departure);
    }
}

