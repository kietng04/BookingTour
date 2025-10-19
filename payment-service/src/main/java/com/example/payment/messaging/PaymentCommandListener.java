package com.example.payment.messaging;

import com.example.payment.config.RabbitMQConfig;
import com.example.payment.dto.PaymentChargeMessage;
import com.example.payment.dto.PaymentResultMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class PaymentCommandListener {
    
    private static final Logger log = LoggerFactory.getLogger(PaymentCommandListener.class);
    
    @Autowired
    private PaymentEventPublisher eventPublisher;
    
    @Value("${payment.mock.fail-mode:false}")
    private boolean failMode;
    
    @RabbitListener(queues = RabbitMQConfig.PAYMENT_CHARGE_QUEUE)
    public void onChargeRequest(PaymentChargeMessage message) {
        log.info("📥 [PAYMENT-SERVICE] Received charge request: {}", message);
        log.info("💳 [PAYMENT-SERVICE] Processing payment for booking {} (Amount: {})", 
            message.getBookingId(), message.getAmount());
        
        // Simulate payment processing delay
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Mock payment processing
        if (failMode) {
            // Simulate failure
            log.warn("❌ [PAYMENT-SERVICE] Payment FAILED for booking {} (Mock fail mode enabled)", 
                message.getBookingId());
            
            PaymentResultMessage failedResult = new PaymentResultMessage(
                message.getBookingId(),
                "FAILED",
                "Insufficient funds (mock)"
            );
            eventPublisher.publishResult(failedResult, RabbitMQConfig.ROUTING_KEY_FAILED);
        } else {
            // Simulate success
            log.info("✅ [PAYMENT-SERVICE] Payment COMPLETED for booking {} (Mock charge successful)", 
                message.getBookingId());
            
            PaymentResultMessage completedResult = new PaymentResultMessage(
                message.getBookingId(),
                "COMPLETED",
                "Payment processed successfully (mock)"
            );
            eventPublisher.publishResult(completedResult, RabbitMQConfig.ROUTING_KEY_COMPLETED);
        }
    }
}

