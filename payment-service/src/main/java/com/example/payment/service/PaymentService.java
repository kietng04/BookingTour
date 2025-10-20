package com.example.payment.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final Random random = new Random();

    @Value("${payment.mock.fail-mode:false}")
    private boolean mockFailMode;

    @Value("${payment.mock.delay:2000}")
    private long mockDelay;

    public PaymentResult processPayment(String bookingId, Double amount, Long userId) {
        log.info("[PAYMENT-SERVICE] Processing payment for booking {}, amount: {}, user: {}",
                bookingId, amount, userId);

        try {
            Thread.sleep(mockDelay);

            boolean success;
            if (mockFailMode) {
                success = false;
                log.warn("[PAYMENT-SERVICE] Mock fail mode enabled - payment will fail");
            } else {
                success = random.nextInt(100) < 90;
            }

            if (success) {
                log.info("[PAYMENT-SERVICE] Payment successful for booking {}", bookingId);
                return new PaymentResult(true, "Payment completed successfully", bookingId);
            } else {
                log.error("[PAYMENT-SERVICE] Payment failed for booking {}", bookingId);
                return new PaymentResult(false, "Payment failed: Insufficient funds or card declined", bookingId);
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("[PAYMENT-SERVICE] Payment processing interrupted for booking {}", bookingId, e);
            return new PaymentResult(false, "Payment processing interrupted", bookingId);
        } catch (Exception e) {
            log.error("[PAYMENT-SERVICE] Unexpected error processing payment for booking {}", bookingId, e);
            return new PaymentResult(false, "Unexpected error: " + e.getMessage(), bookingId);
        }
    }

    public static class PaymentResult {
        private final boolean success;
        private final String message;
        private final String bookingId;

        public PaymentResult(boolean success, String message, String bookingId) {
            this.success = success;
            this.message = message;
            this.bookingId = bookingId;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getMessage() {
            return message;
        }

        public String getBookingId() {
            return bookingId;
        }
    }
}

