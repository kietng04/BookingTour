package com.example.booking.messaging;

import com.example.booking.model.Booking;
import com.example.booking.service.BookingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.booking.config.RabbitMQConfig;
import com.example.booking.dto.PaymentResultMessage;

@Component
public class PaymentEventListener {

    private static final Logger log = LoggerFactory.getLogger(PaymentEventListener.class);

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingEventPublisher bookingEventPublisher;

    @RabbitListener(queues = RabbitMQConfig.PAYMENT_EVENTS_QUEUE)
    public void onPaymentResult(PaymentResultMessage message) {
        log.info("[BOOKING-SERVICE] Received payment result: {}", message);

        try {
            Long bookingId = Long.parseLong(message.getBookingId());

            if ("COMPLETED".equals(message.getStatus())) {
                Booking booking = bookingService.confirmBooking(bookingId);
                log.info("[BOOKING-SERVICE] Booking {} confirmed successfully. Status: PENDING → CONFIRMED",
                        bookingId);

            } else if ("FAILED".equals(message.getStatus())) {
                Booking booking = bookingService.getBookingById(bookingId);
                bookingService.cancelBooking(bookingId);

                bookingEventPublisher.publishReservationCancel(
                        booking.getId(),
                        null, // tourId - not needed for cancel
                        booking.getDepartureId(),
                        booking.getSeats(),
                        booking.getUserId()
                );

                log.info("[BOOKING-SERVICE] Booking {} cancelled due to payment failure. Seats released. Reason: {}",
                        bookingId, message.getMessage());
            }
        } catch (Exception e) {
            log.error("[BOOKING-SERVICE] Error processing payment result for booking {}: {}",
                    message.getBookingId(), e.getMessage(), e);
        }
    }
}


