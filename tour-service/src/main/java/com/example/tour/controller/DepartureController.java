package com.example.tour.controller;

import com.example.tour.dto.CreateDepartureRequest;
import com.example.tour.model.Departure;
import com.example.tour.service.DepartureService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@Validated
@RequestMapping("/tours/{tourId}/departures")
public class DepartureController {

    @Autowired
    private DepartureService departureService;

    @GetMapping
    public ResponseEntity<List<Departure>> listDepartures(
            @PathVariable Long tourId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) String status) {

        List<Departure> departures = departureService.listDepartures(tourId, from, to, status);
        return ResponseEntity.ok(departures);
    }

    @GetMapping("/availability")
    public ResponseEntity<Map<String, Object>> getAvailability(@PathVariable Long tourId,
                                                               @RequestParam Long departureId) {
        Map<String, Object> availability = departureService.getAvailability(tourId, departureId);
        return ResponseEntity.ok(availability);
    }

    @PostMapping
    public ResponseEntity<Departure> addDeparture(@PathVariable Long tourId,
                                                  @Valid @RequestBody CreateDepartureRequest request) {
        Departure departure = departureService.addDeparture(tourId, request);
        return ResponseEntity.ok(departure);
    }

    @PutMapping("/{departureId}")
    public ResponseEntity<Departure> updateDeparture(@PathVariable Long tourId,
                                                     @PathVariable Long departureId,
                                                     @Valid @RequestBody CreateDepartureRequest request) {
        Departure departure = departureService.updateDeparture(tourId, departureId, request);
        return ResponseEntity.ok(departure);
    }

    @DeleteMapping("/{departureId}")
    public ResponseEntity<Void> deleteDeparture(@PathVariable Long tourId, @PathVariable Long departureId) {
        departureService.deleteDeparture(tourId, departureId);
        return ResponseEntity.ok().build();
    }
}
