-- ============================================
-- REIMPORT SEED DATA - Xóa dữ liệu cũ và import toàn bộ
-- ============================================

-- USERDB
\c userdb;

TRUNCATE TABLE users, user_verification CASCADE;
ALTER SEQUENCE users_user_id_seq RESTART WITH 1;
ALTER SEQUENCE user_verification_verification_id_seq RESTART WITH 1;

-- TOURDB
\c tourdb;

TRUNCATE TABLE tour_discounts, tour_logs, tour_reviews, custom_tours, payments, bookings, departures, 
         tour_images, tour_schedules, tours, provinces, regions, user_verification, users CASCADE;

ALTER SEQUENCE regions_region_id_seq RESTART WITH 1;
ALTER SEQUENCE provinces_province_id_seq RESTART WITH 1;
ALTER SEQUENCE tours_tour_id_seq RESTART WITH 1;
ALTER SEQUENCE tour_images_image_id_seq RESTART WITH 1;
ALTER SEQUENCE tour_schedules_schedule_id_seq RESTART WITH 1;
ALTER SEQUENCE departures_departure_id_seq RESTART WITH 1;
ALTER SEQUENCE tour_discounts_discount_id_seq RESTART WITH 1;
ALTER SEQUENCE users_user_id_seq RESTART WITH 1;
ALTER SEQUENCE user_verification_verification_id_seq RESTART WITH 1;

-- BOOKINGDB
\c bookingdb;

TRUNCATE TABLE booking_logs, booking_guests, bookings CASCADE;
ALTER SEQUENCE bookings_booking_id_seq RESTART WITH 1;
ALTER SEQUENCE booking_guests_guest_id_seq RESTART WITH 1;
ALTER SEQUENCE booking_logs_log_id_seq RESTART WITH 1;

-- PAYMENTDB
\c paymentdb;

TRUNCATE TABLE refunds, payment_logs, payment_methods, payments CASCADE;
ALTER SEQUENCE payments_payment_id_seq RESTART WITH 1;
ALTER SEQUENCE payment_methods_method_id_seq RESTART WITH 1;
ALTER SEQUENCE payment_logs_log_id_seq RESTART WITH 1;
ALTER SEQUENCE refunds_refund_id_seq RESTART WITH 1;

