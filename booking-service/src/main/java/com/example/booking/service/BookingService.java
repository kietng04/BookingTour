package com.example.booking.service;

import com.example.booking.dto.BookingRequest;
import com.example.booking.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookingService {

    Booking createBooking(BookingRequest request);

    Booking confirmBooking(Long bookingId);

    Booking cancelBooking(Long bookingId);

    Booking getBookingById(Long bookingId);

    List<Booking> getUserBookings(Long userId);

    Page<Booking> getUserBookings(Long userId, Pageable pageable);

    Page<Booking> getAllBookings(Pageable pageable);

    Page<Booking> getBookingsByStatus(Booking.BookingStatus status, Pageable pageable);

    Page<Booking> getBookingsByDepartureId(Long departureId, Pageable pageable);
}

