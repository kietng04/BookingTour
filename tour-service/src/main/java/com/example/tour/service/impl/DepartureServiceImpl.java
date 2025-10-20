package com.example.tour.service.impl;

import com.example.tour.dto.CreateDepartureRequest;
import com.example.tour.model.Departure;
import com.example.tour.model.Tour;
import com.example.tour.repository.DepartureRepository;
import com.example.tour.repository.TourRepository;
import com.example.tour.service.DepartureService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class DepartureServiceImpl implements DepartureService {

    private final DepartureRepository departureRepository;
    private final TourRepository tourRepository;

    public DepartureServiceImpl(DepartureRepository departureRepository,
                                TourRepository tourRepository) {
        this.departureRepository = departureRepository;
        this.tourRepository = tourRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Departure> listDepartures(Long tourId, LocalDate from, LocalDate to, String status) {
        validateDateRange(from, to);
        Departure.DepartureStatus departureStatus = parseStatus(status);
        return departureRepository.findByTourIdAndFilters(tourId, from, to, departureStatus);
    }

    @Override
    public Departure addDeparture(Long tourId, CreateDepartureRequest request) {
        if (request.getStartDate() == null || request.getEndDate() == null || request.getTotalSlots() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "startDate, endDate and totalSlots are required");
        }
        validateDates(request.getStartDate(), request.getEndDate());

        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Tour not found for id " + tourId));

        Departure departure = new Departure();
        departure.setTour(tour);
        departure.setStartDate(request.getStartDate());
        departure.setEndDate(request.getEndDate());
        departure.setTotalSlots(request.getTotalSlots());
        departure.setRemainingSlots(request.getTotalSlots());
        refreshStatus(departure);

        return departureRepository.save(departure);
    }

    @Override
    public Departure updateDeparture(Long tourId, Long departureId, CreateDepartureRequest request) {
        validateDates(request.getStartDate(), request.getEndDate());

        Departure departure = getDepartureForTour(tourId, departureId);

        if (request.getStartDate() != null) {
            departure.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            departure.setEndDate(request.getEndDate());
        }
        if (request.getTotalSlots() != null) {
            int reserved = departure.getTotalSlots() - departure.getRemainingSlots();
            if (request.getTotalSlots() < reserved) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "totalSlots cannot be smaller than already reserved seats (" + reserved + ")");
            }
            departure.setTotalSlots(request.getTotalSlots());
            departure.setRemainingSlots(request.getTotalSlots() - reserved);
        }

        refreshStatus(departure);

        return departureRepository.save(departure);
    }

    @Override
    public void deleteDeparture(Long tourId, Long departureId) {
        Departure departure = getDepartureForTour(tourId, departureId);
        departureRepository.delete(departure);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAvailability(Long tourId, Long departureId) {
        Departure departure = getDepartureForTour(tourId, departureId);

        Map<String, Object> availability = new HashMap<>();
        availability.put("departureId", departure.getId());
        availability.put("remainingSlots", departure.getRemainingSlots());
        availability.put("totalSlots", departure.getTotalSlots());
        availability.put("status", departure.getStatus());
        availability.put("available", departure.getRemainingSlots() > 0);

        return availability;
    }

    @Override
    public void reserveSlots(Long departureId, Integer quantity) {
        Departure departure = departureRepository.findById(departureId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Departure not found for id " + departureId));

        if (quantity == null || quantity <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "quantity must be greater than 0");
        }

        if (departure.getRemainingSlots() < quantity) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Not enough slots available");
        }

        departure.setRemainingSlots(departure.getRemainingSlots() - quantity);
        refreshStatus(departure);
        departureRepository.save(departure);
    }

    @Override
    public void releaseSlots(Long departureId, Integer quantity) {
        Departure departure = departureRepository.findById(departureId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Departure not found for id " + departureId));

        if (quantity == null || quantity <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "quantity must be greater than 0");
        }

        int updatedRemaining = Math.min(departure.getTotalSlots(),
                departure.getRemainingSlots() + quantity);
        departure.setRemainingSlots(updatedRemaining);
        refreshStatus(departure);
        departureRepository.save(departure);
    }

    private Departure getDepartureForTour(Long tourId, Long departureId) {
        Departure departure = departureRepository.findById(departureId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Departure not found for id " + departureId));

        if (!departure.getTour().getId().equals(tourId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Departure " + departureId + " does not belong to tour " + tourId);
        }
        return departure;
    }

    private Departure.DepartureStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }

        return Arrays.stream(Departure.DepartureStatus.values())
                .filter(value -> value.name().equalsIgnoreCase(status))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Invalid status value: " + status));
    }

    private void validateDateRange(LocalDate from, LocalDate to) {
        if (from != null && to != null && to.isBefore(from)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "'to' date must be greater than or equal to 'from' date");
        }
    }

    private void validateDates(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "endDate must be greater than or equal to startDate");
        }
    }

    private void refreshStatus(Departure departure) {
        departure.setStatus(calculateStatus(departure));
    }

    private Departure.DepartureStatus calculateStatus(Departure departure) {
        LocalDate startDate = departure.getStartDate();
        if (startDate != null && startDate.isBefore(LocalDate.now())) {
            return Departure.DepartureStatus.DAKHOIHANH;
        }

        int remaining = departure.getRemainingSlots() == null ? 0 : departure.getRemainingSlots();
        if (remaining <= 0) {
            return Departure.DepartureStatus.FULL;
        }

        int totalSlots = departure.getTotalSlots() == null ? 0 : departure.getTotalSlots();
        if (totalSlots > 0) {
            double ratio = (double) remaining / totalSlots;
            if (ratio <= 0.2d) {
                return Departure.DepartureStatus.SAPFULL;
            }
        }

        return Departure.DepartureStatus.CONCHO;
    }
}

