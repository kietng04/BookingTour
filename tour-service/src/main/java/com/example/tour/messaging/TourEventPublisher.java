package com.example.tour.messaging;

import com.example.tour.config.RabbitMQConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class TourEventPublisher {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    /**
     * Publish seat reserved event
     */
    public void publishSeatReserved(Long bookingId, Long tourId, Long departureId, 
                                     Integer seats, String correlationId) {
        ReservationEvent event = new ReservationEvent(
                UUID.randomUUID().toString(),
                correlationId,
                LocalDateTime.now(),
                bookingId,
                tourId,
                departureId,
                seats,
                null
        );

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.TOUR_EVENTS_EXCHANGE,
                RabbitMQConfig.TOUR_SEAT_RESERVED_KEY,
                event
        );
    }

    /**
     * Publish seat reservation failed event
     */
    public void publishSeatReservationFailed(Long bookingId, Long tourId, Long departureId,
                                              Integer seats, String correlationId, String reason) {
        ReservationEvent event = new ReservationEvent(
                UUID.randomUUID().toString(),
                correlationId,
                LocalDateTime.now(),
                bookingId,
                tourId,
                departureId,
                seats,
                null
        );

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.TOUR_EVENTS_EXCHANGE,
                RabbitMQConfig.TOUR_SEAT_FAILED_KEY,
                event
        );
    }

    /**
     * Publish seat released event
     */
    public void publishSeatReleased(Long bookingId, Long tourId, Long departureId,
                                     Integer seats, String correlationId) {
        ReservationEvent event = new ReservationEvent(
                UUID.randomUUID().toString(),
                correlationId,
                LocalDateTime.now(),
                bookingId,
                tourId,
                departureId,
                seats,
                null
        );

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.TOUR_EVENTS_EXCHANGE,
                RabbitMQConfig.TOUR_SEAT_RELEASED_KEY,
                event
        );
    }
}

