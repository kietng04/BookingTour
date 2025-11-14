package com.example.booking.dto.events;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Event DTO for booking confirmation email notification
 */
public class BookingConfirmedEvent implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long bookingId;
    private Long userId;
    private Long tourId;
    private String userEmail;
    private String userName;
    private String tourName;
    private LocalDate departureDate;
    private Integer numSeats;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String bookingDate;

    // Constructors
    public BookingConfirmedEvent() {
    }

    public BookingConfirmedEvent(Long bookingId, Long userId, Long tourId, String userEmail, String userName,
                                 String tourName, LocalDate departureDate, Integer numSeats,
                                 BigDecimal totalAmount, String paymentMethod, String bookingDate) {
        this.bookingId = bookingId;
        this.userId = userId;
        this.tourId = tourId;
        this.userEmail = userEmail;
        this.userName = userName;
        this.tourName = tourName;
        this.departureDate = departureDate;
        this.numSeats = numSeats;
        this.totalAmount = totalAmount;
        this.paymentMethod = paymentMethod;
        this.bookingDate = bookingDate;
    }

    // Getters and Setters
    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

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

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getTourName() {
        return tourName;
    }

    public void setTourName(String tourName) {
        this.tourName = tourName;
    }

    public LocalDate getDepartureDate() {
        return departureDate;
    }

    public void setDepartureDate(LocalDate departureDate) {
        this.departureDate = departureDate;
    }

    public Integer getNumSeats() {
        return numSeats;
    }

    public void setNumSeats(Integer numSeats) {
        this.numSeats = numSeats;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(String bookingDate) {
        this.bookingDate = bookingDate;
    }

    @Override
    public String toString() {
        return "BookingConfirmedEvent{" +
                "bookingId=" + bookingId +
                ", userId=" + userId +
                ", tourId=" + tourId +
                ", userEmail='" + userEmail + '\'' +
                ", userName='" + userName + '\'' +
                ", tourName='" + tourName + '\'' +
                ", departureDate=" + departureDate +
                ", numSeats=" + numSeats +
                ", totalAmount=" + totalAmount +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", bookingDate='" + bookingDate + '\'' +
                '}';
    }
}
