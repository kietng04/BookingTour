package com.example.booking.messaging;

import com.example.booking.config.RabbitMQConfig;
import com.example.booking.dto.ReservationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class BookingEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(BookingEventPublisher.class);

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void publishReservationRequest(Long bookingId, Long tourId, Long departureId,
                                          Integer seats, Long userId) {
        String correlationId = UUID.randomUUID().toString();

        ReservationEvent event = new ReservationEvent(
                UUID.randomUUID().toString(),
                correlationId,
                LocalDateTime.now(),
                bookingId,
                tourId,
                departureId,
                seats,
                userId
        );

        log.info("[BOOKING-SERVICE] Publishing reservation request for booking {}, departure {}, seats: {}",
                bookingId, departureId, seats);

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.BOOKING_EVENTS_EXCHANGE,
                RabbitMQConfig.RESERVATION_REQUEST_KEY,
                event
        );

        log.info("[BOOKING-SERVICE] Reservation request sent successfully");
    }

    public void publishReservationCancel(Long bookingId, Long tourId, Long departureId,
                                         Integer seats, Long userId) {
        String correlationId = UUID.randomUUID().toString();

        ReservationEvent event = new ReservationEvent(
                UUID.randomUUID().toString(),
                correlationId,
                LocalDateTime.now(),
                bookingId,
                tourId,
                departureId,
                seats,
                userId
        );

        log.info("[BOOKING-SERVICE] Publishing reservation cancel for booking {}, departure {}, seats: {}",
                bookingId, departureId, seats);

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.BOOKING_EVENTS_EXCHANGE,
                RabbitMQConfig.RESERVATION_CANCEL_KEY,
                event
        );

        log.info("[BOOKING-SERVICE] Reservation cancel request sent successfully");
    }
}

