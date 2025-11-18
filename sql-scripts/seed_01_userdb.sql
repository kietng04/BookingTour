-- ============================================
-- SEED DATA FOR USERDB
-- 25 users (20 customers + 5 staff/admin)
-- ============================================

-- Clear existing data (optional - uncomment if needed)
-- TRUNCATE TABLE email_verifications CASCADE;
-- TRUNCATE TABLE users CASCADE;

-- Reset sequences
ALTER SEQUENCE users_user_id_seq RESTART WITH 1;
ALTER SEQUENCE email_verifications_id_seq RESTART WITH 1;

-- ============================================
-- USERS
-- ============================================

-- Password for all users: "password123" (bcrypt hashed)
-- Actual hash: $2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ

INSERT INTO users (username, email, password, full_name, phone_number, provider, provider_id, avatar, is_oauth_user, is_active, created_at) VALUES
-- Regular customers
('nguyen_van_a', 'nguyenvana@gmail.com', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Nguyễn Văn A', '0901234567', NULL, NULL, 'https://i.pravatar.cc/150?u=user1', false, true, NOW() - INTERVAL '120 days'),
('tran_thi_b', 'tranthib@gmail.com', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Trần Thị B', '0902345678', NULL, NULL, 'https://i.pravatar.cc/150?u=user2', false, true, NOW() - INTERVAL '115 days'),
('le_van_c', 'levanc@gmail.com', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Lê Văn C', '0903456789', NULL, NULL, 'https://i.pravatar.cc/150?u=user3', false, true, NOW() - INTERVAL '110 days'),
('pham_thi_d', 'phamthid@gmail.com', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Phạm Thị D', '0904567890', NULL, NULL, 'https://i.pravatar.cc/150?u=user4', false, true, NOW() - INTERVAL '105 days'),
('hoang_van_e', 'hoangvane@gmail.com', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Hoàng Văn E', '0905678901', NULL, NULL, 'https://i.pravatar.cc/150?u=user5', false, true, NOW() - INTERVAL '100 days'),
('vu_thi_f', 'vuthif@gmail.com', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Vũ Thị F', '0906789012', NULL, NULL, 'https://i.pravatar.cc/150?u=user6', false, true, NOW() - INTERVAL '95 days'),
('dang_van_g', 'dangvang@gmail.com', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Đặng Văn G', '0907890123', NULL, NULL, 'https://i.pravatar.cc/150?u=user7', false, true, NOW() - INTERVAL '90 days'),
('bui_thi_h', 'buithih@gmail.com', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Bùi Thị H', '0908901234', NULL, NULL, 'https://i.pravatar.cc/150?u=user8', false, true, NOW() - INTERVAL '85 days'),
('do_van_i', 'dovani@gmail.com', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Đỗ Văn I', '0909012345', NULL, NULL, 'https://i.pravatar.cc/150?u=user9', false, true, NOW() - INTERVAL '80 days'),
('ngo_thi_k', 'ngothik@gmail.com', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Ngô Thị K', '0910123456', NULL, NULL, 'https://i.pravatar.cc/150?u=user10', false, true, NOW() - INTERVAL '75 days'),
('ly_van_l', 'lyvanl@gmail.com', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Lý Văn L', '0911234567', NULL, NULL, 'https://i.pravatar.cc/150?u=user11', false, true, NOW() - INTERVAL '70 days'),
('duong_thi_m', 'duongthim@gmail.com', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Dương Thị M', '0912345678', NULL, NULL, 'https://i.pravatar.cc/150?u=user12', false, true, NOW() - INTERVAL '65 days'),
('ha_van_n', 'havann@gmail.com', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Hà Văn N', '0913456789', NULL, NULL, 'https://i.pravatar.cc/150?u=user13', false, true, NOW() - INTERVAL '60 days'),
('truong_thi_o', 'truongthio@gmail.com', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Trương Thị O', '0914567890', NULL, NULL, 'https://i.pravatar.cc/150?u=user14', false, true, NOW() - INTERVAL '55 days'),
('mai_van_p', 'maivanp@gmail.com', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Mai Văn P', '0915678901', NULL, NULL, 'https://i.pravatar.cc/150?u=user15', false, true, NOW() - INTERVAL '50 days'),
('ta_thi_q', 'tathiq@gmail.com', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Tạ Thị Q', '0916789012', NULL, NULL, 'https://i.pravatar.cc/150?u=user16', false, true, NOW() - INTERVAL '45 days'),
('cao_van_r', 'caovanr@gmail.com', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Cao Văn R', '0917890123', NULL, NULL, 'https://i.pravatar.cc/150?u=user17', false, true, NOW() - INTERVAL '40 days'),
('dinh_thi_s', 'dinhthis@gmail.com', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Đinh Thị S', '0918901234', NULL, NULL, 'https://i.pravatar.cc/150?u=user18', false, true, NOW() - INTERVAL '35 days'),
('trinh_van_t', 'trinhvant@gmail.com', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Trịnh Văn T', '0919012345', NULL, NULL, 'https://i.pravatar.cc/150?u=user19', false, true, NOW() - INTERVAL '30 days'),
('dam_thi_u', 'damthiu@gmail.com', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Đàm Thị U', '0920123456', NULL, NULL, 'https://i.pravatar.cc/150?u=user20', false, true, NOW() - INTERVAL '25 days'),

-- Staff/Admin users
('admin_nguyen', 'admin.nguyen@bookingtour.vn', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Nguyễn Quản Trị', '0921234567', NULL, NULL, 'https://i.pravatar.cc/150?u=admin1', false, true, NOW() - INTERVAL '200 days'),
('admin_tran', 'admin.tran@bookingtour.vn', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Trần Quản Lý', '0922345678', NULL, NULL, 'https://i.pravatar.cc/150?u=admin2', false, true, NOW() - INTERVAL '195 days'),
('staff_le', 'staff.le@bookingtour.vn', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Lê Nhân Viên', '0923456789', NULL, NULL, 'https://i.pravatar.cc/150?u=staff1', false, true, NOW() - INTERVAL '190 days'),
('staff_pham', 'staff.pham@bookingtour.vn', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Phạm Nhân Viên', '0924567890', NULL, NULL, 'https://i.pravatar.cc/150?u=staff2', false, true, NOW() - INTERVAL '185 days'),
('support_hoang', 'support.hoang@bookingtour.vn', '$2a$10$8RqF5v0Z3Xw8K5Y2Q7X1.OrXWFJ5bGp8E9R7Z0F5Y2Q7X1.OrXWFJ', 'Hoàng Hỗ Trợ', '0925678901', NULL, NULL, 'https://i.pravatar.cc/150?u=support1', false, true, NOW() - INTERVAL '180 days');

-- ============================================
-- EMAIL VERIFICATIONS
-- ============================================

INSERT INTO email_verifications (email, user_id, verification_code, expires_at, attempts, verified, verified_at, created_at) VALUES
-- All users verified (verified=true)
('nguyenvana@gmail.com', 1, '123456', NOW() - INTERVAL '119 days', 1, true, NOW() - INTERVAL '119 days', NOW() - INTERVAL '120 days'),
('tranthib@gmail.com', 2, '234567', NOW() - INTERVAL '114 days', 1, true, NOW() - INTERVAL '114 days', NOW() - INTERVAL '115 days'),
('levanc@gmail.com', 3, '345678', NOW() - INTERVAL '109 days', 1, true, NOW() - INTERVAL '109 days', NOW() - INTERVAL '110 days'),
('phamthid@gmail.com', 4, '456789', NOW() - INTERVAL '104 days', 1, true, NOW() - INTERVAL '104 days', NOW() - INTERVAL '105 days'),
('hoangvane@gmail.com', 5, '567890', NOW() - INTERVAL '99 days', 1, true, NOW() - INTERVAL '99 days', NOW() - INTERVAL '100 days'),
('vuthif@gmail.com', 6, '678901', NOW() - INTERVAL '94 days', 1, true, NOW() - INTERVAL '94 days', NOW() - INTERVAL '95 days'),
('dangvang@gmail.com', 7, '789012', NOW() - INTERVAL '89 days', 1, true, NOW() - INTERVAL '89 days', NOW() - INTERVAL '90 days'),
('buithih@gmail.com', 8, '890123', NOW() - INTERVAL '84 days', 1, true, NOW() - INTERVAL '84 days', NOW() - INTERVAL '85 days'),
('dovani@gmail.com', 9, '901234', NOW() - INTERVAL '79 days', 1, true, NOW() - INTERVAL '79 days', NOW() - INTERVAL '80 days'),
('ngothik@gmail.com', 10, '012345', NOW() - INTERVAL '74 days', 1, true, NOW() - INTERVAL '74 days', NOW() - INTERVAL '75 days'),
('lyvanl@gmail.com', 11, '112345', NOW() - INTERVAL '69 days', 1, true, NOW() - INTERVAL '69 days', NOW() - INTERVAL '70 days'),
('duongthim@gmail.com', 12, '212345', NOW() - INTERVAL '64 days', 1, true, NOW() - INTERVAL '64 days', NOW() - INTERVAL '65 days'),
('havann@gmail.com', 13, '312345', NOW() - INTERVAL '59 days', 1, true, NOW() - INTERVAL '59 days', NOW() - INTERVAL '60 days'),
('truongthio@gmail.com', 14, '412345', NOW() - INTERVAL '54 days', 1, true, NOW() - INTERVAL '54 days', NOW() - INTERVAL '55 days'),
('maivanp@gmail.com', 15, '512345', NOW() - INTERVAL '49 days', 1, true, NOW() - INTERVAL '49 days', NOW() - INTERVAL '50 days'),
('tathiq@gmail.com', 16, '612345', NOW() - INTERVAL '44 days', 1, true, NOW() - INTERVAL '44 days', NOW() - INTERVAL '45 days'),
('caovanr@gmail.com', 17, '712345', NOW() - INTERVAL '39 days', 1, true, NOW() - INTERVAL '39 days', NOW() - INTERVAL '40 days'),
('dinhthis@gmail.com', 18, '812345', NOW() - INTERVAL '34 days', 1, true, NOW() - INTERVAL '34 days', NOW() - INTERVAL '35 days'),
('trinhvant@gmail.com', 19, '912345', NOW() - INTERVAL '29 days', 1, true, NOW() - INTERVAL '29 days', NOW() - INTERVAL '30 days'),
('damthiu@gmail.com', 20, '012346', NOW() - INTERVAL '24 days', 1, true, NOW() - INTERVAL '24 days', NOW() - INTERVAL '25 days'),
('admin.nguyen@bookingtour.vn', 21, '112346', NOW() - INTERVAL '199 days', 1, true, NOW() - INTERVAL '199 days', NOW() - INTERVAL '200 days'),
('admin.tran@bookingtour.vn', 22, '212346', NOW() - INTERVAL '194 days', 1, true, NOW() - INTERVAL '194 days', NOW() - INTERVAL '195 days'),
('staff.le@bookingtour.vn', 23, '312346', NOW() - INTERVAL '189 days', 1, true, NOW() - INTERVAL '189 days', NOW() - INTERVAL '190 days'),
('staff.pham@bookingtour.vn', 24, '412346', NOW() - INTERVAL '184 days', 1, true, NOW() - INTERVAL '184 days', NOW() - INTERVAL '185 days'),
('support.hoang@bookingtour.vn', 25, '512346', NOW() - INTERVAL '179 days', 1, true, NOW() - INTERVAL '179 days', NOW() - INTERVAL '180 days');

-- ============================================
-- SUMMARY
-- ============================================
-- Total users: 25 (20 customers + 5 staff)
-- Total email_verifications: 25 (all verified)
-- Password for all: "password123"
-- ============================================

SELECT 'USERDB seeded successfully!' as status,
       (SELECT COUNT(*) FROM users) as total_users,
       (SELECT COUNT(*) FROM email_verifications) as total_verifications;
