package com.example.payment.messaging;

import com.example.payment.config.RabbitMQConfig;
import com.example.payment.dto.PaymentResultMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PaymentEventPublisher {
    
    private static final Logger log = LoggerFactory.getLogger(PaymentEventPublisher.class);
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    public void publishResult(PaymentResultMessage message, String routingKey) {
        log.info("📤 [PAYMENT-SERVICE] Publishing {} event: {}", routingKey, message);
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.PAYMENT_EXCHANGE,
            routingKey,
            message
        );
        log.info("✅ [PAYMENT-SERVICE] Payment result sent successfully");
    }
}

