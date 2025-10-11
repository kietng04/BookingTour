package com.example.tour.service;

import com.example.tour.dto.CreateDepartureRequest;
import com.example.tour.model.Departure;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface DepartureService {

    /**
     * List departures for a tour with filters
     */
    List<Departure> listDepartures(Long tourId, LocalDate from, LocalDate to, String status);

    /**
     * Add departure to tour
     */
    Departure addDeparture(Long tourId, CreateDepartureRequest request);

    /**
     * Update departure
     */
    Departure updateDeparture(Long tourId, Long departureId, CreateDepartureRequest request);

    /**
     * Delete departure
     */
    void deleteDeparture(Long tourId, Long departureId);

    /**
     * Get availability info for a specific departure
     * Returns: remainingSlots, status
     */
    Map<String, Object> getAvailability(Long tourId, Long departureId);

    /**
     * Reserve slots for a departure
     * Logic: decrease remainingSlots (called by SAGA)
     */
    void reserveSlots(Long departureId, Integer quantity);

    /**
     * Release slots for a departure
     * Logic: increase remainingSlots
     */
    void releaseSlots(Long departureId, Integer quantity);
}

