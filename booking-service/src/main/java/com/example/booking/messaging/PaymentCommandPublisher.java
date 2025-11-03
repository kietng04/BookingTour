package com.example.booking.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.booking.config.RabbitMQConfig;
import com.example.booking.dto.PaymentChargeMessage;

@Component
public class PaymentCommandPublisher {
    
    private static final Logger log = LoggerFactory.getLogger(PaymentCommandPublisher.class);
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    public void publishChargeRequest(PaymentChargeMessage message) {
        log.info("[BOOKING-SERVICE] Publishing payment.charge: {}", message);
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.PAYMENT_EXCHANGE,
            RabbitMQConfig.ROUTING_KEY_CHARGE,
            message
        );
        log.info("[BOOKING-SERVICE] Payment charge request sent successfully");
    }
}


