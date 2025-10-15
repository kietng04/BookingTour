package com.example.booking.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    
    public static final String PAYMENT_EXCHANGE = "payment.exchange";
    public static final String PAYMENT_CHARGE_QUEUE = "payment.charge.queue";
    public static final String PAYMENT_EVENTS_QUEUE = "payment.events.queue";
    
    public static final String ROUTING_KEY_CHARGE = "payment.charge";
    public static final String ROUTING_KEY_COMPLETED = "payment.completed";
    public static final String ROUTING_KEY_FAILED = "payment.failed";

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public DirectExchange paymentExchange() {
        return new DirectExchange(PAYMENT_EXCHANGE);
    }

    @Bean
    public Queue paymentChargeQueue() {
        return new Queue(PAYMENT_CHARGE_QUEUE, true);
    }

    @Bean
    public Queue paymentEventsQueue() {
        return new Queue(PAYMENT_EVENTS_QUEUE, true);
    }

    @Bean
    public Binding bindingPaymentCharge(Queue paymentChargeQueue, DirectExchange paymentExchange) {
        return BindingBuilder.bind(paymentChargeQueue).to(paymentExchange).with(ROUTING_KEY_CHARGE);
    }

    @Bean
    public Binding bindingPaymentCompleted(Queue paymentEventsQueue, DirectExchange paymentExchange) {
        return BindingBuilder.bind(paymentEventsQueue).to(paymentExchange).with(ROUTING_KEY_COMPLETED);
    }

    @Bean
    public Binding bindingPaymentFailed(Queue paymentEventsQueue, DirectExchange paymentExchange) {
        return BindingBuilder.bind(paymentEventsQueue).to(paymentExchange).with(ROUTING_KEY_FAILED);
    }
}
