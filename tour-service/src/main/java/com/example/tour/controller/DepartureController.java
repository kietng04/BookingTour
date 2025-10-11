package com.example.tour.controller;

import com.example.tour.dto.CreateDepartureRequest;
import com.example.tour.model.Departure;
import com.example.tour.service.DepartureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tours/{tourId}/departures")
public class DepartureController {

    @Autowired
    private DepartureService departureService;

    /**
     * GET /tours/{tourId}/departures?from=&to=&status=
     * List departures for a tour
     */
    @GetMapping
    public ResponseEntity<List<Departure>> listDepartures(
            @PathVariable Long tourId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) String status) {

        List<Departure> departures = departureService.listDepartures(tourId, from, to, status);
        return ResponseEntity.ok(departures);
    }

    /**
     * GET /tours/{tourId}/availability?departureId=
     * Get availability for specific departure
     */
    @GetMapping("/availability")
    public ResponseEntity<Map<String, Object>> getAvailability(@PathVariable Long tourId,
                                                                 @RequestParam Long departureId) {
        Map<String, Object> availability = departureService.getAvailability(tourId, departureId);
        return ResponseEntity.ok(availability);
    }

    /**
     * POST /tours/{tourId}/departures [ADMIN]
     * Add departure to tour
     */
    @PostMapping
    public ResponseEntity<Departure> addDeparture(@PathVariable Long tourId,
                                                   @RequestBody CreateDepartureRequest request) {
        Departure departure = departureService.addDeparture(tourId, request);
        return ResponseEntity.ok(departure);
    }

    /**
     * PUT /tours/{tourId}/departures/{departureId} [ADMIN]
     * Update departure
     */
    @PutMapping("/{departureId}")
    public ResponseEntity<Departure> updateDeparture(@PathVariable Long tourId,
                                                      @PathVariable Long departureId,
                                                      @RequestBody CreateDepartureRequest request) {
        Departure departure = departureService.updateDeparture(tourId, departureId, request);
        return ResponseEntity.ok(departure);
    }

    /**
     * DELETE /tours/{tourId}/departures/{departureId} [ADMIN]
     * Delete departure
     */
    @DeleteMapping("/{departureId}")
    public ResponseEntity<Void> deleteDeparture(@PathVariable Long tourId, @PathVariable Long departureId) {
        departureService.deleteDeparture(tourId, departureId);
        return ResponseEntity.ok().build();
    }
}

