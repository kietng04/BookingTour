package com.example.booking.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.example.booking.config.RabbitMQConfig;
import com.example.booking.dto.PaymentResultMessage;

@Component
public class PaymentEventListener {
    
    private static final Logger log = LoggerFactory.getLogger(PaymentEventListener.class);
    
    @RabbitListener(queues = RabbitMQConfig.PAYMENT_EVENTS_QUEUE)
    public void onPaymentResult(PaymentResultMessage message) {
        log.info("📥 [BOOKING-SERVICE] Received payment result: {}", message);
        
        if ("COMPLETED".equals(message.getStatus())) {
            log.info("✅ [BOOKING-SERVICE] Booking {} status changed: PENDING → CONFIRMED", message.getBookingId());
        } else if ("FAILED".equals(message.getStatus())) {
            log.info("❌ [BOOKING-SERVICE] Booking {} status changed: PENDING → FAILED. Reason: {}", 
                message.getBookingId(), message.getMessage());
        }
    }
}

