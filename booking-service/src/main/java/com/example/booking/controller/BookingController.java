package com.example.booking.controller;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.booking.dto.BookingRequest;
import com.example.booking.dto.BookingResponse;
import com.example.booking.dto.PaymentChargeMessage;
import com.example.booking.messaging.PaymentCommandPublisher;

@RestController
@RequestMapping("/bookings")
public class BookingController {
    
    private static final Logger log = LoggerFactory.getLogger(BookingController.class);
    
    @Autowired
    private PaymentCommandPublisher paymentPublisher;
    
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest request) {
        String bookingId = UUID.randomUUID().toString();
        
        log.info("🎫 [BOOKING-SERVICE] Creating booking {} for user {} (PENDING)", bookingId, request.getUserId());
        log.info("   Tour ID: {}, Departure ID: {}, Seats: {}, Amount: {}", 
            request.getTourId(), request.getDepartureId(), request.getSeats(), request.getTotalAmount());
        
        PaymentChargeMessage chargeMessage = new PaymentChargeMessage(
            bookingId, 
            request.getTotalAmount(), 
            request.getUserId()
        );
        paymentPublisher.publishChargeRequest(chargeMessage);
        
        BookingResponse response = new BookingResponse(
            bookingId, 
            "PENDING", 
            "Booking created, awaiting payment confirmation"
        );
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable String id) {
        log.info("🔍 [BOOKING-SERVICE] Getting booking {}", id);
        
        BookingResponse response = new BookingResponse(
            id, 
            "UNKNOWN", 
            "This is a stub response (log-only mode)"
        );
        
        return ResponseEntity.ok(response);
    }
}

