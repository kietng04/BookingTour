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

    @Autowired
    private EventDeduplicator eventDeduplicator;

    @RabbitListener(queues = RabbitMQConfig.TOUR_RELEASE_REQUEST_QUEUE)
    public void onBookingCancelled(ReservationEvent event) {
        String dedupKey = event.getEventId() != null ? event.getEventId() : event.getCorrelationId();
        if (eventDeduplicator.isDuplicate(dedupKey)) {
            System.out.println("Duplicate release request ignored. eventId=" + event.getEventId());
            return;
        }
        try {
            departureService.releaseSlots(event.getDepartureId(), event.getRequestedSeats());

            eventPublisher.publishSeatReleased(
                    event.getBookingId(),
                    event.getTourId(),
                    event.getDepartureId(),
                    event.getRequestedSeats(),
                    event.getCorrelationId(),
                    event.getPaymentOverride()
            );

            System.out.println("Seats released successfully for booking: " + event.getBookingId());

        } catch (Exception e) {
            System.err.println("Failed to release seats for booking: " + event.getBookingId()
                    + ", Error: " + e.getMessage());
        }
    }
}


