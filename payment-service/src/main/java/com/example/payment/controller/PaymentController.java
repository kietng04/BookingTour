
package com.example.payment.controller;

import com.example.payment.dto.MoMoOrderRequest;
import com.example.payment.dto.MoMoOrderResponse;
import com.example.payment.dto.PaymentDetailsResponse;
import com.example.payment.dto.PaymentChargeMessage;
import com.example.payment.gateway.MoMoGatewayException;
import com.example.payment.gateway.dto.MoMoCreateOrderResponse;
import com.example.payment.model.Payment;
import com.example.payment.service.PaymentService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.math.BigDecimal;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

    private final PaymentService paymentService;
    private final ObjectMapper objectMapper;

    public PaymentController(PaymentService paymentService, ObjectMapper objectMapper) {
        this.paymentService = paymentService;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/momo/orders")
    public ResponseEntity<MoMoOrderResponse> createMoMoOrder(@RequestBody MoMoOrderRequest request) {
        log.info("[PAYMENT-SERVICE] Incoming MoMo order request bookingId={}, amount={}, userId={}",
                request.getBookingId(), request.getAmount(), request.getUserId());

        validateOrderRequest(request);

        PaymentChargeMessage chargeMessage = new PaymentChargeMessage(
                request.getBookingId().trim(),
                request.getAmount().doubleValue(),
                request.getUserId(),
                null,
                request.getOrderInfo(),
                request.getExtraData()
        );

        try {
            MoMoCreateOrderResponse response = paymentService.initiateMoMoPayment(chargeMessage);

            MoMoOrderResponse result = new MoMoOrderResponse();
            result.setBookingId(request.getBookingId());
            result.setOrderId(response.getOrderId());
            result.setRequestId(response.getRequestId());
            result.setPayUrl(response.getPayUrl());
            result.setDeeplink(response.getDeeplink());
            result.setQrCodeUrl(response.getQrCodeUrl());
            result.setResultCode(response.getResultCode());
            result.setMessage(response.getMessage());

            return ResponseEntity.ok(result);
        } catch (MoMoGatewayException ex) {
            log.error("[PAYMENT-SERVICE] MoMo order failed for booking {}: {}",
                    request.getBookingId(), ex.getMessage(), ex);

            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "MoMo create order failed: " + ex.getMessage(), ex);
        }
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentDetailsResponse> getPaymentDetails(@PathVariable Long bookingId) {
        Payment payment = paymentService.getByBookingId(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found for booking " + bookingId));

        PaymentDetailsResponse response = new PaymentDetailsResponse();
        response.setBookingId(payment.getBookingId());
        response.setStatus(payment.getStatus().name());
        response.setPaymentMethod(payment.getPaymentMethod());
        response.setMessage(payment.getNotes());

        if (payment.getMomoResponseData() != null) {
            populatePaymentUrls(response, payment.getMomoResponseData());
        }

        return ResponseEntity.ok(response);
    }

    private void populatePaymentUrls(PaymentDetailsResponse response, String responseData) {
        try {
            JsonNode root = objectMapper.readTree(responseData);
            JsonNode createNode = root.has("createResponse") ? root.get("createResponse") : root;
            if (createNode.has("payUrl")) {
                response.setPayUrl(createNode.get("payUrl").asText());
            }
            if (createNode.has("deeplink")) {
                response.setDeeplink(createNode.get("deeplink").asText());
            }
            if (createNode.has("qrCodeUrl")) {
                response.setQrCodeUrl(createNode.get("qrCodeUrl").asText());
            }
            if (response.getMessage() == null && createNode.has("message")) {
                response.setMessage(createNode.get("message").asText());
            }
        } catch (IOException e) {
            log.warn("[PAYMENT-SERVICE] Unable to parse MoMo response data", e);
        }
    }

    private void validateOrderRequest(MoMoOrderRequest request) {
        if (request.getBookingId() == null || request.getBookingId().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "bookingId is required");
        }
        request.setBookingId(request.getBookingId().trim());
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "amount must be greater than zero");
        }
        if (request.getUserId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }
    }
}
