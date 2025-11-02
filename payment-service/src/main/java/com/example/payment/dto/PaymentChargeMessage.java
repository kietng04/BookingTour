package com.example.payment.dto;

import java.io.Serializable;

public class PaymentChargeMessage implements Serializable {
    private String bookingId;
    private Double amount;
    private Long userId;
    private String paymentOverride;
    private String orderInfo;
    private String extraData;

    public PaymentChargeMessage() {}

    public PaymentChargeMessage(String bookingId, Double amount, Long userId, String paymentOverride) {
        this(bookingId, amount, userId, paymentOverride, null, null);
    }

    public PaymentChargeMessage(String bookingId,
                                Double amount,
                                Long userId,
                                String paymentOverride,
                                String orderInfo,
                                String extraData) {
        this.bookingId = bookingId;
        this.amount = amount;
        this.userId = userId;
        this.paymentOverride = paymentOverride;
        this.orderInfo = orderInfo;
        this.extraData = extraData;
    }

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

    public String getPaymentOverride() {
        return paymentOverride;
    }

    public void setPaymentOverride(String paymentOverride) {
        this.paymentOverride = paymentOverride;
    }

    public String getOrderInfo() {
        return orderInfo;
    }

    public void setOrderInfo(String orderInfo) {
        this.orderInfo = orderInfo;
    }

    public String getExtraData() {
        return extraData;
    }

    public void setExtraData(String extraData) {
        this.extraData = extraData;
    }

    @Override
    public String toString() {
        return "PaymentChargeMessage{" +
                "bookingId='" + bookingId + '\'' +
                ", amount=" + amount +
                ", userId=" + userId +
                ", paymentOverride='" + paymentOverride + '\'' +
                ", orderInfo='" + orderInfo + '\'' +
                ", extraData='" + extraData + '\'' +
                '}';
    }
}

