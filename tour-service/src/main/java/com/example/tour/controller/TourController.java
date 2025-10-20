package com.example.tour.controller;

import com.example.tour.dto.CreateTourRequest;
import com.example.tour.dto.UpdateTourRequest;
import com.example.tour.model.Tour;
import com.example.tour.service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tours")
public class TourController {

    @Autowired
    private TourService tourService;

    @GetMapping
    public ResponseEntity<Page<Tour>> getTours(
            @RequestParam(required = false) Integer regionId,
            @RequestParam(required = false) Integer provinceId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, org.springframework.data.domain.Sort.by("createdAt").descending());

        Page<Tour> tours = tourService.listTours(regionId, provinceId, status, keyword, pageable);
        return ResponseEntity.ok(tours);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tour> getTourById(@PathVariable Long id) {
        Tour tour = tourService.getTourById(id);
        return ResponseEntity.ok(tour);
    }

    @PostMapping
    public ResponseEntity<Tour> createTour(@RequestBody CreateTourRequest request) {
        Tour tour = tourService.createTour(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(tour);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tour> updateTour(@PathVariable Long id, @RequestBody UpdateTourRequest request) {
        Tour tour = tourService.updateTour(id, request);
        return ResponseEntity.ok(tour);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {
        tourService.deleteTour(id);
        return ResponseEntity.ok().build();
    }


    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Tour Service is healthy!");
    }
}


