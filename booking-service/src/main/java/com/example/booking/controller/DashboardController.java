package com.example.booking.controller;

import com.example.booking.dto.dashboard.*;
import com.example.booking.service.DashboardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private static final Logger log = LoggerFactory.getLogger(DashboardController.class);

    @Autowired
    private DashboardService dashboardService;


    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (endDate == null) {
            endDate = LocalDate.now();
        }
        if (startDate == null) {
            startDate = endDate.minusDays(30);
        }

        log.info("GET /dashboard/stats - startDate: {}, endDate: {}", startDate, endDate);

        DashboardStatsDTO stats = dashboardService.getDashboardStats(startDate, endDate);
        return ResponseEntity.ok(stats);
    }


    @GetMapping("/revenue-trends")
    public ResponseEntity<List<RevenueTrendDTO>> getRevenueTrends(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (endDate == null) {
            endDate = LocalDate.now();
        }
        if (startDate == null) {
            startDate = endDate.minusDays(30);
        }

        log.info("GET /dashboard/revenue-trends - startDate: {}, endDate: {}", startDate, endDate);

        List<RevenueTrendDTO> trends = dashboardService.getRevenueTrends(startDate, endDate);
        return ResponseEntity.ok(trends);
    }


    @GetMapping("/top-tours")
    public ResponseEntity<List<TopTourDTO>> getTopTours(
            @RequestParam(defaultValue = "5") int limit) {

        log.info("GET /dashboard/top-tours - limit: {}", limit);

        List<TopTourDTO> topTours = dashboardService.getTopTours(limit);
        return ResponseEntity.ok(topTours);
    }


    @GetMapping("/booking-status")
    public ResponseEntity<List<BookingStatusStatsDTO>> getBookingStatusStats() {
        log.info("GET /dashboard/booking-status");

        List<BookingStatusStatsDTO> statusStats = dashboardService.getBookingStatusStats();
        return ResponseEntity.ok(statusStats);
    }


    @GetMapping("/departure-occupancy")
    public ResponseEntity<List<DepartureOccupancyDTO>> getDepartureOccupancy() {
        log.info("GET /dashboard/departure-occupancy");

        List<DepartureOccupancyDTO> occupancy = dashboardService.getDepartureOccupancy();
        return ResponseEntity.ok(occupancy);
    }
}
