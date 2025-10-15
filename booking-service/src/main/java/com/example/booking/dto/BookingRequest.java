package com.example.booking.dto;

public class BookingRequest {
    private Long userId;
    private Long tourId;
    private Long departureId;
    private Integer seats;
    private Double totalAmount;

    // Constructors
    public BookingRequest() {}

    public BookingRequest(Long userId, Long tourId, Long departureId, Integer seats, Double totalAmount) {
        this.userId = userId;
        this.tourId = tourId;
        this.departureId = departureId;
        this.seats = seats;
        this.totalAmount = totalAmount;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public Integer getSeats() {
        return seats;
    }

    public void setSeats(Integer seats) {
        this.seats = seats;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}

