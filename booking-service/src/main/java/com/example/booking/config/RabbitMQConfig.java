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

    public static final String BOOKING_EVENTS_EXCHANGE = "booking.events";
    public static final String TOUR_EVENTS_EXCHANGE = "tour.events";

    public static final String TOUR_SEAT_RESERVED_QUEUE = "tour.seat.reserved.queue";
    public static final String TOUR_SEAT_FAILED_QUEUE = "tour.seat.failed.queue";
    public static final String TOUR_SEAT_RELEASED_QUEUE = "tour.seat.released.queue";

    public static final String RESERVATION_REQUEST_KEY = "reservation.request";
    public static final String RESERVATION_CANCEL_KEY = "reservation.cancel";
    public static final String TOUR_SEAT_RESERVED_KEY = "tour.seat.reserved";
    public static final String TOUR_SEAT_FAILED_KEY = "tour.seat.reservationFailed";
    public static final String TOUR_SEAT_RELEASED_KEY = "tour.seat.released";

    // Email notification
    public static final String EMAIL_EXCHANGE = "email.exchange";
    public static final String EMAIL_BOOKING_CONFIRMED_QUEUE = "email.booking.confirmed.queue";
    public static final String EMAIL_BOOKING_CONFIRMED_KEY = "email.booking.confirmed";

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

    @Bean
    public org.springframework.amqp.core.TopicExchange bookingEventsExchange() {
        return new org.springframework.amqp.core.TopicExchange(BOOKING_EVENTS_EXCHANGE);
    }

    @Bean
    public org.springframework.amqp.core.TopicExchange tourEventsExchange() {
        return new org.springframework.amqp.core.TopicExchange(TOUR_EVENTS_EXCHANGE);
    }

    @Bean
    public Queue tourSeatReservedQueue() {
        return new Queue(TOUR_SEAT_RESERVED_QUEUE, true);
    }

    @Bean
    public Queue tourSeatFailedQueue() {
        return new Queue(TOUR_SEAT_FAILED_QUEUE, true);
    }

    @Bean
    public Queue tourSeatReleasedQueue() {
        return new Queue(TOUR_SEAT_RELEASED_QUEUE, true);
    }

    @Bean
    public Binding bindingTourSeatReserved() {
        return BindingBuilder.bind(tourSeatReservedQueue())
                .to(tourEventsExchange())
                .with(TOUR_SEAT_RESERVED_KEY);
    }

    @Bean
    public Binding bindingTourSeatFailed() {
        return BindingBuilder.bind(tourSeatFailedQueue())
                .to(tourEventsExchange())
                .with(TOUR_SEAT_FAILED_KEY);
    }

    @Bean
    public Binding bindingTourSeatReleased() {
        return BindingBuilder.bind(tourSeatReleasedQueue())
                .to(tourEventsExchange())
                .with(TOUR_SEAT_RELEASED_KEY);
    }

    // Email notification beans
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

