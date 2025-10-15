package com.example.booking.dto;

import java.io.Serializable;

public class PaymentResultMessage implements Serializable {
    private String bookingId;
    private String status; // "COMPLETED" or "FAILED"
    private String message;

    // Constructors
    public PaymentResultMessage() {}

    public PaymentResultMessage(String bookingId, String status, String message) {
        this.bookingId = bookingId;
        this.status = status;
        this.message = message;
    }

    // Getters and Setters
    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "PaymentResultMessage{" +
                "bookingId='" + bookingId + '\'' +
                ", status='" + status + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}

