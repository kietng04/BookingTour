package com.example.payment.controller;

import com.example.payment.dto.PaymentResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentController {
    
    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);
    
    @Value("${payment.mock.fail-mode:false}")
    private boolean failMode;
    
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentResponse> getPaymentStatus(@PathVariable String bookingId) {
        log.info("🔍 [PAYMENT-SERVICE] Getting payment status for booking {}", bookingId);
        
        // Return stub response based on current mode
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
        log.info("🔧 [PAYMENT-SERVICE] Fail mode toggled to: {}", failMode);
        return ResponseEntity.ok("Fail mode is now: " + (failMode ? "ENABLED" : "DISABLED"));
    }
}

