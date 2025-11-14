package com.example.user.listener;

import com.example.user.config.RabbitMQConfig;
import com.example.user.dto.events.BookingConfirmedEvent;
import com.example.user.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * RabbitMQ listener for booking confirmation email notifications
 */
@Component
public class BookingEmailListener {

    private static final Logger log = LoggerFactory.getLogger(BookingEmailListener.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Autowired
    private EmailService emailService;

    /**
     * Listen for booking confirmed events and send confirmation email
     */
    @RabbitListener(queues = RabbitMQConfig.EMAIL_BOOKING_CONFIRMED_QUEUE)
    public void handleBookingConfirmed(BookingConfirmedEvent event) {
        log.info("Received booking confirmed event for booking {}", event.getBookingId());

        try {
            // Format data for email
            String bookingId = String.valueOf(event.getBookingId());
            String customerName = event.getUserName();
            String tourName = event.getTourName();
            String departureDate = event.getDepartureDate() != null ?
                    event.getDepartureDate().format(DATE_FORMATTER) : "N/A";
            String numberOfPeople = String.valueOf(event.getNumSeats());
            String totalAmount = formatCurrency(event.getTotalAmount());
            String paymentMethod = event.getPaymentMethod() != null ? event.getPaymentMethod() : "MOMO";
            String paymentTime = event.getBookingDate();
            String contactEmail = event.getUserEmail();
            String contactPhone = "N/A"; // Not available in event

            // Send confirmation email
            emailService.sendBookingConfirmationEmail(
                    event.getUserEmail(),
                    customerName,
                    bookingId,
                    tourName,
                    departureDate,
                    numberOfPeople,
                    contactEmail,
                    contactPhone,
                    totalAmount,
                    paymentMethod,
                    paymentTime
            );

            log.info("Booking confirmation email sent successfully for booking {}", event.getBookingId());

        } catch (Exception e) {
            log.error("Failed to send booking confirmation email for booking {}", event.getBookingId(), e);
            // Don't throw exception to avoid message requeue
        }
    }

    /**
     * Format currency amount to Vietnamese Dong
     */
    private String formatCurrency(java.math.BigDecimal amount) {
        if (amount == null) return "0";
        NumberFormat formatter = NumberFormat.getInstance(new Locale("vi", "VN"));
        return formatter.format(amount.longValue());
    }
}
