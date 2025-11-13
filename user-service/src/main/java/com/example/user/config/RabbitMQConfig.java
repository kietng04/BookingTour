package com.example.user.config;

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

    // Email notification constants (must match booking-service)
    public static final String EMAIL_EXCHANGE = "email.exchange";
    public static final String EMAIL_BOOKING_CONFIRMED_QUEUE = "email.booking.confirmed.queue";
    public static final String EMAIL_BOOKING_CONFIRMED_KEY = "email.booking.confirmed";

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public DirectExchange emailExchange() {
        return new DirectExchange(EMAIL_EXCHANGE);
    }

    @Bean
    public Queue emailBookingConfirmedQueue() {
        return new Queue(EMAIL_BOOKING_CONFIRMED_QUEUE, true);
    }

    @Bean
    public Binding bindingEmailBookingConfirmed() {
        return BindingBuilder.bind(emailBookingConfirmedQueue())
                .to(emailExchange())
                .with(EMAIL_BOOKING_CONFIRMED_KEY);
    }
}
