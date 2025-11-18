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
-- =======================
-- 🌄 MIỀN BẮC (region_id = 1)
-- =======================
INSERT INTO provinces (province_name, region_id) VALUES
('Thành phố Hà Nội', 1),
('Tỉnh Hà Giang', 1),
('Tỉnh Cao Bằng', 1),
('Tỉnh Lào Cai', 1),
('Tỉnh Bắc Kạn', 1),
('Tỉnh Lạng Sơn', 1),
('Tỉnh Tuyên Quang', 1),
('Tỉnh Thái Nguyên', 1),
('Tỉnh Phú Thọ', 1),
('Tỉnh Bắc Giang', 1),
('Tỉnh Quảng Ninh', 1),
('Tỉnh Hải Dương', 1),
('Thành phố Hải Phòng', 1),
('Tỉnh Hưng Yên', 1),
('Tỉnh Hà Nam', 1),
('Tỉnh Nam Định', 1),
('Tỉnh Ninh Bình', 1);

-- =======================
-- 🏖️ MIỀN TRUNG (region_id = 2)
-- =======================
INSERT INTO provinces (province_name, region_id) VALUES
('Thành phố Đà Nẵng', 2),
('Tỉnh Thanh Hóa', 2),
('Tỉnh Nghệ An', 2),
('Tỉnh Hà Tĩnh', 2),
('Tỉnh Quảng Bình', 2),
('Tỉnh Quảng Trị', 2),
('Tỉnh Thừa Thiên - Huế', 2),
('Tỉnh Quảng Nam', 2),
('Tỉnh Quảng Ngãi', 2),
('Tỉnh Bình Định', 2),
('Tỉnh Phú Yên', 2),
('Tỉnh Khánh Hòa', 2),
('Tỉnh Ninh Thuận', 2),
('Tỉnh Bình Thuận', 2);

-- =======================
-- 🌴 MIỀN NAM (region_id = 3)
-- =======================
INSERT INTO provinces (province_name, region_id) VALUES
('Thành phố Hồ Chí Minh', 3),
('Tỉnh Bình Dương', 3),
('Tỉnh Đồng Nai', 3),
('Tỉnh Bà Rịa - Vũng Tàu', 3),
('Tỉnh Long An', 3),
('Tỉnh Tiền Giang', 3),
('Tỉnh Bến Tre', 3),
('Tỉnh Vĩnh Long', 3),
('Tỉnh Cần Thơ', 3),
('Tỉnh An Giang', 3),
('Tỉnh Kiên Giang', 3),
('Tỉnh Cà Mau', 3),
('Tỉnh Sóc Trăng', 3),
('Tỉnh Bạc Liêu', 3),
('Tỉnh Đồng Tháp', 3);

-- 3. Users
-- Password for admin: "admin" (BCrypt hashed with strength 10)
-- Password for nguyenvana: "password" (BCrypt hashed with strength 10)
INSERT INTO users (username, full_name, email, phone_number, password_hash, status) VALUES
('admin', 'Quản Trị Viên', 'admin@gmail.com', '0900000000', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'ACTIVE'),
('nguyenvana', 'Nguyễn Văn A', 'vana@gmail.com', '0911111111', '$2a$10$3euPaDCmg1JbKyl1E/6JqeXuSMpY0f8.EI/Jmz4sXuXNzNYvuZWty', 'ACTIVE');

-- 4. Tours
INSERT INTO tours (tour_name, tour_slug, region_id, province_id, description, days, nights,
                  departure_point, main_destination, adult_price, child_price, status)
VALUES
('Hành trình Hà Nội - Hạ Long 3N2Đ', 'ha-noi-ha-long-3n2d', 1, 11,
 'Trải nghiệm du thuyền trên vịnh Hạ Long, ngủ đêm trên du thuyền 4 sao và tham quan hang động kỳ vĩ.',
 3, 2, 'Hà Nội', 'Vịnh Hạ Long', 3890000, 2790000, 'ACTIVE'),
('Đà Nẵng - Hội An biển & di sản 4N3Đ', 'da-nang-hoi-an-4n3d', 2, 18,
 'Kết hợp nghỉ dưỡng biển Mỹ Khê, khám phá Ngũ Hành Sơn và phố cổ Hội An về đêm cùng ẩm thực đặc sắc.',
 4, 3, 'Đà Nẵng', 'Hội An', 5290000, 3890000, 'ACTIVE'),
('Sài Gòn - Mỹ Tho - Cần Thơ 2N1Đ', 'sai-gon-my-tho-can-tho-2n1d', 3, 37,
 'Khám phá miền sông nước với chợ nổi Cái Răng, thưởng thức đờn ca tài tử và ẩm thực miệt vườn.',
 2, 1, 'TP. Hồ Chí Minh', 'Đồng bằng sông Cửu Long', 2590000, 1990000, 'ACTIVE'),
('Phan Thiết - Mũi Né nghỉ dưỡng 3N2Đ', 'phan-thiet-mui-ne-3n2d', 2, 31,
 'Thư giãn tại thiên đường biển Mũi Né với đồi cát bay, làng chài và thưởng thức hải sản tươi sống.',
 3, 2, 'TP. Hồ Chí Minh', 'Mũi Né - Bình Thuận', 3190000, 2390000, 'ACTIVE'),
('Hà Giang - Vòng Cung Đá Đồng Văn', 'ha-giang-vong-cung', 1, 2,
 'Hành trình 4 ngày 3 đêm đưa bạn khám phá cung đường Hạnh Phúc hùng vĩ, hòa mình vào đời sống miền đá Hà Giang cùng những trải nghiệm văn hoá bản địa khó quên.',
 4, 3, 'Hà Nội', 'Hà Giang', 8290000, 5890000, 'ACTIVE'),
('Phú Quốc - Nghỉ Dưỡng Biển Hoàng Hôn', 'phu-quoc-nghi-duong-hoang-hon', 3, 44,
 'Chuyến nghỉ dưỡng sang trọng tại Phú Quốc với resort biển cao cấp, lịch trình linh hoạt, phù hợp cặp đôi và gia đình muốn nạp lại năng lượng cùng khoảnh khắc hoàng hôn lãng mạn.',
 3, 2, 'TP. Hồ Chí Minh', 'Phú Quốc', 9450000, 6890000, 'ACTIVE'),
('Huế - Hội An - Dấu Ấn Di Sản Miền Trung', 'hue-hoi-an-di-san-miền-trung', 2, 19,
 'Khám phá hai di sản thế giới Huế - Hội An qua hành trình đậm văn hoá, ẩm thực tinh tế và những trải nghiệm nghệ thuật truyền thống hiếm có.',
 4, 3, 'Đà Nẵng', 'Huế & Hội An', 7590000, 5490000, 'ACTIVE'),
('Tây Nguyên - Sử Thi & Cà Phê Buôn Ma Thuột', 'tay-nguyen-su-thi-ca-phe', 2, 21,
 'Đắm mình trong không gian văn hoá cồng chiêng Tây Nguyên, thưởng thức cà phê nguyên bản và khám phá những câu chuyện sử thi được kể giữa núi rừng đại ngàn.',
 4, 3, 'TP. Hồ Chí Minh', 'Buôn Ma Thuột', 6890000, 4890000, 'ACTIVE');

-- 5. Tour Schedules
INSERT INTO tour_schedules (tour_id, day_number, schedule_description)
VALUES
(1, 1, 'Đón khách tại Hà Nội - di chuyển cao tốc đến Hạ Long, nhận phòng du thuyền và tham quan hang Thiên Cung.'),
(1, 2, 'Tham gia chèo kayak tại Vịnh Luồn, thưởng thức bữa tối hải sản trên du thuyền.'),
(1, 3, 'Tập Thái Cực Quyền trên boong tàu, trả phòng và trở về Hà Nội.'),
(2, 1, 'Đón khách tại sân bay Đà Nẵng, tự do tắm biển Mỹ Khê, thưởng thức hải sản tươi sống.'),
(2, 2, 'Khám phá Bà Nà Hills, chụp ảnh Cầu Vàng và tham quan làng Pháp.'),
(2, 3, 'Tham quan phố cổ Hội An, trải nghiệm thả hoa đăng trên sông Hoài, thưởng thức cao lầu.'),
(2, 4, 'Mua sắm đặc sản và tiễn khách ra sân bay Đà Nẵng.'),
(3, 1, 'Tham quan chùa Vĩnh Tràng, đi đò qua sông Tiền, thưởng thức trái cây miệt vườn và xem đờn ca tài tử.'),
(3, 2, 'Dậy sớm tham quan chợ nổi Cái Răng, trải nghiệm làm bánh tráng và trở về TP. Hồ Chí Minh.'),
(4, 1, 'Khởi hành từ TP. Hồ Chí Minh, ghé thăm làng chài Mũi Né và check-in đồi cát bay Bàu Trắng.'),
(4, 2, 'Tham quan Làng chài xưa, tắm biển và thưởng thức tiệc BBQ hải sản trên bờ biển.'),
(4, 3, 'Tự do thư giãn tại resort, mua sắm đặc sản Phan Thiết và trở về TP. Hồ Chí Minh.');

-- 6. Tour Images
INSERT INTO tour_images (tour_id, image_url, is_primary)
VALUES
(1, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80', true),
(1, 'https://images.unsplash.com/photo-1431274172761-fca41d930114?auto=format&fit=crop&w=1200&q=80', false),
(1, 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=80', false),
(2, 'https://images.unsplash.com/photo-1494475673543-6a6a27143b22?auto=format&fit=crop&w=1600&q=80', true),
(2, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80', false),
(2, 'https://images.unsplash.com/photo-1526481280695-3c4693f3f1c8?auto=format&fit=crop&w=1600&q=80', false),
(3, 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80', true),
(3, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80', false),
(3, 'https://images.unsplash.com/photo-1494476984818-fb456621018e?auto=format&fit=crop&w=1600&q=80', false),
(4, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80', true),
(4, 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80', false),
(4, 'https://images.unsplash.com/photo-1526481280695-3c4693f3f1c8?auto=format&fit=crop&w=1600&q=80', false),
(5, 'https://images.unsplash.com/photo-1517821365732-61113c912358?auto=format&fit=crop&w=1200&q=80', true),
(5, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', false),
(5, 'https://images.unsplash.com/photo-1494475673543-6a6a27143fc8?auto=format&fit=crop&w=1200&q=80', false),
(6, 'https://images.unsplash.com/photo-1507225557646-ed80e1f84d14?auto=format&fit=crop&w=1200&q=80', true),
(6, 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=1200&q=80', false),
(6, 'https://images.unsplash.com/photo-1495162566022-ce0c9c6c6b33?auto=format&fit=crop&w=1200&q=80', false),
(7, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80', true),
(7, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df5?auto=format&fit=crop&w=1200&q=80', false),
(7, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df6?auto=format&fit=crop&w=1200&q=80', false),
(8, 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80', true),
(8, 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8801?auto=format&fit=crop&w=1200&q=80', false),
(8, 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8802?auto=format&fit=crop&w=1200&q=80', false);

-- 7. Departures
INSERT INTO departures (tour_id, start_date, end_date, total_slots, remaining_slots, status)
VALUES
(1, CURRENT_DATE + INTERVAL '7 day', CURRENT_DATE + INTERVAL '9 day', 28, 18, 'CONCHO'),
(1, CURRENT_DATE + INTERVAL '21 day', CURRENT_DATE + INTERVAL '23 day', 32, 32, 'CONCHO'),
(2, CURRENT_DATE + INTERVAL '10 day', CURRENT_DATE + INTERVAL '13 day', 24, 12, 'SAPFULL'),
(2, CURRENT_DATE + INTERVAL '35 day', CURRENT_DATE + INTERVAL '38 day', 26, 26, 'CONCHO'),
(3, CURRENT_DATE + INTERVAL '5 day', CURRENT_DATE + INTERVAL '6 day', 20, 6, 'SAPFULL'),
(3, CURRENT_DATE + INTERVAL '18 day', CURRENT_DATE + INTERVAL '19 day', 18, 18, 'CONCHO'),
(4, CURRENT_DATE + INTERVAL '12 day', CURRENT_DATE + INTERVAL '15 day', 30, 24, 'CONCHO'),
(4, CURRENT_DATE + INTERVAL '28 day', CURRENT_DATE + INTERVAL '31 day', 28, 28, 'CONCHO'),
(5, CURRENT_DATE + INTERVAL '8 day', CURRENT_DATE + INTERVAL '11 day', 25, 20, 'CONCHO'),
(5, CURRENT_DATE + INTERVAL '22 day', CURRENT_DATE + INTERVAL '25 day', 25, 25, 'CONCHO'),
(6, CURRENT_DATE + INTERVAL '5 day', CURRENT_DATE + INTERVAL '7 day', 20, 15, 'CONCHO'),
(6, CURRENT_DATE + INTERVAL '20 day', CURRENT_DATE + INTERVAL '22 day', 20, 20, 'CONCHO'),
(7, CURRENT_DATE + INTERVAL '10 day', CURRENT_DATE + INTERVAL '13 day', 24, 20, 'CONCHO'),
(7, CURRENT_DATE + INTERVAL '24 day', CURRENT_DATE + INTERVAL '27 day', 24, 24, 'CONCHO'),
(8, CURRENT_DATE + INTERVAL '7 day', CURRENT_DATE + INTERVAL '10 day', 22, 18, 'CONCHO'),
(8, CURRENT_DATE + INTERVAL '21 day', CURRENT_DATE + INTERVAL '24 day', 22, 22, 'CONCHO');

-- 8. Bookings mẫu
INSERT INTO bookings (user_id, tour_id, departure_id, total_amount, payment_override, status)
VALUES
(1, 1, 1, 3890000, NULL, 'CONFIRMED'),
(2, 2, 3, 5290000, NULL, 'PENDING');

-- 9. Payments
INSERT INTO payments (booking_id, amount, payment_method, status)
VALUES
(1, 3890000, 'CREDITCARD', 'COMPLETED'),
(2, 5290000, 'CASH', 'PENDING');

-- 10. Tour Discounts
INSERT INTO tour_discounts (tour_id, discount_name, discount_type, discount_value,
                          start_date, end_date)
VALUES
(1, 'Ưu đãi Thu vàng', 'PERCENT', 10, CURRENT_DATE - INTERVAL '15 day', CURRENT_DATE + INTERVAL '45 day'),
(2, 'Combo nhóm 4 khách', 'FIXED', 800000, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 day'),
(3, 'Khởi hành cuối tuần', 'PERCENT', 5, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 day'),
(4, 'Trọn gói gia đình', 'FIXED', 600000, CURRENT_DATE + INTERVAL '5 day', CURRENT_DATE + INTERVAL '45 day');
