package com.example.tour.messaging;

import com.example.tour.config.RabbitMQConfig;
import com.example.tour.service.DepartureService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ReleaseRequestListener {

    @Autowired
    private DepartureService departureService;

    @Autowired
    private TourEventPublisher eventPublisher;

    /**
     * Listen for booking cancelled / reservation cancel events
     * Logic:
     * - releaseSlots() and publish tour.seat.released
     */
    @RabbitListener(queues = RabbitMQConfig.TOUR_RELEASE_REQUEST_QUEUE)
    public void onBookingCancelled(ReservationEvent event) {
        try {
            // TODO: Add idempotency check (check if already processed)
            
            // Release slots
            departureService.releaseSlots(event.getDepartureId(), event.getRequestedSeats());

            // Publish released event
            eventPublisher.publishSeatReleased(
                    event.getBookingId(),
                    event.getTourId(),
                    event.getDepartureId(),
                    event.getRequestedSeats(),
                    event.getCorrelationId()
            );

            System.out.println("Seats released successfully for booking: " + event.getBookingId());

        } catch (Exception e) {
            System.err.println("Failed to release seats for booking: " + event.getBookingId() 
                    + ", Error: " + e.getMessage());
        }
    }
}

