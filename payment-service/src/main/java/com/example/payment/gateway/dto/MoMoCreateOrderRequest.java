package com.example.payment.gateway.dto;

import java.math.BigDecimal;

public class MoMoCreateOrderRequest {

    private String bookingId;
    private BigDecimal amount;
    private Long userId;
    private String orderInfo;
    private String extraData;
    private String orderId;
    private String requestId;
    private String redirectUrl;
    private String ipnUrl;
    private String requestType;
    private String lang;

    public MoMoCreateOrderRequest() {
    }

    public MoMoCreateOrderRequest(String bookingId, BigDecimal amount, Long userId, String orderInfo,
                                  String extraData, String orderId, String requestId,
                                  String redirectUrl, String ipnUrl, String requestType, String lang) {
        this.bookingId = bookingId;
        this.amount = amount;
        this.userId = userId;
        this.orderInfo = orderInfo;
        this.extraData = extraData;
        this.orderId = orderId;
        this.requestId = requestId;
        this.redirectUrl = redirectUrl;
        this.ipnUrl = ipnUrl;
        this.requestType = requestType;
        this.lang = lang;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }

    public String getIpnUrl() {
        return ipnUrl;
    }

    public void setIpnUrl(String ipnUrl) {
        this.ipnUrl = ipnUrl;
    }

    public String getRequestType() {
        return requestType;
    }

    public void setRequestType(String requestType) {
        this.requestType = requestType;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }
}
