package com.example.booking.controller;

import com.example.booking.dto.BookingRequest;
import com.example.booking.dto.BookingResponse;
import com.example.booking.messaging.BookingEventPublisher;
import com.example.booking.model.Booking;
import com.example.booking.model.Booking.BookingStatus;
import com.example.booking.service.BookingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private static final Logger log = LoggerFactory.getLogger(BookingController.class);

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingEventPublisher bookingEventPublisher;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createBooking(@RequestBody BookingRequest request) {
        log.info("[BOOKING-SERVICE] Creating booking for user {} (PENDING)", request.getUserId());
        log.info("   Tour ID: {}, Departure ID: {}, Seats: {}, Amount: {}, Override: {}",
                request.getTourId(), request.getDepartureId(), request.getSeats(), request.getTotalAmount(), request.getPaymentOverride());

        Booking booking = bookingService.createBooking(request);
        bookingEventPublisher.publishReservationRequest(
                booking.getId(),
                request.getTourId(),
                booking.getDepartureId(),
                booking.getNumSeats(),
                booking.getUserId(),
                booking.getPaymentOverride()
        );

        Map<String, Object> response = new HashMap<>();
        
        response.put("bookingId", booking.getId());
        response.put("status", booking.getStatus().name());
        response.put("message", "Booking created, processing seat reservation");
        response.put("userId", booking.getUserId());
        response.put("tourId", booking.getTourId());
        response.put("departureId", booking.getDepartureId());
        response.put("seats", booking.getNumSeats());
        response.put("totalAmount", booking.getTotalAmount());
        response.put("bookingDate", booking.getCreatedAt());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
        log.info("[BOOKING-SERVICE] Getting booking {}", id);
        Booking booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Booking>> getUserBookings(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("[BOOKING-SERVICE] Getting bookings for user {}", userId);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Booking> bookings = bookingService.getUserBookings(userId, pageable);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping
    public ResponseEntity<Page<Booking>> getAllBookings(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long tourId,
            @RequestParam(required = false) Long departureId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("[BOOKING-SERVICE] Getting bookings (status: {}, tourId: {}, departureId: {})",
                status, tourId, departureId);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Booking> bookings;

        if (departureId != null) {
            bookings = bookingService.getBookingsByDepartureId(departureId, pageable);
        } else if (tourId != null) {
            bookings = bookingService.getBookingsByTourId(tourId, pageable);
        } else if (status != null && !status.isEmpty()) {
            BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
            bookings = bookingService.getBookingsByStatus(bookingStatus, pageable);
        } else {
            bookings = bookingService.getAllBookings(pageable);
        }

        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/departure/{departureId}")
    public ResponseEntity<Page<Booking>> getBookingsByDeparture(
            @PathVariable Long departureId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("[BOOKING-SERVICE] Getting bookings for departure {}", departureId);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Booking> bookings = bookingService.getBookingsByDepartureId(departureId, pageable);
        return ResponseEntity.ok(bookings);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> cancelBooking(@PathVariable Long id) {
        log.info("[BOOKING-SERVICE] Cancelling booking {}", id);

        Booking booking = bookingService.getBookingById(id);
        Booking cancelledBooking = bookingService.cancelBooking(id);

        bookingEventPublisher.publishReservationCancel(
                booking.getId(),
                booking.getTourId(),
                booking.getDepartureId(),
                booking.getNumSeats(),
                booking.getUserId()
        );

        Map<String, Object> response = new HashMap<>();
        response.put("bookingId", cancelledBooking.getId());
        response.put("status", cancelledBooking.getStatus().name());
        response.put("message", "Booking cancelled successfully. Seats released.");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<Map<String, Object>> confirmBookingTest(@PathVariable Long id) {
        log.info("[BOOKING-SERVICE] Test confirming booking {} and sending email", id);
        
        try {
            Booking booking = bookingService.confirmBooking(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("bookingId", booking.getId());
            response.put("status", booking.getStatus().name());
            response.put("message", "Booking confirmed and email sent successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("[BOOKING-SERVICE] Error confirming booking {}: {}", id, e.getMessage(), e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("error", e.getMessage());
            response.put("message", "Failed to confirm booking");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }



    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Booking Service is healthy!");
    }
}

