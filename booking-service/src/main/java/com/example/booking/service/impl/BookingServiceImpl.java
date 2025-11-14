package com.example.booking.service.impl;

import com.example.booking.config.RabbitMQConfig;
import com.example.booking.dto.BookingRequest;
import com.example.booking.dto.events.BookingConfirmedEvent;
import com.example.booking.model.Booking;
import com.example.booking.model.Booking.BookingStatus;
import com.example.booking.repository.BookingRepository;
import com.example.booking.service.BookingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingServiceImpl.class);
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${tour.service.url:http://localhost:8082}")
    private String tourServiceUrl;

    @Value("${user.service.url:http://localhost:8081}")
    private String userServiceUrl;

    @Override
    public Booking createBooking(BookingRequest request) {
        validateBookingRequest(request);

        Booking booking = Booking.builder()
                .userId(request.getUserId())
                .tourId(request.getTourId())
                .departureId(request.getDepartureId())
                .numSeats(request.getSeats())
                .totalAmount(BigDecimal.valueOf(request.getTotalAmount()))
                .status(BookingStatus.PENDING)
                .paymentOverride(normalizePaymentOverride(request.getPaymentOverride()))
                .build();
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

        // Send email notification via RabbitMQ
        try {
            publishBookingConfirmedEvent(confirmedBooking);
            log.info("Booking {} confirmed successfully and email notification sent", bookingId);
        } catch (Exception e) {
            log.error("Failed to send email notification for booking {}", bookingId, e);
            // Don't fail the booking confirmation if email fails
        }

        return confirmedBooking;
    }

    @Override
    public Booking cancelBooking(Long bookingId) {
        Booking booking = getBookingById(bookingId);

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Booking is already cancelled");
        }

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot cancel confirmed booking");
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
        return bookingRepository.findByUserId(userId, Pageable.unpaged()).getContent();
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
        List<Booking> bookings = bookingRepository.findByDepartureId(departureId);
        return new PageImpl<>(bookings, pageable, bookings.size());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Booking> getBookingsByTourId(Long tourId, Pageable pageable) {
        List<Booking> bookings = bookingRepository.findByTourId(tourId);
        return new PageImpl<>(bookings, pageable, bookings.size());
    }

    private void validateBookingRequest(BookingRequest request) {
        if (request.getUserId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }
        if (request.getDepartureId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "departureId is required");
        }
        if (request.getTourId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "tourId is required");
        }
        if (request.getSeats() == null || request.getSeats() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "seats must be greater than 0");
        }
        if (request.getTotalAmount() == null || request.getTotalAmount() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "totalAmount must be greater than 0");
        }
        if (request.getPaymentOverride() != null && !request.getPaymentOverride().isBlank()) {
            String normalized = normalizePaymentOverride(request.getPaymentOverride());
            if (normalized == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "paymentOverride must be SUCCESS, FAIL, MOMO or empty");
            }
        }
    }

    private String normalizePaymentOverride(String paymentOverride) {
        if (paymentOverride == null || paymentOverride.isBlank()) {
            return null;
        }
        String upper = paymentOverride.trim().toUpperCase();
        return switch (upper) {
            case "SUCCESS", "FAIL", "MOMO" -> upper;
            default -> null;
        };
    }

    /**
     * Publish booking confirmed event to RabbitMQ for email notification
     */
    private void publishBookingConfirmedEvent(Booking booking) {
        // Fetch user information
        Map<String, Object> user = fetchUserInfo(booking.getUserId());
        String userEmail = (String) user.getOrDefault("email", "N/A");
        String userName = (String) user.getOrDefault("fullName", "Unknown");

        // Fetch tour information
        Map<String, Object> tour = fetchTourInfo(booking.getTourId());
        String tourName = (String) tour.getOrDefault("tourName", "Tour #" + booking.getTourId());

        // Fetch departure information to get start date
        Map<String, Object> departure = fetchDepartureInfo(booking.getTourId(), booking.getDepartureId());
        java.time.LocalDate departureDate = null;
        if (departure.containsKey("startDate")) {
            Object startDateObj = departure.get("startDate");
            if (startDateObj instanceof String) {
                try {
                    departureDate = java.time.LocalDate.parse((String) startDateObj);
                } catch (Exception e) {
                    log.warn("Failed to parse departure date: {}", startDateObj);
                }
            } else if (startDateObj instanceof java.time.LocalDate) {
                departureDate = (java.time.LocalDate) startDateObj;
            }
        }

        // Create event
        BookingConfirmedEvent event = new BookingConfirmedEvent(
                booking.getId(),
                booking.getUserId(),
                booking.getTourId(),
                userEmail,
                userName,
                tourName,
                departureDate,
                booking.getNumSeats(),
                booking.getTotalAmount(),
                "MOMO", // Default payment method
                booking.getCreatedAt().format(DATE_TIME_FORMATTER)
        );

        // Publish to RabbitMQ
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EMAIL_EXCHANGE,
                RabbitMQConfig.EMAIL_BOOKING_CONFIRMED_KEY,
                event
        );

        log.info("Published booking confirmed event for booking {}", booking.getId());
    }

    /**
     * Fetch user information from user-service
     */
    private Map<String, Object> fetchUserInfo(Long userId) {
        try {
            String url = userServiceUrl + "/users/" + userId;
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url, HttpMethod.GET, null, new ParameterizedTypeReference<>() {});
            return response.getBody() != null ? response.getBody() : Map.of();
        } catch (Exception e) {
            log.warn("Failed to fetch user info for userId: {}", userId, e);
            return Map.of();
        }
    }

    /**
     * Fetch tour information from tour-service
     */
    private Map<String, Object> fetchTourInfo(Long tourId) {
        try {
            String url = tourServiceUrl + "/tours/" + tourId;
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url, HttpMethod.GET, null, new ParameterizedTypeReference<>() {});
            return response.getBody() != null ? response.getBody() : Map.of();
        } catch (Exception e) {
            log.warn("Failed to fetch tour info for tourId: {}", tourId, e);
            return Map.of();
        }
    }

    /**
     * Fetch departure information from tour-service
     */
    private Map<String, Object> fetchDepartureInfo(Long tourId, Long departureId) {
        try {
            String url = tourServiceUrl + "/tours/" + tourId + "/departures/" + departureId;
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url, HttpMethod.GET, null, new ParameterizedTypeReference<>() {});
            return response.getBody() != null ? response.getBody() : Map.of();
        } catch (Exception e) {
            log.warn("Failed to fetch departure info for tourId: {}, departureId: {}", tourId, departureId, e);
            return Map.of();
        }
    }
}

