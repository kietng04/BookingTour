package com.example.booking.messaging;

import com.example.booking.model.Booking;
import com.example.booking.service.BookingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.example.booking.config.RabbitMQConfig;
import com.example.booking.dto.PaymentResultMessage;

import java.util.HashMap;
import java.util.Map;

@Component
public class PaymentEventListener {

    private static final Logger log = LoggerFactory.getLogger(PaymentEventListener.class);

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingEventPublisher bookingEventPublisher;

    @Autowired
    private EventDeduplicator eventDeduplicator;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${user.service.url:http://localhost:8081}")
    private String userServiceUrl;

    @RabbitListener(queues = RabbitMQConfig.PAYMENT_EVENTS_QUEUE)
    public void onPaymentResult(PaymentResultMessage message) {
        log.info("[BOOKING-SERVICE] Received payment result: {}", message);

        if (eventDeduplicator.isDuplicate(message.getBookingId() + ":" + message.getStatus())) {
            log.info("[BOOKING-SERVICE] Duplicate payment result ignored. bookingId={}, status={}",
                    message.getBookingId(), message.getStatus());
            return;
        }

        try {
            Long bookingId = Long.parseLong(message.getBookingId());

            if ("PAYMENT_COMPLETED".equals(message.getStatus())) {
                // Payment completed - booking remains PENDING awaiting admin confirmation
                Booking booking = bookingService.getBookingById(bookingId);
                log.info("[BOOKING-SERVICE] Payment completed for booking {}. " +
                        "Status remains PENDING - awaiting admin confirmation", bookingId);

                // Optional: Notify admin about new paid booking awaiting confirmation
                // Future enhancement: Send notification to admin dashboard

            } else if ("FAILED".equals(message.getStatus())) {
                // Payment failed - mark booking as FAILED and release seats
                Booking booking = bookingService.getBookingById(bookingId);
                bookingService.failBooking(bookingId);

                bookingEventPublisher.publishReservationCancel(
                        booking.getId(),
                        booking.getTourId(),
                        booking.getDepartureId(),
                        booking.getNumSeats(),
                        booking.getUserId()
                );

                log.info("[BOOKING-SERVICE] Booking {} marked as FAILED due to payment failure. Seats released. Reason: {}",
                        bookingId, message.getMessage());
            }
        } catch (Exception e) {
            log.error("[BOOKING-SERVICE] Error processing payment result for booking {}: {}",
                    message.getBookingId(), e.getMessage(), e);
        }
    }

    /**
     * Gửi email invoice đặt tour sau khi thanh toán thành công
     */
    private void sendBookingInvoiceEmail(Booking booking) {
        try {
            Map<String, Object> userInfo = getUserInfo(booking.getUserId());
            String userEmail = (String) userInfo.get("email");
            String fullName = (String) userInfo.get("fullName");

            if (userEmail == null || userEmail.isEmpty()) {
                log.warn("[BOOKING-SERVICE] User email not found for booking {}", booking.getId());
                return;
            }

            Map<String, Object> tourInfo = getTourInfo(booking.getTourId());
            String tourName = (String) tourInfo.get("title");

            Map<String, Object> departureInfo = getDepartureInfo(booking.getDepartureId());
            String departureDate = (String) departureInfo.get("departureDate");

            Map<String, Object> emailRequest = new HashMap<>();
            emailRequest.put("toEmail", userEmail);
            emailRequest.put("fullName", fullName != null ? fullName : "Khách hàng");
            emailRequest.put("bookingId", booking.getId());
            emailRequest.put("tourName", tourName != null ? tourName : "Tour du lịch");
            emailRequest.put("numSeats", booking.getNumSeats());
            emailRequest.put("totalAmount", booking.getTotalAmount());
            emailRequest.put("departureDate", departureDate != null ? departureDate : "Đang cập nhật");
            emailRequest.put("paymentMethod", booking.getPaymentOverride() != null ? booking.getPaymentOverride() : "MOMO");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(emailRequest, headers);

            String url = userServiceUrl + "/auth/send-booking-invoice";
            restTemplate.postForObject(url, entity, Map.class);

            log.info("[BOOKING-SERVICE] Booking invoice email sent successfully for booking {}", booking.getId());
        } catch (Exception e) {
            log.error("[BOOKING-SERVICE] Failed to send booking invoice email: {}", e.getMessage(), e);
            throw e;
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> getUserInfo(Long userId) {
        try {
            String url = userServiceUrl + "/users/" + userId;
            return restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            log.warn("[BOOKING-SERVICE] Failed to get user info for userId {}: {}", userId, e.getMessage());
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("email", "");
            fallback.put("fullName", "Khách hàng");
            return fallback;
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> getTourInfo(Long tourId) {
        try {
            String url = "http://localhost:8082/tours/" + tourId;
            return restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            log.warn("[BOOKING-SERVICE] Failed to get tour info for tourId {}: {}", tourId, e.getMessage());
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("title", "Tour du lịch");
            return fallback;
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> getDepartureInfo(Long departureId) {
        try {
            String url = "http://localhost:8082/departures/" + departureId;
            return restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            log.warn("[BOOKING-SERVICE] Failed to get departure info for departureId {}: {}", departureId, e.getMessage());
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("departureDate", "Đang cập nhật");
            return fallback;
        }
    }
}




