package com.example.payment.controller;

import com.example.payment.gateway.MoMoGatewayException;
import com.example.payment.gateway.dto.MoMoCallbackRequest;
import com.example.payment.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payments")
public class MoMoCallbackController {

    private static final Logger log = LoggerFactory.getLogger(MoMoCallbackController.class);

    private final PaymentService paymentService;

    public MoMoCallbackController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/momo/webhook")
    public ResponseEntity<Map<String, Object>> handleCallback(@RequestBody MoMoCallbackRequest request) {
        log.info("[PAYMENT-SERVICE] Received MoMo callback for orderId={}, resultCode={}",
                request.getOrderId(), request.getResultCode());

        Map<String, Object> response = new HashMap<>();
        try {
            paymentService.processCallback(request);
            response.put("resultCode", 0);
            response.put("message", "Success");
            return ResponseEntity.ok(response);
        } catch (MoMoGatewayException ex) {
            log.warn("[PAYMENT-SERVICE] MoMo callback rejected: {}", ex.getMessage());
            response.put("resultCode", -1);
            response.put("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception ex) {
            log.error("[PAYMENT-SERVICE] Error processing MoMo callback", ex);
            response.put("resultCode", -99);
            response.put("message", "Internal error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
