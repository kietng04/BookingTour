package com.example.payment.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.payment.dto.PaymentResponse;

@RestController
@RequestMapping("/payments")
public class PaymentController {
    
    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);
    private static boolean failMode = false;
    
    @PostMapping("/charge/{bookingId}")
    public ResponseEntity<PaymentResponse> processPayment(@PathVariable String bookingId) {
        log.info("💳 [PAYMENT-SERVICE] Processing payment for booking: {}", bookingId);
        
        String status = failMode ? "FAILED" : "COMPLETED";
        String message = failMode ? 
            "Payment failed (mock fail mode)" : 
            "Payment completed successfully (mock)";
        
        PaymentResponse response = new PaymentResponse(bookingId, status, message);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/toggle-fail-mode")
    public ResponseEntity<String> toggleFailMode() {
        failMode = !failMode;
        log.info("🔨 [PAYMENT-SERVICE] Fail mode toggled to: {}", failMode);
        return ResponseEntity.ok("Fail mode is now: " + (failMode ? "ENABLED" : "DISABLED"));
    }
}

