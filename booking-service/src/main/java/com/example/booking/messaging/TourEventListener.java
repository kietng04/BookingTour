package com.example.booking.messaging;

import com.example.booking.config.RabbitMQConfig;
import com.example.booking.dto.PaymentChargeMessage;
import com.example.booking.dto.ReservationEvent;
import com.example.booking.model.Booking;
import com.example.booking.service.BookingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TourEventListener {

    private static final Logger log = LoggerFactory.getLogger(TourEventListener.class);

    @Autowired
    private BookingService bookingService;

    @Autowired
    private PaymentCommandPublisher paymentPublisher;

    @Autowired
    private BookingEventPublisher bookingEventPublisher;

    @Autowired
    private EventDeduplicator eventDeduplicator;

    @RabbitListener(queues = RabbitMQConfig.TOUR_SEAT_RESERVED_QUEUE)
    public void onSeatReserved(ReservationEvent event) {
        log.info("[BOOKING-SERVICE] Received seat reserved event for booking {}", event.getBookingId());

        if (eventDeduplicator.isDuplicate(buildKey("reserved", event))) {
            log.info("[BOOKING-SERVICE] Duplicate reserved event ignored. bookingId={}, correlationId={}",
                    event.getBookingId(), event.getCorrelationId());
            return;
        }

        try {
            Booking booking = bookingService.getBookingById(event.getBookingId());

            log.info("[BOOKING-SERVICE] Seats reserved successfully. Proceeding to payment for booking {}",
                    event.getBookingId());

            PaymentChargeMessage chargeMessage = new PaymentChargeMessage(
                    booking.getId().toString(),
                    booking.getTotalAmount().doubleValue(),
                    booking.getUserId(),
                    resolvePaymentOverride(booking, event),
                    null,
                    null
            );

            paymentPublisher.publishChargeRequest(chargeMessage);

        } catch (Exception e) {
            log.error("[BOOKING-SERVICE] Error processing seat reserved event for booking {}: {}",
                    event.getBookingId(), e.getMessage(), e);
        }
    }

    @RabbitListener(queues = RabbitMQConfig.TOUR_SEAT_FAILED_QUEUE)
    public void onSeatReservationFailed(ReservationEvent event) {
        log.info("[BOOKING-SERVICE] Received seat reservation failed event for booking {}",
                event.getBookingId());

        if (eventDeduplicator.isDuplicate(buildKey("failed", event))) {
            log.info("[BOOKING-SERVICE] Duplicate reservation failed event ignored. bookingId={}, correlationId={}",
                    event.getBookingId(), event.getCorrelationId());
            return;
        }

        try {
            Booking booking = bookingService.cancelBooking(event.getBookingId());

            log.error("[BOOKING-SERVICE] Booking {} cancelled due to seat reservation failure",
                    event.getBookingId());

        } catch (Exception e) {
            log.error("[BOOKING-SERVICE] Error processing seat failed event for booking {}: {}",
                    event.getBookingId(), e.getMessage(), e);
        }
    }

    @RabbitListener(queues = RabbitMQConfig.TOUR_SEAT_RELEASED_QUEUE)
    public void onSeatReleased(ReservationEvent event) {
        log.info("[BOOKING-SERVICE] Received seat released event for booking {}", event.getBookingId());

        if (eventDeduplicator.isDuplicate(buildKey("released", event))) {
            log.info("[BOOKING-SERVICE] Duplicate seat released event ignored. bookingId={}, correlationId={}",
                    event.getBookingId(), event.getCorrelationId());
            return;
        }

        try {
            Booking booking = bookingService.getBookingById(event.getBookingId());

            if (booking.getStatus() == Booking.BookingStatus.PENDING) {
                bookingService.cancelBooking(event.getBookingId());
                log.info("[BOOKING-SERVICE] Booking {} moved to CANCELLED after seat release notification", event.getBookingId());
            } else {
                log.info("[BOOKING-SERVICE] Booking {} already in status {} when seat released", event.getBookingId(), booking.getStatus());
            }
        } catch (Exception e) {
            log.error("[BOOKING-SERVICE] Error processing seat released event for booking {}: {}",
                    event.getBookingId(), e.getMessage(), e);
        }
    }

    private String buildKey(String suffix, ReservationEvent event) {
        return (event.getCorrelationId() != null ? event.getCorrelationId() : event.getEventId()) + ":" + suffix;
    }

    private String resolvePaymentOverride(Booking booking, ReservationEvent event) {
        if (event.getPaymentOverride() != null && !event.getPaymentOverride().isBlank()) {
            return event.getPaymentOverride().trim().toUpperCase();
        }
        if (booking.getPaymentOverride() != null && !booking.getPaymentOverride().isBlank()) {
            return booking.getPaymentOverride().trim().toUpperCase();
        }
        return null;
    }
}

