package com.example.payment.messaging;

import com.example.payment.service.PaymentService;
import com.example.payment.service.PaymentService.PaymentResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.payment.config.RabbitMQConfig;
import com.example.payment.dto.PaymentChargeMessage;
import com.example.payment.dto.PaymentResultMessage;

@Component
public class PaymentCommandListener {

    private static final Logger log = LoggerFactory.getLogger(PaymentCommandListener.class);

    @Autowired
    private PaymentEventPublisher eventPublisher;

    @Autowired
    private PaymentService paymentService;

    @RabbitListener(queues = RabbitMQConfig.PAYMENT_CHARGE_QUEUE)
    public void onChargeRequest(PaymentChargeMessage message) {
        log.info("[PAYMENT-SERVICE] Received charge request: {}", message);

        PaymentResult result = paymentService.processPayment(
                message.getBookingId(),
                message.getAmount(),
                message.getUserId()
        );

        if (result.isSuccess()) {
            PaymentResultMessage completedResult = new PaymentResultMessage(
                    result.getBookingId(),
                    "COMPLETED",
                    result.getMessage()
            );
            eventPublisher.publishResult(completedResult, RabbitMQConfig.ROUTING_KEY_COMPLETED);
        } else {
            PaymentResultMessage failedResult = new PaymentResultMessage(
                    result.getBookingId(),
                    "FAILED",
                    result.getMessage()
            );
            eventPublisher.publishResult(failedResult, RabbitMQConfig.ROUTING_KEY_FAILED);
        }
    }
}


