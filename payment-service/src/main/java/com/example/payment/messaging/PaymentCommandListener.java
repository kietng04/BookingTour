package com.example.payment.messaging;

import com.example.payment.gateway.MoMoGatewayException;
import com.example.payment.gateway.dto.MoMoCreateOrderResponse;
import com.example.payment.service.PaymentService;
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

        try {
            MoMoCreateOrderResponse response = paymentService.initiateMoMoPayment(message);
            if (response.getResultCode() == 0 && response.getPayUrl() != null) {
                log.info("[PAYMENT-SERVICE] MoMo order ready for booking {}. payUrl={}",
                        message.getBookingId(), response.getPayUrl());
            }
        } catch (MoMoGatewayException ex) {
            log.error("[PAYMENT-SERVICE] MoMo initiation failed for booking {}: {}",
                    message.getBookingId(), ex.getMessage());
        } catch (Exception ex) {
            log.error("[PAYMENT-SERVICE] Unexpected error handling payment for booking {}", message.getBookingId(), ex);
            PaymentResultMessage failed = new PaymentResultMessage(
                    message.getBookingId(),
                    "FAILED",
                    "Unexpected error during payment: " + ex.getMessage()
            );
            eventPublisher.publishResult(failed, RabbitMQConfig.ROUTING_KEY_FAILED);
        }
    }
}


