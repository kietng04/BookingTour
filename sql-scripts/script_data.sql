\c tourdb;

-- Xóa dữ liệu cũ (nếu có)
TRUNCATE TABLE tour_discounts, tour_logs, custom_tours, payments, bookings, departures, 
         tour_images, tour_schedules, tours, provinces, regions, user_verification, users CASCADE;

-- Reset các sequence
ALTER SEQUENCE regions_region_id_seq RESTART WITH 1;
ALTER SEQUENCE provinces_province_id_seq RESTART WITH 1;
ALTER SEQUENCE tours_tour_id_seq RESTART WITH 1;
ALTER SEQUENCE users_user_id_seq RESTART WITH 1;

-- Insert dữ liệu theo thứ tự phụ thuộc
-- 1. Regions
INSERT INTO regions (region_name) VALUES
('Miền Bắc'),
('Miền Trung'),
('Miền Nam');

-- 2. Provinces
INSERT INTO provinces (province_name, region_id) VALUES
-- Miền Bắc (region_id = 1)
('Thành phố Hà Nội', 1),
('Tỉnh Tuyên Quang', 1),
('Tỉnh Lào Cai', 1);

-- 3. Users
INSERT INTO users (username, full_name, email, phone_number, password_hash, status) VALUES
('admin', 'Quản Trị Viên', 'admin@tour.vn', '0900000000', 'hashed_admin_pw', 'ACTIVE'),
('nguyenvana', 'Nguyễn Văn A', 'vana@gmail.com', '0911111111', 'hashed_pw_a', 'ACTIVE');

-- 4. Tours
INSERT INTO tours (tour_name, region_id, province_id, description, days, nights, 
                  departure_point, main_destination, adult_price, child_price, status) 
VALUES
('Tour Hà Nội - Hạ Long 3N2Đ', 1, 1, 'Khám phá vịnh Hạ Long', 3, 2, 
 'Hà Nội', 'Hạ Long', 3500000, 2500000, 'ACTIVE');

-- 5. Tour Schedules
INSERT INTO tour_schedules (tour_id, day_number, schedule_description) 
VALUES
(1, 1, 'Ngày 1: Khởi hành từ Hà Nội'),
(1, 2, 'Ngày 2: Tham quan vịnh Hạ Long');

-- 6. Departures
INSERT INTO departures (tour_id, start_date, end_date, total_slots, remaining_slots, status) 
VALUES
(1, '2025-10-15', '2025-10-17', 30, 10, 'CONCHO');

-- 7. Bookings
INSERT INTO bookings (user_id, departure_id, total_amount, status) 
VALUES
(1, 1, 3500000, 'CONFIRMED');

-- 8. Payments
INSERT INTO payments (booking_id, amount, payment_method, status) 
VALUES
(1, 3500000, 'CREDITCARD', 'COMPLETED');

-- 9. Tour Images
INSERT INTO tour_images (tour_id, image_url, is_primary) 
VALUES
(1, 'halong_main.jpg', true);

-- 10. Tour Discounts
INSERT INTO tour_discounts (tour_id, discount_name, discount_type, discount_value, 
                          start_date, end_date) 
VALUES
(1, 'Mùa Thu 2025', 'PERCENT', 10, '2025-09-01', '2025-10-31');