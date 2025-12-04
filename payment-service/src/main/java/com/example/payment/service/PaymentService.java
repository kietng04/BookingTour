package com.example.payment.service;

import com.example.payment.config.MoMoProperties;
import com.example.payment.dto.PaymentChargeMessage;
import com.example.payment.dto.PaymentResultMessage;
import com.example.payment.gateway.MoMoConstants;
import com.example.payment.gateway.MoMoGatewayException;
import com.example.payment.gateway.PaymentGateway;
import com.example.payment.gateway.dto.MoMoCallbackRequest;
import com.example.payment.gateway.dto.MoMoCreateOrderRequest;
import com.example.payment.gateway.dto.MoMoCreateOrderResponse;
import com.example.payment.messaging.PaymentEventPublisher;
import com.example.payment.model.Payment;
import com.example.payment.model.Payment.PaymentStatus;
import com.example.payment.repository.PaymentRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.EntityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);
    private static final String MOMO_METHOD = "MOMO";

    private final PaymentRepository paymentRepository;
    private final PaymentGateway paymentGateway;
    private final PaymentEventPublisher eventPublisher;
    private final MoMoProperties moMoProperties;
    private final ObjectMapper objectMapper;
    private final EntityManager entityManager;

    public PaymentService(PaymentRepository paymentRepository,
                          PaymentGateway paymentGateway,
                          PaymentEventPublisher eventPublisher,
                          MoMoProperties moMoProperties,
                          ObjectMapper objectMapper,
                          EntityManager entityManager) {
        this.paymentRepository = paymentRepository;
        this.paymentGateway = paymentGateway;
        this.eventPublisher = eventPublisher;
        this.moMoProperties = moMoProperties;
        this.objectMapper = objectMapper;
        this.entityManager = entityManager;
    }

    @Transactional
    public MoMoCreateOrderResponse initiateMoMoPayment(PaymentChargeMessage message) {
        Long bookingId = parseBookingId(message.getBookingId());
        BigDecimal amount = BigDecimal.valueOf(message.getAmount() != null ? message.getAmount() : 0d);

        log.info("[PAYMENT-SERVICE] Initiating MoMo payment bookingId={}, amount={}, userId={}",
                bookingId, amount, message.getUserId());

        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseGet(() -> newPayment(bookingId, amount));

        payment.setAmount(amount);
        payment.setPaymentMethod(MOMO_METHOD);
        payment.setStatus(PaymentStatus.PROCESSING);

        String orderId = generateOrderId(bookingId);
        String requestId = generateRequestId();

        payment.setMomoOrderId(orderId);
        payment.setMomoRequestId(requestId);

        paymentRepository.save(payment);

        MoMoCreateOrderRequest request = buildCreateOrderRequest(message, payment, orderId, requestId);

        MoMoCreateOrderResponse response;
        try {
            response = paymentGateway.createOrder(request);
            log.info("[PAYMENT-SERVICE] MoMo create order response bookingId={}, resultCode={}, message={}",
                    bookingId, response.getResultCode(), response.getMessage());
        } catch (MoMoGatewayException ex) {
            log.error("[PAYMENT-SERVICE] MoMo gateway error for booking {}: {}", bookingId, ex.getMessage());
            handleGatewayFailure(payment, ex.getMessage());
            throw ex;
        } catch (RuntimeException ex) {
            log.error("[PAYMENT-SERVICE] Unexpected error calling MoMo for booking {}", bookingId, ex);
            handleGatewayFailure(payment, ex.getMessage());
            throw ex;
        }

        persistCreateResponse(payment, response);

        if (response.getResultCode() != MoMoConstants.RESULT_SUCCESS) {
            log.error("[PAYMENT-SERVICE] MoMo create order failed for booking {}: {}",
                    bookingId, response.getMessage());
            handleGatewayFailure(payment, response.getMessage());
            throw new MoMoGatewayException("MoMo create order failed: " + response.getMessage());
        }

        payment.setNotes("Waiting for MoMo payment confirmation");
        paymentRepository.save(payment);

        log.info("[PAYMENT-SERVICE] MoMo order created for booking {}. Redirect user to payUrl", bookingId);
        return response;
    }

    @Transactional
    public void processCallback(MoMoCallbackRequest callbackRequest) {
        if (!paymentGateway.verifyCallback(callbackRequest)) {
            log.warn("[PAYMENT-SERVICE] Invalid signature for MoMo callback orderId={}", callbackRequest.getOrderId());
            throw new MoMoGatewayException("Invalid MoMo callback signature");
        }

        Payment payment = paymentRepository.findByMomoOrderId(callbackRequest.getOrderId())
                .orElseThrow(() -> new EntityNotFoundException("Payment not found for order " + callbackRequest.getOrderId()));

        payment.setMomoTransId(callbackRequest.getTransId());
        payment.setMomoPaymentMethod(callbackRequest.getPayType());
        if (callbackRequest.getTransId() != null) {
            payment.setTransactionId(String.valueOf(callbackRequest.getTransId()));
        }
        if (callbackRequest.getResponseTime() != null) {
            payment.setTransactionDate(LocalDateTime.ofInstant(
                    Instant.ofEpochMilli(callbackRequest.getResponseTime()),
                    ZoneId.systemDefault()
            ));
        } else {
            payment.setTransactionDate(LocalDateTime.now());
        }

        payment.setMomoResponseData(mergeResponseData(payment.getMomoResponseData(), callbackRequest));
        payment.setNotes(callbackRequest.getMessage());

        if (callbackRequest.getResultCode() == MoMoConstants.RESULT_SUCCESS) {
            payment.setStatus(PaymentStatus.COMPLETED);
            paymentRepository.save(payment);
            publishPaymentCompleted(payment);
            log.info("[PAYMENT-SERVICE] Booking {} payment completed. Awaiting admin confirmation", payment.getBookingId());
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            publishFailure(payment, callbackRequest.getMessage());
            log.error("[PAYMENT-SERVICE] Booking {} payment failed: {}", payment.getBookingId(), callbackRequest.getMessage());
        }
    }

    public Optional<Payment> getByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }

    @Transactional
    public void cancelPayment(Long bookingId) {
        log.info("[PAYMENT-SERVICE] Cancelling payment for booking {}", bookingId);

        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found for booking " + bookingId));


        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            log.warn("[PAYMENT-SERVICE] Cannot cancel completed payment for booking {}", bookingId);
            payment.setStatus(PaymentStatus.REFUNDED);
            payment.setNotes("Booking cancelled - payment refunded");
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setNotes("Booking cancelled - payment cancelled");
        }

        paymentRepository.save(payment);
        log.info("[PAYMENT-SERVICE] Payment for booking {} updated to status: {}",
                bookingId, payment.getStatus());
    }

    private Payment newPayment(Long bookingId, BigDecimal amount) {
        Payment existing = paymentRepository.findByBookingId(bookingId).orElse(null);
        if (existing != null) {
            return existing;
        }

        LocalDateTime now = LocalDateTime.now();
        int inserted = entityManager.createNativeQuery(
                        "INSERT INTO payments (booking_id, amount, status, payment_method, created_at, updated_at) " +
                                "VALUES (:bookingId, :amount, :status, :method, :createdAt, :updatedAt) " +
                                "ON CONFLICT (booking_id) DO NOTHING")
                .setParameter("bookingId", bookingId)
                .setParameter("amount", amount)
                .setParameter("status", PaymentStatus.PENDING.name())
                .setParameter("method", MOMO_METHOD)
                .setParameter("createdAt", Timestamp.valueOf(now))
                .setParameter("updatedAt", Timestamp.valueOf(now))
                .executeUpdate();

        if (inserted > 0) {
            log.debug("[PAYMENT-SERVICE] Created initial payment record for booking {}", bookingId);
        } else {
            log.debug("[PAYMENT-SERVICE] Payment record already existed for booking {}", bookingId);
        }

        return paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new IllegalStateException("Unable to initialize payment for booking " + bookingId));
    }

    private void persistCreateResponse(Payment payment, MoMoCreateOrderResponse response) {
        if (response.getRawResponse() != null) {
            payment.setMomoResponseData(response.getRawResponse());
        } else {
            try {
                payment.setMomoResponseData(objectMapper.writeValueAsString(response));
            } catch (JsonProcessingException e) {
                log.warn("[PAYMENT-SERVICE] Unable to serialize MoMo response for booking {}", payment.getBookingId(), e);
            }
        }
        paymentRepository.save(payment);
    }

    private String generateOrderId(Long bookingId) {
        return "BT-" + bookingId + "-" + System.currentTimeMillis();
    }

    private String generateRequestId() {
        return System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8);
    }

    private MoMoCreateOrderRequest buildCreateOrderRequest(PaymentChargeMessage message,
                                                           Payment payment,
                                                           String orderId,
                                                           String requestId) {
        MoMoCreateOrderRequest request = new MoMoCreateOrderRequest();
        request.setBookingId(message.getBookingId());
        request.setAmount(payment.getAmount());
        request.setUserId(message.getUserId());
        request.setOrderInfo(resolveOrderInfo(message, payment));
        request.setExtraData(resolveExtraData(message));
        request.setOrderId(orderId);
        request.setRequestId(requestId);
        request.setRedirectUrl(moMoProperties.getRedirectUrl());
        request.setIpnUrl(moMoProperties.getCallbackUrl());
        request.setRequestType(moMoProperties.getRequestType());
        request.setLang(moMoProperties.getLang());
        return request;
    }

    private String resolveOrderInfo(PaymentChargeMessage message, Payment payment) {
        if (message.getOrderInfo() != null && !message.getOrderInfo().isBlank()) {
            return message.getOrderInfo().trim();
        }
        if (message.getPaymentOverride() != null && !message.getPaymentOverride().isBlank()) {
            return "Booking " + message.getBookingId() + " - " + message.getPaymentOverride();
        }
        if (moMoProperties.getOrderInfo() != null && !moMoProperties.getOrderInfo().isBlank()) {
            return moMoProperties.getOrderInfo() + " booking " + payment.getBookingId();
        }
        return "BookingTour payment booking " + payment.getBookingId();
    }

    private String resolveExtraData(PaymentChargeMessage message) {
        if (message.getExtraData() != null && !message.getExtraData().isBlank()) {
            return encodeExtraDataIfNeeded(message.getExtraData());
        }
        String configured = moMoProperties.getExtraData();
        if (configured != null && !configured.isBlank()) {
            return encodeExtraDataIfNeeded(configured);
        }
        String basePayload = "bookingId=" + defaultString(message.getBookingId())
                + "&userId=" + (message.getUserId() != null ? message.getUserId() : "");
        return Base64.getEncoder().encodeToString(basePayload.getBytes(StandardCharsets.UTF_8));
    }

    private Long parseBookingId(String bookingId) {
        try {
            return Long.parseLong(bookingId.trim());
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("Invalid bookingId: " + bookingId, ex);
        }
    }

    private String mergeResponseData(String existing, MoMoCallbackRequest callbackRequest) {
        try {
            if (existing == null || existing.isBlank()) {
                return objectMapper.writeValueAsString(callbackRequest);
            }
            var root = objectMapper.createObjectNode();
            root.set("createResponse", objectMapper.readTree(existing));
            root.set("callback", objectMapper.valueToTree(callbackRequest));
            return objectMapper.writeValueAsString(root);
        } catch (JsonProcessingException e) {
            log.warn("[PAYMENT-SERVICE] Cannot serialize callback data for booking {}", callbackRequest.getOrderId(), e);
            return existing;
        }
    }

    private void publishSuccess(Payment payment, String message) {
        PaymentResultMessage result = new PaymentResultMessage(
                String.valueOf(payment.getBookingId()),
                "COMPLETED",
                message
        );
        eventPublisher.publishResult(result, com.example.payment.config.RabbitMQConfig.ROUTING_KEY_COMPLETED);
    }

    private void publishPaymentCompleted(Payment payment) {
        PaymentResultMessage result = new PaymentResultMessage(
                String.valueOf(payment.getBookingId()),
                "PAYMENT_COMPLETED",
                "Payment successful - awaiting admin confirmation"
        );
        eventPublisher.publishResult(result, com.example.payment.config.RabbitMQConfig.ROUTING_KEY_COMPLETED);
        log.info("[PAYMENT-SERVICE] Published PAYMENT_COMPLETED event for booking {}", payment.getBookingId());
    }

    private void publishFailure(Payment payment, String message) {
        PaymentResultMessage result = new PaymentResultMessage(
                String.valueOf(payment.getBookingId()),
                "FAILED",
                message != null ? message : "MoMo payment failed"
        );
        eventPublisher.publishResult(result, com.example.payment.config.RabbitMQConfig.ROUTING_KEY_FAILED);
    }

    private void handleGatewayFailure(Payment payment, String message) {
        payment.setStatus(PaymentStatus.FAILED);
        payment.setNotes(message);
        paymentRepository.save(payment);
        publishFailure(payment, message);
    }

    private String defaultString(String value) {
        return value == null ? "" : value;
    }

    private String encodeExtraDataIfNeeded(String rawExtraData) {
        String trimmed = rawExtraData.trim();
        if (trimmed.isEmpty()) {
            return "";
        }
        if (isBase64(trimmed)) {
            return trimmed;
        }
        return Base64.getEncoder().encodeToString(trimmed.getBytes(StandardCharsets.UTF_8));
    }

    private boolean isBase64(String value) {
        String normalized = value.replace("\n", "").replace("\r", "");
        try {
            byte[] decoded = Base64.getDecoder().decode(normalized);
            if (decoded.length == 0) {
                return false;
            }
            String reEncoded = Base64.getEncoder().encodeToString(decoded);
            return reEncoded.equals(normalized);
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }
}
