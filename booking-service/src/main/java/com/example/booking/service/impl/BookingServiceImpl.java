package com.example.booking.service.impl;

import com.example.booking.dto.BookingRequest;
import com.example.booking.model.Booking;
import com.example.booking.model.Booking.BookingStatus;
import com.example.booking.repository.BookingRepository;
import com.example.booking.service.BookingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingServiceImpl.class);

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public Booking createBooking(BookingRequest request) {
        validateBookingRequest(request);

        Booking booking = new Booking(
                request.getUserId(),
                request.getDepartureId(),
                BigDecimal.valueOf(request.getTotalAmount()),
                request.getSeats()
        );

        booking.setStatus(BookingStatus.PENDING);
        Booking savedBooking = bookingRepository.save(booking);

        log.info("Created booking {} for user {} with status PENDING",
                savedBooking.getId(), request.getUserId());

        return savedBooking;
    }

    @Override
    public Booking confirmBooking(Long bookingId) {
        Booking booking = getBookingById(bookingId);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only PENDING bookings can be confirmed. Current status: " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        Booking confirmedBooking = bookingRepository.save(booking);

        log.info("Booking {} confirmed successfully", bookingId);
        return confirmedBooking;
    }

    @Override
    public Booking cancelBooking(Long bookingId) {
        Booking booking = getBookingById(bookingId);

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Booking is already cancelled");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot cancel completed booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking cancelledBooking = bookingRepository.save(booking);

        log.info("Booking {} cancelled successfully", bookingId);
        return cancelledBooking;
    }

    @Override
    @Transactional(readOnly = true)
    public Booking getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Booking not found with id: " + bookingId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Booking> getUserBookings(Long userId, Pageable pageable) {
        return bookingRepository.findByUserId(userId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Booking> getAllBookings(Pageable pageable) {
        return bookingRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Booking> getBookingsByStatus(BookingStatus status, Pageable pageable) {
        return bookingRepository.findByStatus(status, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Booking> getBookingsByDepartureId(Long departureId, Pageable pageable) {
        return bookingRepository.findByDepartureId(departureId, pageable);
    }

    private void validateBookingRequest(BookingRequest request) {
        if (request.getUserId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }
        if (request.getDepartureId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "departureId is required");
        }
        if (request.getSeats() == null || request.getSeats() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "seats must be greater than 0");
        }
        if (request.getTotalAmount() == null || request.getTotalAmount() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "totalAmount must be greater than 0");
        }
    }
}

