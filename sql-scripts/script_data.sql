-- ===========================
-- DỮ LIỆU MẪU
-- ===========================

-- Vùng miền
INSERT INTO regions (region_name) VALUES
('Miền Bắc'),
('Miền Trung'),
('Miền Nam');

-- Tỉnh/Thành
-- Thêm 34 tỉnh/thành Việt Nam sau sáp nhập
INSERT INTO provinces (province_name, region_id) VALUES
-- 🟦 Miền Bắc (region_id = 1)
('Thành phố Hà Nội', 1),
('Tỉnh Tuyên Quang', 1),
('Tỉnh Lào Cai', 1),
('Tỉnh Thái Nguyên', 1),
('Tỉnh Phú Thọ', 1),
('Tỉnh Bắc Ninh', 1),
('Tỉnh Hưng Yên', 1),
('Thành phố Hải Phòng', 1),
('Tỉnh Ninh Bình', 1),
('Tỉnh Cao Bằng', 1),
('Tỉnh Lạng Sơn', 1),
('Tỉnh Quảng Ninh', 1),
('Tỉnh Lai Châu', 1),
('Tỉnh Điện Biên', 1),
('Tỉnh Sơn La', 1),

-- 🟧 Miền Trung (region_id = 2)
('Tỉnh Thanh Hoá', 2),
('Tỉnh Nghệ An', 2),
('Tỉnh Hà Tĩnh', 2),
('Tỉnh Quảng Trị', 2),
('Thành phố Huế', 2),
('Thành phố Đà Nẵng', 2),
('Tỉnh Quảng Ngãi', 2),
('Tỉnh Gia Lai', 2),
('Tỉnh Đắk Lắk', 2),
('Tỉnh Khánh Hoà', 2),
('Tỉnh Lâm Đồng', 2),

-- 🟩 Miền Nam (region_id = 3)
('Thành phố Hồ Chí Minh', 3),
('Tỉnh Đồng Nai', 3),
('Tỉnh Tây Ninh', 3),
('Thành phố Cần Thơ', 3),
('Tỉnh Vĩnh Long', 3),
('Tỉnh Đồng Tháp', 3),
('Tỉnh Cà Mau', 3),
('Tỉnh An Giang', 3);

-- Người dùng
INSERT INTO users (username, full_name, email, phone_number, password_hash, status) VALUES
('admin', 'Quản Trị Viên', 'admin@tour.vn', '0900000000', 'hashed_admin_pw', 'Active'),
('nguyenvana', 'Nguyễn Văn A', 'vana@gmail.com', '0911111111', 'hashed_pw_a', 'Active'),
('tranthib', 'Trần Thị B', 'thib@gmail.com', '0922222222', 'hashed_pw_b', 'Active'),
('lethic', 'Lê Thị C', 'lethic@gmail.com', '0933333333', 'hashed_pw_c', 'Unactive');

-- Mã xác minh người dùng
INSERT INTO user_verification (user_id, verification_code, expires_at) VALUES
(2, 'ABC123', '2025-12-31 23:59:59'),
(3, 'XYZ789', '2025-12-31 23:59:59');

-- Tour
INSERT INTO tours (tour_name, region_id, province_id, description, days, nights, departure_point, main_destination, adult_price, child_price, status)
VALUES
('Tour Hà Nội - Hạ Long 3N2Đ', 1, 2, 'Khám phá vịnh Hạ Long, di sản thiên nhiên thế giới.', 3, 2, 'Hà Nội', 'Hạ Long', 3500000, 2500000, 'Active'),
('Tour Huế - Đà Nẵng 4N3Đ', 2, 3, 'Tham quan Cố đô Huế và phố cổ Hội An.', 4, 3, 'Đà Nẵng', 'Huế', 4500000, 3200000, 'Active'),
('Tour Sài Gòn - Cần Thơ 2N1Đ', 3, 6, 'Khám phá miền Tây sông nước và chợ nổi Cái Răng.', 2, 1, 'TP. Hồ Chí Minh', 'Cần Thơ', 2800000, 1800000, 'Active');

-- Lịch trình tour
INSERT INTO tour_schedules (tour_id, day_number, schedule_description) VALUES
(1, 1, 'Khởi hành từ Hà Nội, tham quan Chùa Trấn Quốc.'),
(1, 2, 'Du thuyền trên Vịnh Hạ Long, ngủ đêm trên tàu.'),
(2, 1, 'Tham quan Cầu Rồng, Bán đảo Sơn Trà.'),
(2, 2, 'Di chuyển đến Huế, tham quan Đại Nội.'),
(3, 1, 'Khởi hành đi Cần Thơ, dừng chân Mỹ Tho.'),
(3, 2, 'Tham quan chợ nổi Cái Răng, trở về TP.HCM.');

-- Hình ảnh tour
INSERT INTO tour_images (tour_id, image_url, is_primary) VALUES
(1, 'halong_main.jpg', TRUE),
(1, 'halong_view.jpg', FALSE),
(2, 'hue_danang_main.jpg', TRUE),
(3, 'cantho_main.jpg', TRUE);

-- Khởi hành
INSERT INTO departures (tour_id, start_date, end_date, total_slots, remaining_slots, status) VALUES
(1, '2025-10-15', '2025-10-17', 30, 10, 'ConCho'),
(2, '2025-11-05', '2025-11-08', 25, 5, 'SapFull'),
(3, '2025-10-20', '2025-10-21', 20, 0, 'Full');

-- Đặt tour
INSERT INTO bookings (user_id, departure_id, total_amount, status) VALUES
(2, 1, 3500000, 'Confirmed'),
(3, 2, 4500000, 'Pending'),
(2, 3, 2800000, 'Cancelled');

-- Thanh toán
INSERT INTO payments (booking_id, amount, payment_method, status) VALUES
(1, 3500000, 'CreditCard', 'Completed'),
(2, 4500000, 'BankTransfer', 'Pending');

-- Tour tùy chỉnh
INSERT INTO custom_tours (user_id, destination, start_date, end_date, number_of_people, special_request, status) VALUES
(3, 'Phú Quốc', '2025-12-01', '2025-12-05', 4, 'Resort gần biển, có BBQ.', 'Pending'),
(2, 'Đà Lạt', '2025-11-10', '2025-11-14', 2, 'Khách sạn 3 sao, hoa cẩm tú cầu.', 'Pending');

-- Log thay đổi tour
INSERT INTO tour_logs (tour_id, action) VALUES
(1, 'Cập nhật giá tour'),
(2, 'Thêm lịch trình mới');

-- Giảm giá tour
INSERT INTO tour_discounts (tour_id, discount_name, discount_type, discount_value, start_date, end_date) VALUES
(1, 'Mùa Thu 2025', 'percent', 10, '2025-09-01', '2025-10-31'),
(2, 'Giảm giá đặc biệt', 'fixed', 500000, '2025-11-01', '2025-11-30');
