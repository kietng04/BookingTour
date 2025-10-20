package com.example.tour.service;

import com.example.tour.dto.CreateDepartureRequest;
import com.example.tour.model.Departure;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface DepartureService {

    List<Departure> listDepartures(Long tourId, LocalDate from, LocalDate to, String status);

    Departure addDeparture(Long tourId, CreateDepartureRequest request);

    Departure updateDeparture(Long tourId, Long departureId, CreateDepartureRequest request);

    void deleteDeparture(Long tourId, Long departureId);

    Map<String, Object> getAvailability(Long tourId, Long departureId);

    void reserveSlots(Long departureId, Integer quantity);

    void releaseSlots(Long departureId, Integer quantity);
}


