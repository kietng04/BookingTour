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

    @RabbitListener(queues = RabbitMQConfig.TOUR_SEAT_RESERVED_QUEUE)
    public void onSeatReserved(ReservationEvent event) {
        log.info("[BOOKING-SERVICE] Received seat reserved event for booking {}", event.getBookingId());

        try {
            Booking booking = bookingService.getBookingById(event.getBookingId());

            log.info("[BOOKING-SERVICE] Seats reserved successfully. Proceeding to payment for booking {}",
                    event.getBookingId());

            PaymentChargeMessage chargeMessage = new PaymentChargeMessage(
                    booking.getId().toString(),
                    booking.getTotalAmount().doubleValue(),
                    booking.getUserId()
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

        try {
            Booking booking = bookingService.cancelBooking(event.getBookingId());

            log.error("[BOOKING-SERVICE] Booking {} cancelled due to seat reservation failure",
                    event.getBookingId());

        } catch (Exception e) {
            log.error("[BOOKING-SERVICE] Error processing seat failed event for booking {}: {}",
                    event.getBookingId(), e.getMessage(), e);
        }
    }
}

