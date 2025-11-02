package com.example.booking.dto;

import java.time.LocalDateTime;

public class ReservationEvent {
    private String eventId;
    private String correlationId;
    private LocalDateTime timestamp;
    private Long bookingId;
    private Long tourId;
    private Long departureId;
    private Integer requestedSeats;
    private Long userId;
    private String paymentOverride;

    public ReservationEvent() {
    }

    public ReservationEvent(String eventId, String correlationId, LocalDateTime timestamp,
                            Long bookingId, Long tourId, Long departureId,
                            Integer requestedSeats, Long userId, String paymentOverride) {
        this.eventId = eventId;
        this.correlationId = correlationId;
        this.timestamp = timestamp;
        this.bookingId = bookingId;
        this.tourId = tourId;
        this.departureId = departureId;
        this.requestedSeats = requestedSeats;
        this.userId = userId;
        this.paymentOverride = paymentOverride;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getCorrelationId() {
        return correlationId;
    }

    public void setCorrelationId(String correlationId) {
        this.correlationId = correlationId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getTourId() {
        return tourId;
    }

    public void setTourId(Long tourId) {
        this.tourId = tourId;
    }

    public Long getDepartureId() {
        return departureId;
    }

    public void setDepartureId(Long departureId) {
        this.departureId = departureId;
    }

    public Integer getRequestedSeats() {
        return requestedSeats;
    }

    public void setRequestedSeats(Integer requestedSeats) {
        this.requestedSeats = requestedSeats;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getPaymentOverride() {
        return paymentOverride;
    }

    public void setPaymentOverride(String paymentOverride) {
        this.paymentOverride = paymentOverride;
    }
}

