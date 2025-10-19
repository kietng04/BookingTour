package com.example.tour.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Exchange names
    public static final String BOOKING_EVENTS_EXCHANGE = "booking.events";
    public static final String TOUR_EVENTS_EXCHANGE = "tour.events";

    // Queue names
    public static final String TOUR_RESERVATION_REQUEST_QUEUE = "tour.reservation.request";
    public static final String TOUR_RELEASE_REQUEST_QUEUE = "tour.release.request";

    // Routing keys
    public static final String BOOKING_CREATED_KEY = "booking.created";
    public static final String RESERVATION_REQUEST_KEY = "reservation.request";
    public static final String BOOKING_CANCELLED_KEY = "booking.cancelled";
    public static final String RESERVATION_CANCEL_KEY = "reservation.cancel";

    public static final String TOUR_SEAT_RESERVED_KEY = "tour.seat.reserved";
    public static final String TOUR_SEAT_FAILED_KEY = "tour.seat.reservationFailed";
    public static final String TOUR_SEAT_RELEASED_KEY = "tour.seat.released";

    // Exchanges
    @Bean
    public TopicExchange bookingEventsExchange() {
        return new TopicExchange(BOOKING_EVENTS_EXCHANGE);
    }

    @Bean
    public TopicExchange tourEventsExchange() {
        return new TopicExchange(TOUR_EVENTS_EXCHANGE);
    }

    // Queues
    @Bean
    public Queue tourReservationRequestQueue() {
        return new Queue(TOUR_RESERVATION_REQUEST_QUEUE, true);
    }

    @Bean
    public Queue tourReleaseRequestQueue() {
        return new Queue(TOUR_RELEASE_REQUEST_QUEUE, true);
    }

    // Bindings for reservation requests
    @Bean
    public Binding bindingBookingCreated() {
        return BindingBuilder.bind(tourReservationRequestQueue())
                .to(bookingEventsExchange())
                .with(BOOKING_CREATED_KEY);
    }

    @Bean
    public Binding bindingReservationRequest() {
        return BindingBuilder.bind(tourReservationRequestQueue())
                .to(bookingEventsExchange())
                .with(RESERVATION_REQUEST_KEY);
    }

    // Bindings for release requests
    @Bean
    public Binding bindingBookingCancelled() {
        return BindingBuilder.bind(tourReleaseRequestQueue())
                .to(bookingEventsExchange())
                .with(BOOKING_CANCELLED_KEY);
    }

    @Bean
    public Binding bindingReservationCancel() {
        return BindingBuilder.bind(tourReleaseRequestQueue())
                .to(bookingEventsExchange())
                .with(RESERVATION_CANCEL_KEY);
    }
}

