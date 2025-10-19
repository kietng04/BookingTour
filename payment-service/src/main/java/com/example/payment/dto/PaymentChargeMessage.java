package com.example.payment.dto;

import java.io.Serializable;

public class PaymentChargeMessage implements Serializable {
    private String bookingId;
    private Double amount;
    private Long userId;

    // Constructors
    public PaymentChargeMessage() {}

    public PaymentChargeMessage(String bookingId, Double amount, Long userId) {
        this.bookingId = bookingId;
        this.amount = amount;
        this.userId = userId;
    }

    // Getters and Setters
    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "PaymentChargeMessage{" +
                "bookingId='" + bookingId + '\'' +
                ", amount=" + amount +
                ", userId=" + userId +
                '}';
    }
}

