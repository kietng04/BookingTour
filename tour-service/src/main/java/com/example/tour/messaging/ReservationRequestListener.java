package com.example.tour.messaging;

import com.example.tour.config.RabbitMQConfig;
import com.example.tour.service.DepartureService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ReservationRequestListener {

    @Autowired
    private DepartureService departureService;

    @Autowired
    private TourEventPublisher eventPublisher;

    /**
     * Listen for booking created / reservation request events
     * Logic:
     * - Validate departure exists & remainingSlots >= requested
     * - If ok: reserveSlots() and publish tour.seat.reserved
     * - Else: publish tour.seat.reservationFailed
     */
    @RabbitListener(queues = RabbitMQConfig.TOUR_RESERVATION_REQUEST_QUEUE)
    public void onBookingCreated(ReservationEvent event) {
        try {
            // TODO: Add idempotency check (check if already processed)
            
            // Validate and reserve slots
            departureService.reserveSlots(event.getDepartureId(), event.getRequestedSeats());

            // Publish success event
            eventPublisher.publishSeatReserved(
                    event.getBookingId(),
                    event.getTourId(),
                    event.getDepartureId(),
                    event.getRequestedSeats(),
                    event.getCorrelationId()
            );

            System.out.println("Seats reserved successfully for booking: " + event.getBookingId());

        } catch (Exception e) {
            // Publish failure event
            eventPublisher.publishSeatReservationFailed(
                    event.getBookingId(),
                    event.getTourId(),
                    event.getDepartureId(),
                    event.getRequestedSeats(),
                    event.getCorrelationId(),
                    e.getMessage()
            );

            System.err.println("Failed to reserve seats for booking: " + event.getBookingId() 
                    + ", Error: " + e.getMessage());
        }
    }
}

