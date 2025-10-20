package com.example.payment.dto;

public class PaymentResponse {
    private String bookingId;
    private String status;
    private String message;

    public PaymentResponse() {}

    public PaymentResponse(String bookingId, String status, String message) {
        this.bookingId = bookingId;
        this.status = status;
        this.message = message;
    }

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
}


