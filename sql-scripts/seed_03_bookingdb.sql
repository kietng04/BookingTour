-- ============================================
-- SEED DATA FOR BOOKINGDB
-- Bookings, Booking Guests, Booking Logs
-- ============================================

-- Clear existing data (optional - uncomment if needed)
-- TRUNCATE TABLE booking_logs CASCADE;
-- TRUNCATE TABLE booking_guests CASCADE;
-- TRUNCATE TABLE bookings CASCADE;

-- Reset sequences
ALTER SEQUENCE bookings_booking_id_seq RESTART WITH 1;
ALTER SEQUENCE booking_guests_guest_id_seq RESTART WITH 1;
ALTER SEQUENCE booking_logs_log_id_seq RESTART WITH 1;

-- ============================================
-- BOOKINGS
-- 80 bookings total:
-- 30 CONFIRMED, 25 PENDING, 15 COMPLETED, 10 CANCELLED
-- ============================================

-- CONFIRMED BOOKINGS (30) - Recent bookings, future departures
INSERT INTO bookings (user_id, tour_id, departure_id, num_seats, total_amount, payment_override, status, notes, created_at, updated_at) VALUES
(1, 1, 1, 2, 13000000, NULL, 'CONFIRMED', 'Đặt tour gia đình, cần 2 phòng liền kề', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days'),
(2, 2, 5, 3, 26700000, 'SUCCESS', 'CONFIRMED', 'Đã thanh toán qua MoMo', NOW() - INTERVAL '20 days', NOW() - INTERVAL '19 days'),
(3, 3, 9, 2, 9000000, NULL, 'CONFIRMED', 'Honeymoon trip', NOW() - INTERVAL '12 days', NOW() - INTERVAL '11 days'),
(4, 4, 13, 4, 28800000, 'SUCCESS', 'CONFIRMED', 'Tour gia đình 4 người', NOW() - INTERVAL '18 days', NOW() - INTERVAL '17 days'),
(5, 5, 17, 2, 11600000, NULL, 'CONFIRMED', NULL, NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days'),
(6, 6, 21, 2, 6400000, 'SUCCESS', 'CONFIRMED', 'Tour cuối tuần', NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days'),
(7, 7, 25, 3, 14400000, NULL, 'CONFIRMED', 'Nhóm bạn đi cùng', NOW() - INTERVAL '16 days', NOW() - INTERVAL '15 days'),
(8, 8, 29, 2, 12400000, 'SUCCESS', 'CONFIRMED', NULL, NOW() - INTERVAL '14 days', NOW() - INTERVAL '13 days'),
(9, 9, 33, 1, 2800000, NULL, 'CONFIRMED', 'Solo traveler', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'),
(10, 10, 37, 2, 5000000, 'SUCCESS', 'CONFIRMED', 'Tour gần TP.HCM', NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days'),
(11, 11, 41, 3, 12600000, NULL, 'CONFIRMED', 'Khám phá miền Tây', NOW() - INTERVAL '22 days', NOW() - INTERVAL '21 days'),
(12, 12, 45, 2, 10400000, 'SUCCESS', 'CONFIRMED', NULL, NOW() - INTERVAL '11 days', NOW() - INTERVAL '10 days'),
(13, 13, 49, 2, 11000000, NULL, 'CONFIRMED', 'Thám hiểm động', NOW() - INTERVAL '9 days', NOW() - INTERVAL '8 days'),
(14, 14, 53, 3, 14400000, 'SUCCESS', 'CONFIRMED', NULL, NOW() - INTERVAL '13 days', NOW() - INTERVAL '12 days'),
(15, 15, 57, 2, 13600000, NULL, 'CONFIRMED', 'Tour trekking', NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days'),
(16, 16, 61, 2, 9000000, 'SUCCESS', 'CONFIRMED', NULL, NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days'),
(17, 17, 65, 1, 3800000, NULL, 'CONFIRMED', 'Business trip', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
(1, 2, 6, 2, 17800000, 'SUCCESS', 'CONFIRMED', 'Lần thứ 2 đặt tour', NOW() - INTERVAL '25 days', NOW() - INTERVAL '24 days'),
(2, 3, 10, 3, 13500000, NULL, 'CONFIRMED', NULL, NOW() - INTERVAL '17 days', NOW() - INTERVAL '16 days'),
(3, 5, 18, 2, 11600000, 'SUCCESS', 'CONFIRMED', NULL, NOW() - INTERVAL '19 days', NOW() - INTERVAL '18 days'),
(4, 7, 26, 2, 9600000, NULL, 'CONFIRMED', NULL, NOW() - INTERVAL '21 days', NOW() - INTERVAL '20 days'),
(5, 8, 30, 3, 18600000, 'SUCCESS', 'CONFIRMED', NULL, NOW() - INTERVAL '23 days', NOW() - INTERVAL '22 days'),
(6, 10, 38, 2, 5000000, NULL, 'CONFIRMED', NULL, NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days'),
(7, 11, 42, 2, 8400000, 'SUCCESS', 'CONFIRMED', NULL, NOW() - INTERVAL '24 days', NOW() - INTERVAL '23 days'),
(8, 13, 50, 2, 11000000, NULL, 'CONFIRMED', NULL, NOW() - INTERVAL '26 days', NOW() - INTERVAL '25 days'),
(9, 15, 58, 1, 6800000, 'SUCCESS', 'CONFIRMED', 'Solo trip Hà Giang', NOW() - INTERVAL '27 days', NOW() - INTERVAL '26 days'),
(10, 16, 62, 3, 13500000, NULL, 'CONFIRMED', NULL, NOW() - INTERVAL '28 days', NOW() - INTERVAL '27 days'),
(11, 1, 2, 2, 13000000, 'SUCCESS', 'CONFIRMED', NULL, NOW() - INTERVAL '29 days', NOW() - INTERVAL '28 days'),
(12, 4, 14, 3, 21600000, NULL, 'CONFIRMED', NULL, NOW() - INTERVAL '30 days', NOW() - INTERVAL '29 days'),
(13, 6, 22, 2, 6400000, 'SUCCESS', 'CONFIRMED', NULL, NOW() - INTERVAL '31 days', NOW() - INTERVAL '30 days');

-- PENDING BOOKINGS (25) - Waiting for confirmation
INSERT INTO bookings (user_id, tour_id, departure_id, num_seats, total_amount, payment_override, status, notes, created_at, updated_at) VALUES
(14, 1, 3, 2, 13000000, NULL, 'PENDING', 'Chờ xác nhận thanh toán', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(15, 2, 7, 2, 17800000, NULL, 'PENDING', NULL, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),
(16, 3, 11, 3, 13500000, NULL, 'PENDING', NULL, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
(17, 4, 15, 2, 14400000, NULL, 'PENDING', NULL, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours'),
(18, 5, 19, 3, 17400000, NULL, 'PENDING', NULL, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),
(19, 6, 23, 2, 6400000, NULL, 'PENDING', NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(20, 7, 27, 2, 9600000, NULL, 'PENDING', NULL, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours'),
(1, 8, 31, 2, 12400000, NULL, 'PENDING', NULL, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours'),
(2, 9, 35, 1, 2800000, NULL, 'PENDING', NULL, NOW() - INTERVAL '8 hours', NOW() - INTERVAL '8 hours'),
(3, 10, 39, 2, 5000000, NULL, 'PENDING', NULL, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),
(4, 11, 43, 2, 8400000, NULL, 'PENDING', NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(5, 12, 46, 3, 15600000, NULL, 'PENDING', NULL, NOW() - INTERVAL '10 hours', NOW() - INTERVAL '10 hours'),
(6, 13, 51, 2, 11000000, NULL, 'PENDING', NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(7, 14, 54, 2, 9600000, NULL, 'PENDING', NULL, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours'),
(8, 15, 59, 2, 13600000, NULL, 'PENDING', NULL, NOW() - INTERVAL '14 hours', NOW() - INTERVAL '14 hours'),
(9, 16, 63, 2, 9000000, NULL, 'PENDING', NULL, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
(10, 17, 66, 2, 7600000, NULL, 'PENDING', NULL, NOW() - INTERVAL '16 hours', NOW() - INTERVAL '16 hours'),
(11, 1, 4, 3, 19500000, NULL, 'PENDING', NULL, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
(12, 2, 8, 2, 17800000, NULL, 'PENDING', NULL, NOW() - INTERVAL '18 hours', NOW() - INTERVAL '18 hours'),
(13, 3, 12, 2, 9000000, NULL, 'PENDING', NULL, NOW() - INTERVAL '20 hours', NOW() - INTERVAL '20 hours'),
(14, 5, 20, 2, 11600000, NULL, 'PENDING', NULL, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
(15, 7, 28, 3, 14400000, NULL, 'PENDING', NULL, NOW() - INTERVAL '22 hours', NOW() - INTERVAL '22 hours'),
(16, 9, 36, 1, 2800000, NULL, 'PENDING', NULL, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
(17, 12, 47, 2, 10400000, NULL, 'PENDING', NULL, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),
(18, 14, 55, 2, 9600000, NULL, 'PENDING', NULL, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours');

-- COMPLETED BOOKINGS (15) - Past trips
INSERT INTO bookings (user_id, tour_id, departure_id, num_seats, total_amount, payment_override, status, notes, created_at, updated_at) VALUES
(1, 1, 1, 2, 13000000, 'SUCCESS', 'COMPLETED', 'Chuyến đi tuyệt vời!', NOW() - INTERVAL '90 days', NOW() - INTERVAL '60 days'),
(2, 2, 5, 2, 17800000, 'SUCCESS', 'COMPLETED', NULL, NOW() - INTERVAL '85 days', NOW() - INTERVAL '55 days'),
(3, 3, 9, 3, 13500000, 'SUCCESS', 'COMPLETED', NULL, NOW() - INTERVAL '80 days', NOW() - INTERVAL '50 days'),
(4, 5, 17, 2, 11600000, 'SUCCESS', 'COMPLETED', NULL, NOW() - INTERVAL '75 days', NOW() - INTERVAL '45 days'),
(5, 6, 21, 2, 6400000, 'SUCCESS', 'COMPLETED', NULL, NOW() - INTERVAL '70 days', NOW() - INTERVAL '40 days'),
(6, 7, 25, 3, 14400000, 'SUCCESS', 'COMPLETED', 'Tour rất đáng giá', NOW() - INTERVAL '65 days', NOW() - INTERVAL '35 days'),
(7, 9, 33, 1, 2800000, 'SUCCESS', 'COMPLETED', NULL, NOW() - INTERVAL '60 days', NOW() - INTERVAL '30 days'),
(8, 10, 37, 2, 5000000, 'SUCCESS', 'COMPLETED', NULL, NOW() - INTERVAL '55 days', NOW() - INTERVAL '25 days'),
(9, 11, 41, 2, 8400000, 'SUCCESS', 'COMPLETED', NULL, NOW() - INTERVAL '50 days', NOW() - INTERVAL '20 days'),
(10, 13, 49, 2, 11000000, 'SUCCESS', 'COMPLETED', 'Khám phá động tuyệt vời', NOW() - INTERVAL '45 days', NOW() - INTERVAL '15 days'),
(11, 15, 57, 2, 13600000, 'SUCCESS', 'COMPLETED', NULL, NOW() - INTERVAL '40 days', NOW() - INTERVAL '10 days'),
(12, 16, 61, 3, 13500000, 'SUCCESS', 'COMPLETED', NULL, NOW() - INTERVAL '35 days', NOW() - INTERVAL '5 days'),
(13, 17, 65, 1, 3800000, 'SUCCESS', 'COMPLETED', NULL, NOW() - INTERVAL '30 days', NOW() - INTERVAL '5 days'),
(14, 4, 13, 2, 14400000, 'SUCCESS', 'COMPLETED', NULL, NOW() - INTERVAL '25 days', NOW() - INTERVAL '5 days'),
(15, 8, 29, 2, 12400000, 'SUCCESS', 'COMPLETED', NULL, NOW() - INTERVAL '20 days', NOW() - INTERVAL '5 days');

-- CANCELLED BOOKINGS (10)
INSERT INTO bookings (user_id, tour_id, departure_id, num_seats, total_amount, payment_override, status, notes, created_at, updated_at) VALUES
(16, 1, 2, 2, 13000000, NULL, 'CANCELLED', 'Khách hủy vì lý do cá nhân', NOW() - INTERVAL '35 days', NOW() - INTERVAL '34 days'),
(17, 2, 6, 3, 26700000, 'SUCCESS', 'CANCELLED', 'Hoàn tiền qua MoMo', NOW() - INTERVAL '40 days', NOW() - INTERVAL '38 days'),
(18, 3, 10, 2, 9000000, NULL, 'CANCELLED', NULL, NOW() - INTERVAL '45 days', NOW() - INTERVAL '43 days'),
(19, 5, 18, 2, 11600000, 'SUCCESS', 'CANCELLED', 'Thay đổi lịch trình', NOW() - INTERVAL '50 days', NOW() - INTERVAL '48 days'),
(20, 7, 26, 3, 14400000, NULL, 'CANCELLED', NULL, NOW() - INTERVAL '55 days', NOW() - INTERVAL '53 days'),
(1, 9, 34, 1, 2800000, NULL, 'CANCELLED', NULL, NOW() - INTERVAL '60 days', NOW() - INTERVAL '58 days'),
(2, 11, 42, 2, 8400000, 'SUCCESS', 'CANCELLED', 'Hoàn tiền do dịch bệnh', NOW() - INTERVAL '65 days', NOW() - INTERVAL '63 days'),
(3, 13, 50, 2, 11000000, NULL, 'CANCELLED', NULL, NOW() - INTERVAL '70 days', NOW() - INTERVAL '68 days'),
(4, 15, 58, 2, 13600000, 'SUCCESS', 'CANCELLED', NULL, NOW() - INTERVAL '75 days', NOW() - INTERVAL '73 days'),
(5, 16, 62, 2, 9000000, NULL, 'CANCELLED', 'Lý do gia đình', NOW() - INTERVAL '80 days', NOW() - INTERVAL '78 days');

-- ============================================
-- BOOKING GUESTS (2 guests per booking avg = 160 guests)
-- ============================================

-- Guests for Confirmed Bookings (booking_id 1-30)
INSERT INTO booking_guests (booking_id, guest_name, guest_email, guest_phone, guest_type, created_at) VALUES
-- Booking 1
(1, 'Nguyễn Văn A', 'nguyenvana@gmail.com', '0901234567', 'ADULT', NOW() - INTERVAL '15 days'),
(1, 'Trần Thị B', 'tranthib@gmail.com', '0902345678', 'ADULT', NOW() - INTERVAL '15 days'),

-- Booking 2
(2, 'Trần Thị B', 'tranthib@gmail.com', '0902345678', 'ADULT', NOW() - INTERVAL '20 days'),
(2, 'Nguyễn Văn C', 'nguyenvanc@gmail.com', '0903456789', 'ADULT', NOW() - INTERVAL '20 days'),
(2, 'Nguyễn Thị D', 'nguyenthid@gmail.com', '0904567890', 'CHILD', NOW() - INTERVAL '20 days'),

-- Booking 3
(3, 'Lê Văn C', 'levanc@gmail.com', '0903456789', 'ADULT', NOW() - INTERVAL '12 days'),
(3, 'Phạm Thị E', 'phamthie@gmail.com', '0905678901', 'ADULT', NOW() - INTERVAL '12 days'),

-- Booking 4
(4, 'Phạm Thị D', 'phamthid@gmail.com', '0904567890', 'ADULT', NOW() - INTERVAL '18 days'),
(4, 'Hoàng Văn F', 'hoangvanf@gmail.com', '0906789012', 'ADULT', NOW() - INTERVAL '18 days'),
(4, 'Hoàng Thị G', 'hoangthig@gmail.com', '0907890123', 'CHILD', NOW() - INTERVAL '18 days'),
(4, 'Hoàng Văn H', 'hoangvanh@gmail.com', '0908901234', 'CHILD', NOW() - INTERVAL '18 days'),

-- Booking 5
(5, 'Hoàng Văn E', 'hoangvane@gmail.com', '0905678901', 'ADULT', NOW() - INTERVAL '10 days'),
(5, 'Vũ Thị I', 'vuthii@gmail.com', '0909012345', 'ADULT', NOW() - INTERVAL '10 days'),

-- Continue pattern for all 80 bookings...
-- (Adding representative samples to keep file manageable)

-- Booking 6-10
(6, 'Vũ Thị F', 'vuthif@gmail.com', '0906789012', 'ADULT', NOW() - INTERVAL '8 days'),
(6, 'Đặng Văn K', 'dangvank@gmail.com', '0910123456', 'ADULT', NOW() - INTERVAL '8 days'),

(7, 'Đặng Văn G', 'dangvang@gmail.com', '0907890123', 'ADULT', NOW() - INTERVAL '16 days'),
(7, 'Bùi Thị L', 'buithil@gmail.com', '0911234567', 'ADULT', NOW() - INTERVAL '16 days'),
(7, 'Bùi Văn M', 'buivanm@gmail.com', '0912345678', 'ADULT', NOW() - INTERVAL '16 days'),

(8, 'Bùi Thị H', 'buithih@gmail.com', '0908901234', 'ADULT', NOW() - INTERVAL '14 days'),
(8, 'Đỗ Văn N', 'dovann@gmail.com', '0913456789', 'ADULT', NOW() - INTERVAL '14 days'),

(9, 'Đỗ Văn I', 'dovani@gmail.com', '0909012345', 'ADULT', NOW() - INTERVAL '6 days'),

(10, 'Ngô Thị K', 'ngothik@gmail.com', '0910123456', 'ADULT', NOW() - INTERVAL '4 days'),
(10, 'Lý Văn O', 'lyvano@gmail.com', '0914567890', 'ADULT', NOW() - INTERVAL '4 days');

-- Adding more guests for diversity (bookings 11-30)
INSERT INTO booking_guests (booking_id, guest_name, guest_email, guest_phone, guest_type, created_at) VALUES
(11, 'Lý Văn L', 'lyvanl@gmail.com', '0911234567', 'ADULT', NOW() - INTERVAL '22 days'),
(11, 'Dương Thị P', 'duongthip@gmail.com', '0915678901', 'ADULT', NOW() - INTERVAL '22 days'),
(11, 'Dương Văn Q', 'duongvanq@gmail.com', '0916789012', 'CHILD', NOW() - INTERVAL '22 days'),

(12, 'Dương Thị M', 'duongthim@gmail.com', '0912345678', 'ADULT', NOW() - INTERVAL '11 days'),
(12, 'Hà Văn R', 'havanr@gmail.com', '0917890123', 'ADULT', NOW() - INTERVAL '11 days'),

(13, 'Hà Văn N', 'havann@gmail.com', '0913456789', 'ADULT', NOW() - INTERVAL '9 days'),
(13, 'Trương Thị S', 'truongthis@gmail.com', '0918901234', 'ADULT', NOW() - INTERVAL '9 days'),

(14, 'Trương Thị O', 'truongthio@gmail.com', '0914567890', 'ADULT', NOW() - INTERVAL '13 days'),
(14, 'Mai Văn T', 'maivant@gmail.com', '0919012345', 'ADULT', NOW() - INTERVAL '13 days'),
(14, 'Mai Thị U', 'maithiu@gmail.com', '0920123456', 'CHILD', NOW() - INTERVAL '13 days'),

(15, 'Mai Văn P', 'maivanp@gmail.com', '0915678901', 'ADULT', NOW() - INTERVAL '7 days'),
(15, 'Tạ Thị V', 'tathiv@gmail.com', '0921234567', 'ADULT', NOW() - INTERVAL '7 days');

-- Guests for remaining confirmed bookings (16-30) - abbreviated
INSERT INTO booking_guests (booking_id, guest_name, guest_email, guest_phone, guest_type, created_at) VALUES
(16, 'Tạ Thị Q', 'tathiq@gmail.com', '0916789012', 'ADULT', NOW() - INTERVAL '5 days'),
(16, 'Cao Văn W', 'caovanw@gmail.com', '0922345678', 'ADULT', NOW() - INTERVAL '5 days'),
(17, 'Cao Văn R', 'caovanr@gmail.com', '0917890123', 'ADULT', NOW() - INTERVAL '3 days'),
(18, 'Nguyễn Văn X', 'nguyenvanx@gmail.com', '0923456789', 'ADULT', NOW() - INTERVAL '25 days'),
(18, 'Nguyễn Thị Y', 'nguyenthiy@gmail.com', '0924567890', 'ADULT', NOW() - INTERVAL '25 days'),
(19, 'Trần Văn Z', 'tranvanz@gmail.com', '0925678901', 'ADULT', NOW() - INTERVAL '17 days'),
(19, 'Trần Thị AA', 'tranthiaa@gmail.com', '0926789012', 'ADULT', NOW() - INTERVAL '17 days'),
(19, 'Trần Văn BB', 'tranvanbb@gmail.com', '0927890123', 'CHILD', NOW() - INTERVAL '17 days'),
(20, 'Lê Văn CC', 'levancc@gmail.com', '0928901234', 'ADULT', NOW() - INTERVAL '19 days'),
(20, 'Lê Thị DD', 'lethidd@gmail.com', '0929012345', 'ADULT', NOW() - INTERVAL '19 days');

-- Guests for Pending Bookings (31-55) - abbreviated
INSERT INTO booking_guests (booking_id, guest_name, guest_email, guest_phone, guest_type, created_at) VALUES
(31, 'Phạm Văn EE', 'phamvanee@gmail.com', '0930123456', 'ADULT', NOW() - INTERVAL '2 days'),
(31, 'Phạm Thị FF', 'phamthiff@gmail.com', '0931234567', 'ADULT', NOW() - INTERVAL '2 days'),
(32, 'Hoàng Văn GG', 'hoangvangg@gmail.com', '0932345678', 'ADULT', NOW() - INTERVAL '1 days'),
(32, 'Hoàng Thị HH', 'hoangthihh@gmail.com', '0933456789', 'ADULT', NOW() - INTERVAL '1 days');

-- Guests for Completed Bookings (56-70)
INSERT INTO booking_guests (booking_id, guest_name, guest_email, guest_phone, guest_type, created_at) VALUES
(56, 'Nguyễn Văn A', 'nguyenvana@gmail.com', '0901234567', 'ADULT', NOW() - INTERVAL '90 days'),
(56, 'Vũ Thị II', 'vuthiii@gmail.com', '0934567890', 'ADULT', NOW() - INTERVAL '90 days'),
(57, 'Trần Thị B', 'tranthib@gmail.com', '0902345678', 'ADULT', NOW() - INTERVAL '85 days'),
(57, 'Đặng Văn JJ', 'dangvanjj@gmail.com', '0935678901', 'ADULT', NOW() - INTERVAL '85 days');

-- Guests for Cancelled Bookings (71-80)
INSERT INTO booking_guests (booking_id, guest_name, guest_email, guest_phone, guest_type, created_at) VALUES
(71, 'Bùi Văn KK', 'buivankk@gmail.com', '0936789012', 'ADULT', NOW() - INTERVAL '35 days'),
(71, 'Bùi Thị LL', 'buithill@gmail.com', '0937890123', 'ADULT', NOW() - INTERVAL '35 days'),
(72, 'Đỗ Văn MM', 'dovanmm@gmail.com', '0938901234', 'ADULT', NOW() - INTERVAL '40 days'),
(72, 'Đỗ Thị NN', 'dothinn@gmail.com', '0939012345', 'ADULT', NOW() - INTERVAL '40 days'),
(72, 'Đỗ Văn OO', 'dovanoo@gmail.com', '0940123456', 'CHILD', NOW() - INTERVAL '40 days');

-- ============================================
-- BOOKING LOGS (Track status changes)
-- ============================================

-- Logs for CONFIRMED bookings (status change: PENDING -> CONFIRMED)
INSERT INTO booking_logs (booking_id, action, old_status, new_status, details, created_at) VALUES
(1, 'BOOKING_CREATED', NULL, 'PENDING', 'Booking created by user', NOW() - INTERVAL '15 days'),
(1, 'BOOKING_CONFIRMED', 'PENDING', 'CONFIRMED', 'Payment confirmed, slots reserved', NOW() - INTERVAL '14 days'),

(2, 'BOOKING_CREATED', NULL, 'PENDING', 'Booking created by user', NOW() - INTERVAL '20 days'),
(2, 'BOOKING_CONFIRMED', 'PENDING', 'CONFIRMED', 'MoMo payment successful', NOW() - INTERVAL '19 days'),

(3, 'BOOKING_CREATED', NULL, 'PENDING', 'Booking created by user', NOW() - INTERVAL '12 days'),
(3, 'BOOKING_CONFIRMED', 'PENDING', 'CONFIRMED', 'Admin confirmed booking', NOW() - INTERVAL '11 days');

-- Logs for PENDING bookings (only creation)
INSERT INTO booking_logs (booking_id, action, old_status, new_status, details, created_at) VALUES
(31, 'BOOKING_CREATED', NULL, 'PENDING', 'Booking created, awaiting payment', NOW() - INTERVAL '2 days'),
(32, 'BOOKING_CREATED', NULL, 'PENDING', 'Booking created, awaiting payment', NOW() - INTERVAL '1 days'),
(33, 'BOOKING_CREATED', NULL, 'PENDING', 'Booking created, awaiting payment', NOW() - INTERVAL '3 hours');

-- Logs for COMPLETED bookings (PENDING -> CONFIRMED -> COMPLETED)
INSERT INTO booking_logs (booking_id, action, old_status, new_status, details, created_at) VALUES
(56, 'BOOKING_CREATED', NULL, 'PENDING', 'Booking created by user', NOW() - INTERVAL '90 days'),
(56, 'BOOKING_CONFIRMED', 'PENDING', 'CONFIRMED', 'Payment confirmed', NOW() - INTERVAL '89 days'),
(56, 'BOOKING_COMPLETED', 'CONFIRMED', 'COMPLETED', 'Tour completed successfully', NOW() - INTERVAL '60 days'),

(57, 'BOOKING_CREATED', NULL, 'PENDING', 'Booking created by user', NOW() - INTERVAL '85 days'),
(57, 'BOOKING_CONFIRMED', 'PENDING', 'CONFIRMED', 'Payment confirmed', NOW() - INTERVAL '84 days'),
(57, 'BOOKING_COMPLETED', 'CONFIRMED', 'COMPLETED', 'Tour completed successfully', NOW() - INTERVAL '55 days');

-- Logs for CANCELLED bookings (PENDING/CONFIRMED -> CANCELLED)
INSERT INTO booking_logs (booking_id, action, old_status, new_status, details, created_at) VALUES
(71, 'BOOKING_CREATED', NULL, 'PENDING', 'Booking created by user', NOW() - INTERVAL '35 days'),
(71, 'BOOKING_CANCELLED', 'PENDING', 'CANCELLED', 'Customer requested cancellation', NOW() - INTERVAL '34 days'),

(72, 'BOOKING_CREATED', NULL, 'PENDING', 'Booking created by user', NOW() - INTERVAL '40 days'),
(72, 'BOOKING_CONFIRMED', 'PENDING', 'CONFIRMED', 'Payment confirmed', NOW() - INTERVAL '39 days'),
(72, 'BOOKING_CANCELLED', 'CONFIRMED', 'CANCELLED', 'Customer requested refund', NOW() - INTERVAL '38 days');

-- ============================================
-- SUMMARY
-- ============================================

SELECT 'BOOKINGDB seeded successfully!' as status,
       (SELECT COUNT(*) FROM bookings) as total_bookings,
       (SELECT COUNT(*) FROM bookings WHERE status = 'CONFIRMED') as confirmed_bookings,
       (SELECT COUNT(*) FROM bookings WHERE status = 'PENDING') as pending_bookings,
       (SELECT COUNT(*) FROM bookings WHERE status = 'COMPLETED') as completed_bookings,
       (SELECT COUNT(*) FROM bookings WHERE status = 'CANCELLED') as cancelled_bookings,
       (SELECT COUNT(*) FROM booking_guests) as total_guests,
       (SELECT COUNT(*) FROM booking_logs) as total_logs;
