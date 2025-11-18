package com.example.booking.controller;

import com.example.booking.model.Booking;
import com.example.booking.repository.BookingRepository;
import com.example.booking.service.ExportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/export")
public class ExportController {

    private static final Logger log = LoggerFactory.getLogger(ExportController.class);

    @Autowired
    private ExportService exportService;

    @Autowired
    private BookingRepository bookingRepository;

    /**
     * Export bookings list to Excel
     * GET /export/bookings/excel
     * Optional filters: userId, tourId, status, startDate, endDate
     */
    @GetMapping("/bookings/excel")
    public ResponseEntity<Resource> exportBookingsToExcel(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long tourId,
            @RequestParam(required = false) Booking.BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        log.info("Exporting bookings to Excel with filters - userId: {}, tourId: {}, status: {}, startDate: {}, endDate: {}",
                userId, tourId, status, startDate, endDate);

        try {
            // Fetch bookings based on filters
            List<Booking> bookings = fetchBookingsWithFilters(userId, tourId, status, startDate, endDate);

            if (bookings.isEmpty()) {
                log.warn("No bookings found with given filters");
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No bookings found");
            }

            // Generate Excel
            ByteArrayInputStream excelStream = exportService.exportBookingsToExcel(bookings);

            // Prepare file name
            String fileName = "bookings_" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + ".xlsx";

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);
            headers.add(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate");
            headers.add(HttpHeaders.PRAGMA, "no-cache");
            headers.add(HttpHeaders.EXPIRES, "0");

            log.info("Excel export completed successfully with {} bookings", bookings.size());

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(new InputStreamResource(excelStream));

        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to export bookings to Excel", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to export bookings: " + e.getMessage());
        }
    }

    /**
     * Export dashboard statistics to Excel
     * GET /export/dashboard/excel
     * Required params: startDate, endDate
     */
    @GetMapping("/dashboard/excel")
    public ResponseEntity<Resource> exportDashboardStatsToExcel(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        log.info("Exporting dashboard stats from {} to {}", startDate, endDate);

        try {
            // Validate date range
            if (endDate.isBefore(startDate)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "End date must be after or equal to start date");
            }

            // Generate Excel
            ByteArrayInputStream excelStream = exportService.exportDashboardStatsToExcel(startDate, endDate);

            // Prepare file name
            String fileName = "dashboard_stats_" + startDate + "_to_" + endDate + ".xlsx";

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);
            headers.add(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate");
            headers.add(HttpHeaders.PRAGMA, "no-cache");
            headers.add(HttpHeaders.EXPIRES, "0");

            log.info("Dashboard stats Excel export completed successfully");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(new InputStreamResource(excelStream));

        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to export dashboard stats", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to export dashboard stats: " + e.getMessage());
        }
    }

    /**
     * Helper method to fetch bookings with various filters
     */
    private List<Booking> fetchBookingsWithFilters(Long userId, Long tourId,
                                                     Booking.BookingStatus status,
                                                     LocalDate startDate, LocalDate endDate) {
        // If all filters are null, return all bookings
        if (userId == null && tourId == null && status == null && startDate == null && endDate == null) {
            return bookingRepository.findAll();
        }

        // Apply specific filters
        if (userId != null) {
            return bookingRepository.findByUserId(userId, org.springframework.data.domain.Pageable.unpaged()).getContent();
        }

        if (tourId != null) {
            return bookingRepository.findByTourId(tourId);
        }

        if (status != null) {
            return bookingRepository.findByStatus(status, org.springframework.data.domain.Pageable.unpaged()).getContent();
        }

        if (startDate != null && endDate != null) {
            // Filter by date range using findAll and stream filter
            return bookingRepository.findAll().stream()
                    .filter(b -> !b.getCreatedAt().toLocalDate().isBefore(startDate)
                            && !b.getCreatedAt().toLocalDate().isAfter(endDate))
                    .toList();
        }

        // Default: return all
        return bookingRepository.findAll();
    }
}
