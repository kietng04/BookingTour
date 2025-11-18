-- ============================================
-- SEED DATA FOR PAYMENTDB
-- Payments, Payment Logs, Refunds
-- ============================================

-- Clear existing data (optional - uncomment if needed)
-- TRUNCATE TABLE refunds CASCADE;
-- TRUNCATE TABLE payment_logs CASCADE;
-- TRUNCATE TABLE payment_methods CASCADE;
-- TRUNCATE TABLE payments CASCADE;

-- Reset sequences
ALTER SEQUENCE payments_payment_id_seq RESTART WITH 1;
ALTER SEQUENCE payment_methods_method_id_seq RESTART WITH 1;
ALTER SEQUENCE payment_logs_log_id_seq RESTART WITH 1;
ALTER SEQUENCE refunds_refund_id_seq RESTART WITH 1;

-- ============================================
-- PAYMENTS
-- 80 payments matching 80 bookings
-- Status mapping: CONFIRMED/COMPLETED bookings -> COMPLETED payments
--                 PENDING bookings -> PENDING payments
--                 CANCELLED bookings -> REFUNDED/FAILED payments
-- ============================================

-- Payments for CONFIRMED bookings (booking_id 1-30) -> COMPLETED payments
INSERT INTO payments (booking_id, amount, status, payment_method, transaction_id, transaction_date, momo_order_id, momo_request_id, momo_trans_id, momo_payment_method, momo_response_data, notes, created_at, updated_at) VALUES
(1, 13000000, 'COMPLETED', 'BANK_TRANSFER', 'TXN20250101001', NOW() - INTERVAL '14 days', NULL, NULL, NULL, NULL, NULL, 'Chuyển khoản ngân hàng', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days'),
(2, 26700000, 'COMPLETED', 'MOMO', 'TXN20250101002', NOW() - INTERVAL '19 days', 'MOMO20250101002', 'REQ20250101002', 123456789, 'credit', '{"resultCode": 0, "message": "Success"}', 'Thanh toán MoMo', NOW() - INTERVAL '20 days', NOW() - INTERVAL '19 days'),
(3, 9000000, 'COMPLETED', 'CREDIT_CARD', 'TXN20250101003', NOW() - INTERVAL '11 days', NULL, NULL, NULL, NULL, NULL, 'Thanh toán thẻ tín dụng', NOW() - INTERVAL '12 days', NOW() - INTERVAL '11 days'),
(4, 28800000, 'COMPLETED', 'MOMO', 'TXN20250101004', NOW() - INTERVAL '17 days', 'MOMO20250101004', 'REQ20250101004', 123456790, 'wallet', '{"resultCode": 0, "message": "Success"}', 'MoMo eWallet', NOW() - INTERVAL '18 days', NOW() - INTERVAL '17 days'),
(5, 11600000, 'COMPLETED', 'BANK_TRANSFER', 'TXN20250101005', NOW() - INTERVAL '9 days', NULL, NULL, NULL, NULL, NULL, 'Chuyển khoản', NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days'),
(6, 6400000, 'COMPLETED', 'MOMO', 'TXN20250101006', NOW() - INTERVAL '7 days', 'MOMO20250101006', 'REQ20250101006', 123456791, 'credit', '{"resultCode": 0, "message": "Success"}', 'MoMo', NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days'),
(7, 14400000, 'COMPLETED', 'DEBIT_CARD', 'TXN20250101007', NOW() - INTERVAL '15 days', NULL, NULL, NULL, NULL, NULL, 'Thẻ ghi nợ', NOW() - INTERVAL '16 days', NOW() - INTERVAL '15 days'),
(8, 12400000, 'COMPLETED', 'MOMO', 'TXN20250101008', NOW() - INTERVAL '13 days', 'MOMO20250101008', 'REQ20250101008', 123456792, 'wallet', '{"resultCode": 0, "message": "Success"}', 'MoMo', NOW() - INTERVAL '14 days', NOW() - INTERVAL '13 days'),
(9, 2800000, 'COMPLETED', 'BANK_TRANSFER', 'TXN20250101009', NOW() - INTERVAL '5 days', NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'),
(10, 5000000, 'COMPLETED', 'MOMO', 'TXN20250101010', NOW() - INTERVAL '3 days', 'MOMO20250101010', 'REQ20250101010', 123456793, 'credit', '{"resultCode": 0, "message": "Success"}', 'MoMo', NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days'),
(11, 12600000, 'COMPLETED', 'CREDIT_CARD', 'TXN20250101011', NOW() - INTERVAL '21 days', NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '22 days', NOW() - INTERVAL '21 days'),
(12, 10400000, 'COMPLETED', 'MOMO', 'TXN20250101012', NOW() - INTERVAL '10 days', 'MOMO20250101012', 'REQ20250101012', 123456794, 'wallet', '{"resultCode": 0, "message": "Success"}', 'MoMo', NOW() - INTERVAL '11 days', NOW() - INTERVAL '10 days'),
(13, 11000000, 'COMPLETED', 'BANK_TRANSFER', 'TXN20250101013', NOW() - INTERVAL '8 days', NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '9 days', NOW() - INTERVAL '8 days'),
(14, 14400000, 'COMPLETED', 'MOMO', 'TXN20250101014', NOW() - INTERVAL '12 days', 'MOMO20250101014', 'REQ20250101014', 123456795, 'credit', '{"resultCode": 0, "message": "Success"}', 'MoMo', NOW() - INTERVAL '13 days', NOW() - INTERVAL '12 days'),
(15, 13600000, 'COMPLETED', 'DEBIT_CARD', 'TXN20250101015', NOW() - INTERVAL '6 days', NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days'),
(16, 9000000, 'COMPLETED', 'MOMO', 'TXN20250101016', NOW() - INTERVAL '4 days', 'MOMO20250101016', 'REQ20250101016', 123456796, 'wallet', '{"resultCode": 0, "message": "Success"}', 'MoMo', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days'),
(17, 3800000, 'COMPLETED', 'BANK_TRANSFER', 'TXN20250101017', NOW() - INTERVAL '2 days', NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
(18, 17800000, 'COMPLETED', 'MOMO', 'TXN20250101018', NOW() - INTERVAL '24 days', 'MOMO20250101018', 'REQ20250101018', 123456797, 'credit', '{"resultCode": 0, "message": "Success"}', 'MoMo', NOW() - INTERVAL '25 days', NOW() - INTERVAL '24 days'),
(19, 13500000, 'COMPLETED', 'CREDIT_CARD', 'TXN20250101019', NOW() - INTERVAL '16 days', NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '17 days', NOW() - INTERVAL '16 days'),
(20, 11600000, 'COMPLETED', 'MOMO', 'TXN20250101020', NOW() - INTERVAL '18 days', 'MOMO20250101020', 'REQ20250101020', 123456798, 'wallet', '{"resultCode": 0, "message": "Success"}', 'MoMo', NOW() - INTERVAL '19 days', NOW() - INTERVAL '18 days'),
(21, 9600000, 'COMPLETED', 'BANK_TRANSFER', 'TXN20250101021', NOW() - INTERVAL '20 days', NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '21 days', NOW() - INTERVAL '20 days'),
(22, 18600000, 'COMPLETED', 'MOMO', 'TXN20250101022', NOW() - INTERVAL '22 days', 'MOMO20250101022', 'REQ20250101022', 123456799, 'credit', '{"resultCode": 0, "message": "Success"}', 'MoMo', NOW() - INTERVAL '23 days', NOW() - INTERVAL '22 days'),
(23, 5000000, 'COMPLETED', 'DEBIT_CARD', 'TXN20250101023', NOW() - INTERVAL '14 days', NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days'),
(24, 8400000, 'COMPLETED', 'MOMO', 'TXN20250101024', NOW() - INTERVAL '23 days', 'MOMO20250101024', 'REQ20250101024', 123456800, 'wallet', '{"resultCode": 0, "message": "Success"}', 'MoMo', NOW() - INTERVAL '24 days', NOW() - INTERVAL '23 days'),
(25, 11000000, 'COMPLETED', 'BANK_TRANSFER', 'TXN20250101025', NOW() - INTERVAL '25 days', NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '26 days', NOW() - INTERVAL '25 days'),
(26, 6800000, 'COMPLETED', 'MOMO', 'TXN20250101026', NOW() - INTERVAL '26 days', 'MOMO20250101026', 'REQ20250101026', 123456801, 'credit', '{"resultCode": 0, "message": "Success"}', 'MoMo', NOW() - INTERVAL '27 days', NOW() - INTERVAL '26 days'),
(27, 13500000, 'COMPLETED', 'CREDIT_CARD', 'TXN20250101027', NOW() - INTERVAL '27 days', NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '28 days', NOW() - INTERVAL '27 days'),
(28, 13000000, 'COMPLETED', 'MOMO', 'TXN20250101028', NOW() - INTERVAL '28 days', 'MOMO20250101028', 'REQ20250101028', 123456802, 'wallet', '{"resultCode": 0, "message": "Success"}', 'MoMo', NOW() - INTERVAL '29 days', NOW() - INTERVAL '28 days'),
(29, 21600000, 'COMPLETED', 'BANK_TRANSFER', 'TXN20250101029', NOW() - INTERVAL '29 days', NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '30 days', NOW() - INTERVAL '29 days'),
(30, 6400000, 'COMPLETED', 'MOMO', 'TXN20250101030', NOW() - INTERVAL '30 days', 'MOMO20250101030', 'REQ20250101030', 123456803, 'credit', '{"resultCode": 0, "message": "Success"}', 'MoMo', NOW() - INTERVAL '31 days', NOW() - INTERVAL '30 days');

-- Payments for PENDING bookings (booking_id 31-55) -> PENDING payments
INSERT INTO payments (booking_id, amount, status, payment_method, transaction_id, transaction_date, momo_order_id, momo_request_id, momo_trans_id, momo_payment_method, momo_response_data, notes, created_at, updated_at) VALUES
(31, 13000000, 'PENDING', 'MOMO', 'PENDING_TXN001', NULL, 'PENDING_MOMO001', 'PENDING_REQ001', NULL, NULL, NULL, 'Chờ khách thanh toán', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(32, 17800000, 'PENDING', 'BANK_TRANSFER', 'PENDING_TXN002', NULL, NULL, NULL, NULL, NULL, NULL, 'Chờ xác nhận chuyển khoản', NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),
(33, 13500000, 'PENDING', 'MOMO', 'PENDING_TXN003', NULL, 'PENDING_MOMO003', 'PENDING_REQ003', NULL, NULL, NULL, 'Đang xử lý', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
(34, 14400000, 'PENDING', 'CREDIT_CARD', 'PENDING_TXN004', NULL, NULL, NULL, NULL, NULL, NULL, 'Chờ thanh toán thẻ', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours'),
(35, 17400000, 'PENDING', 'MOMO', 'PENDING_TXN005', NULL, 'PENDING_MOMO005', 'PENDING_REQ005', NULL, NULL, NULL, 'Pending', NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),
(36, 6400000, 'PENDING', 'BANK_TRANSFER', 'PENDING_TXN006', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(37, 9600000, 'PENDING', 'MOMO', 'PENDING_TXN007', NULL, 'PENDING_MOMO007', 'PENDING_REQ007', NULL, NULL, NULL, NULL, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours'),
(38, 12400000, 'PENDING', 'DEBIT_CARD', 'PENDING_TXN008', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours'),
(39, 2800000, 'PENDING', 'MOMO', 'PENDING_TXN009', NULL, 'PENDING_MOMO009', 'PENDING_REQ009', NULL, NULL, NULL, NULL, NOW() - INTERVAL '8 hours', NOW() - INTERVAL '8 hours'),
(40, 5000000, 'PENDING', 'BANK_TRANSFER', 'PENDING_TXN010', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),
(41, 8400000, 'PENDING', 'MOMO', 'PENDING_TXN011', NULL, 'PENDING_MOMO011', 'PENDING_REQ011', NULL, NULL, NULL, NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(42, 15600000, 'PENDING', 'CREDIT_CARD', 'PENDING_TXN012', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '10 hours', NOW() - INTERVAL '10 hours'),
(43, 11000000, 'PENDING', 'MOMO', 'PENDING_TXN013', NULL, 'PENDING_MOMO013', 'PENDING_REQ013', NULL, NULL, NULL, NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(44, 9600000, 'PENDING', 'BANK_TRANSFER', 'PENDING_TXN014', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours'),
(45, 13600000, 'PENDING', 'MOMO', 'PENDING_TXN015', NULL, 'PENDING_MOMO015', 'PENDING_REQ015', NULL, NULL, NULL, NULL, NOW() - INTERVAL '14 hours', NOW() - INTERVAL '14 hours'),
(46, 9000000, 'PENDING', 'DEBIT_CARD', 'PENDING_TXN016', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
(47, 7600000, 'PENDING', 'MOMO', 'PENDING_TXN017', NULL, 'PENDING_MOMO017', 'PENDING_REQ017', NULL, NULL, NULL, NULL, NOW() - INTERVAL '16 hours', NOW() - INTERVAL '16 hours'),
(48, 19500000, 'PENDING', 'BANK_TRANSFER', 'PENDING_TXN018', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
(49, 17800000, 'PENDING', 'MOMO', 'PENDING_TXN019', NULL, 'PENDING_MOMO019', 'PENDING_REQ019', NULL, NULL, NULL, NULL, NOW() - INTERVAL '18 hours', NOW() - INTERVAL '18 hours'),
(50, 9000000, 'PENDING', 'CREDIT_CARD', 'PENDING_TXN020', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '20 hours', NOW() - INTERVAL '20 hours'),
(51, 11600000, 'PENDING', 'MOMO', 'PENDING_TXN021', NULL, 'PENDING_MOMO021', 'PENDING_REQ021', NULL, NULL, NULL, NULL, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
(52, 14400000, 'PENDING', 'BANK_TRANSFER', 'PENDING_TXN022', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '22 hours', NOW() - INTERVAL '22 hours'),
(53, 2800000, 'PENDING', 'MOMO', 'PENDING_TXN023', NULL, 'PENDING_MOMO023', 'PENDING_REQ023', NULL, NULL, NULL, NULL, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
(54, 10400000, 'PENDING', 'DEBIT_CARD', 'PENDING_TXN024', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days'),
(55, 9600000, 'PENDING', 'MOMO', 'PENDING_TXN025', NULL, 'PENDING_MOMO025', 'PENDING_REQ025', NULL, NULL, NULL, NULL, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours');

-- Payments for COMPLETED bookings (booking_id 56-70) -> COMPLETED payments
INSERT INTO payments (booking_id, amount, status, payment_method, transaction_id, transaction_date, momo_order_id, momo_request_id, momo_trans_id, momo_payment_method, momo_response_data, notes, created_at, updated_at) VALUES
(56, 13000000, 'COMPLETED', 'MOMO', 'TXN_COMPLETED001', NOW() - INTERVAL '89 days', 'MOMO_COMPLETED001', 'REQ_COMPLETED001', 123456850, 'credit', '{"resultCode": 0, "message": "Success"}', 'Completed tour', NOW() - INTERVAL '90 days', NOW() - INTERVAL '60 days'),
(57, 17800000, 'COMPLETED', 'BANK_TRANSFER', 'TXN_COMPLETED002', NOW() - INTERVAL '84 days', NULL, NULL, NULL, NULL, NULL, 'Completed tour', NOW() - INTERVAL '85 days', NOW() - INTERVAL '55 days'),
(58, 13500000, 'COMPLETED', 'MOMO', 'TXN_COMPLETED003', NOW() - INTERVAL '79 days', 'MOMO_COMPLETED003', 'REQ_COMPLETED003', 123456851, 'wallet', '{"resultCode": 0, "message": "Success"}', 'Completed tour', NOW() - INTERVAL '80 days', NOW() - INTERVAL '50 days'),
(59, 11600000, 'COMPLETED', 'CREDIT_CARD', 'TXN_COMPLETED004', NOW() - INTERVAL '74 days', NULL, NULL, NULL, NULL, NULL, 'Completed tour', NOW() - INTERVAL '75 days', NOW() - INTERVAL '45 days'),
(60, 6400000, 'COMPLETED', 'MOMO', 'TXN_COMPLETED005', NOW() - INTERVAL '69 days', 'MOMO_COMPLETED005', 'REQ_COMPLETED005', 123456852, 'credit', '{"resultCode": 0, "message": "Success"}', 'Completed tour', NOW() - INTERVAL '70 days', NOW() - INTERVAL '40 days'),
(61, 14400000, 'COMPLETED', 'BANK_TRANSFER', 'TXN_COMPLETED006', NOW() - INTERVAL '64 days', NULL, NULL, NULL, NULL, NULL, 'Completed tour', NOW() - INTERVAL '65 days', NOW() - INTERVAL '35 days'),
(62, 2800000, 'COMPLETED', 'MOMO', 'TXN_COMPLETED007', NOW() - INTERVAL '59 days', 'MOMO_COMPLETED007', 'REQ_COMPLETED007', 123456853, 'wallet', '{"resultCode": 0, "message": "Success"}', 'Completed tour', NOW() - INTERVAL '60 days', NOW() - INTERVAL '30 days'),
(63, 5000000, 'COMPLETED', 'DEBIT_CARD', 'TXN_COMPLETED008', NOW() - INTERVAL '54 days', NULL, NULL, NULL, NULL, NULL, 'Completed tour', NOW() - INTERVAL '55 days', NOW() - INTERVAL '25 days'),
(64, 8400000, 'COMPLETED', 'MOMO', 'TXN_COMPLETED009', NOW() - INTERVAL '49 days', 'MOMO_COMPLETED009', 'REQ_COMPLETED009', 123456854, 'credit', '{"resultCode": 0, "message": "Success"}', 'Completed tour', NOW() - INTERVAL '50 days', NOW() - INTERVAL '20 days'),
(65, 11000000, 'COMPLETED', 'BANK_TRANSFER', 'TXN_COMPLETED010', NOW() - INTERVAL '44 days', NULL, NULL, NULL, NULL, NULL, 'Completed tour', NOW() - INTERVAL '45 days', NOW() - INTERVAL '15 days'),
(66, 13600000, 'COMPLETED', 'MOMO', 'TXN_COMPLETED011', NOW() - INTERVAL '39 days', 'MOMO_COMPLETED011', 'REQ_COMPLETED011', 123456855, 'wallet', '{"resultCode": 0, "message": "Success"}', 'Completed tour', NOW() - INTERVAL '40 days', NOW() - INTERVAL '10 days'),
(67, 13500000, 'COMPLETED', 'CREDIT_CARD', 'TXN_COMPLETED012', NOW() - INTERVAL '34 days', NULL, NULL, NULL, NULL, NULL, 'Completed tour', NOW() - INTERVAL '35 days', NOW() - INTERVAL '5 days'),
(68, 3800000, 'COMPLETED', 'MOMO', 'TXN_COMPLETED013', NOW() - INTERVAL '29 days', 'MOMO_COMPLETED013', 'REQ_COMPLETED013', 123456856, 'credit', '{"resultCode": 0, "message": "Success"}', 'Completed tour', NOW() - INTERVAL '30 days', NOW() - INTERVAL '5 days'),
(69, 14400000, 'COMPLETED', 'BANK_TRANSFER', 'TXN_COMPLETED014', NOW() - INTERVAL '24 days', NULL, NULL, NULL, NULL, NULL, 'Completed tour', NOW() - INTERVAL '25 days', NOW() - INTERVAL '5 days'),
(70, 12400000, 'COMPLETED', 'MOMO', 'TXN_COMPLETED015', NOW() - INTERVAL '19 days', 'MOMO_COMPLETED015', 'REQ_COMPLETED015', 123456857, 'wallet', '{"resultCode": 0, "message": "Success"}', 'Completed tour', NOW() - INTERVAL '20 days', NOW() - INTERVAL '5 days');

-- Payments for CANCELLED bookings (booking_id 71-80) -> REFUNDED/FAILED payments
INSERT INTO payments (booking_id, amount, status, payment_method, transaction_id, transaction_date, momo_order_id, momo_request_id, momo_trans_id, momo_payment_method, momo_response_data, notes, created_at, updated_at) VALUES
(71, 13000000, 'FAILED', 'BANK_TRANSFER', 'TXN_CANCELLED001', NULL, NULL, NULL, NULL, NULL, NULL, 'Booking cancelled before payment', NOW() - INTERVAL '35 days', NOW() - INTERVAL '34 days'),
(72, 26700000, 'REFUNDED', 'MOMO', 'TXN_CANCELLED002', NOW() - INTERVAL '39 days', 'MOMO_CANCEL002', 'REQ_CANCEL002', 123456860, 'credit', '{"resultCode": 0, "message": "Refunded"}', 'Refunded after cancellation', NOW() - INTERVAL '40 days', NOW() - INTERVAL '38 days'),
(73, 9000000, 'FAILED', 'CREDIT_CARD', 'TXN_CANCELLED003', NULL, NULL, NULL, NULL, NULL, NULL, 'Cancelled before payment', NOW() - INTERVAL '45 days', NOW() - INTERVAL '43 days'),
(74, 11600000, 'REFUNDED', 'MOMO', 'TXN_CANCELLED004', NOW() - INTERVAL '49 days', 'MOMO_CANCEL004', 'REQ_CANCEL004', 123456861, 'wallet', '{"resultCode": 0, "message": "Refunded"}', 'Refunded', NOW() - INTERVAL '50 days', NOW() - INTERVAL '48 days'),
(75, 14400000, 'FAILED', 'BANK_TRANSFER', 'TXN_CANCELLED005', NULL, NULL, NULL, NULL, NULL, NULL, 'Cancelled', NOW() - INTERVAL '55 days', NOW() - INTERVAL '53 days'),
(76, 2800000, 'FAILED', 'DEBIT_CARD', 'TXN_CANCELLED006', NULL, NULL, NULL, NULL, NULL, NULL, 'Cancelled', NOW() - INTERVAL '60 days', NOW() - INTERVAL '58 days'),
(77, 8400000, 'REFUNDED', 'MOMO', 'TXN_CANCELLED007', NOW() - INTERVAL '64 days', 'MOMO_CANCEL007', 'REQ_CANCEL007', 123456862, 'credit', '{"resultCode": 0, "message": "Refunded"}', 'Refunded due to COVID', NOW() - INTERVAL '65 days', NOW() - INTERVAL '63 days'),
(78, 11000000, 'FAILED', 'BANK_TRANSFER', 'TXN_CANCELLED008', NULL, NULL, NULL, NULL, NULL, NULL, 'Cancelled', NOW() - INTERVAL '70 days', NOW() - INTERVAL '68 days'),
(79, 13600000, 'REFUNDED', 'MOMO', 'TXN_CANCELLED009', NOW() - INTERVAL '74 days', 'MOMO_CANCEL009', 'REQ_CANCEL009', 123456863, 'wallet', '{"resultCode": 0, "message": "Refunded"}', 'Refunded', NOW() - INTERVAL '75 days', NOW() - INTERVAL '73 days'),
(80, 9000000, 'FAILED', 'CREDIT_CARD', 'TXN_CANCELLED010', NULL, NULL, NULL, NULL, NULL, NULL, 'Cancelled', NOW() - INTERVAL '80 days', NOW() - INTERVAL '78 days');

-- ============================================
-- PAYMENT LOGS (Track payment status changes)
-- ============================================

-- Logs for COMPLETED payments
INSERT INTO payment_logs (payment_id, action, old_status, new_status, error_message, details, created_at) VALUES
(1, 'PAYMENT_CREATED', NULL, 'PENDING', NULL, '{"method": "BANK_TRANSFER"}', NOW() - INTERVAL '15 days'),
(1, 'PAYMENT_COMPLETED', 'PENDING', 'COMPLETED', NULL, '{"transaction_id": "TXN20250101001"}', NOW() - INTERVAL '14 days'),

(2, 'PAYMENT_CREATED', NULL, 'PROCESSING', NULL, '{"method": "MOMO"}', NOW() - INTERVAL '20 days'),
(2, 'PAYMENT_COMPLETED', 'PROCESSING', 'COMPLETED', NULL, '{"momo_trans_id": 123456789}', NOW() - INTERVAL '19 days'),

(3, 'PAYMENT_CREATED', NULL, 'PENDING', NULL, '{"method": "CREDIT_CARD"}', NOW() - INTERVAL '12 days'),
(3, 'PAYMENT_COMPLETED', 'PENDING', 'COMPLETED', NULL, '{"transaction_id": "TXN20250101003"}', NOW() - INTERVAL '11 days');

-- Logs for PENDING payments
INSERT INTO payment_logs (payment_id, action, old_status, new_status, error_message, details, created_at) VALUES
(31, 'PAYMENT_CREATED', NULL, 'PENDING', NULL, '{"method": "MOMO", "awaiting": "customer_payment"}', NOW() - INTERVAL '2 days'),
(32, 'PAYMENT_CREATED', NULL, 'PENDING', NULL, '{"method": "BANK_TRANSFER", "awaiting": "bank_confirmation"}', NOW() - INTERVAL '1 days'),
(33, 'PAYMENT_CREATED', NULL, 'PENDING', NULL, '{"method": "MOMO"}', NOW() - INTERVAL '3 hours');

-- Logs for REFUNDED payments
INSERT INTO payment_logs (payment_id, action, old_status, new_status, error_message, details, created_at) VALUES
(72, 'PAYMENT_CREATED', NULL, 'PROCESSING', NULL, '{"method": "MOMO"}', NOW() - INTERVAL '40 days'),
(72, 'PAYMENT_COMPLETED', 'PROCESSING', 'COMPLETED', NULL, '{"momo_trans_id": 123456860}', NOW() - INTERVAL '39 days'),
(72, 'PAYMENT_REFUNDED', 'COMPLETED', 'REFUNDED', NULL, '{"reason": "Customer cancellation", "refund_amount": 26700000}', NOW() - INTERVAL '38 days'),

(74, 'PAYMENT_CREATED', NULL, 'PROCESSING', NULL, '{"method": "MOMO"}', NOW() - INTERVAL '50 days'),
(74, 'PAYMENT_COMPLETED', 'PROCESSING', 'COMPLETED', NULL, '{"momo_trans_id": 123456861}', NOW() - INTERVAL '49 days'),
(74, 'PAYMENT_REFUNDED', 'COMPLETED', 'REFUNDED', NULL, '{"reason": "Customer request", "refund_amount": 11600000}', NOW() - INTERVAL '48 days');

-- Logs for FAILED payments
INSERT INTO payment_logs (payment_id, action, old_status, new_status, error_message, details, created_at) VALUES
(71, 'PAYMENT_CREATED', NULL, 'PENDING', NULL, '{"method": "BANK_TRANSFER"}', NOW() - INTERVAL '35 days'),
(71, 'PAYMENT_FAILED', 'PENDING', 'FAILED', 'Booking cancelled before payment received', '{"reason": "cancelled"}', NOW() - INTERVAL '34 days'),

(73, 'PAYMENT_CREATED', NULL, 'PENDING', NULL, '{"method": "CREDIT_CARD"}', NOW() - INTERVAL '45 days'),
(73, 'PAYMENT_FAILED', 'PENDING', 'FAILED', 'Booking cancelled', '{"reason": "cancelled"}', NOW() - INTERVAL '43 days');

-- ============================================
-- REFUNDS (For REFUNDED payments)
-- ============================================

INSERT INTO refunds (payment_id, amount, reason, status, refund_date, created_at) VALUES
(72, 26700000, 'Khách hàng hủy tour, yêu cầu hoàn tiền', 'COMPLETED', NOW() - INTERVAL '37 days', NOW() - INTERVAL '38 days'),
(74, 11600000, 'Thay đổi lịch trình, hoàn tiền', 'COMPLETED', NOW() - INTERVAL '47 days', NOW() - INTERVAL '48 days'),
(77, 8400000, 'Hủy do dịch bệnh COVID-19', 'COMPLETED', NOW() - INTERVAL '62 days', NOW() - INTERVAL '63 days'),
(79, 13600000, 'Khách hàng yêu cầu hoàn tiền', 'COMPLETED', NOW() - INTERVAL '72 days', NOW() - INTERVAL '73 days');

-- Add some PENDING refunds (just requested)
INSERT INTO refunds (payment_id, amount, reason, status, refund_date, created_at) VALUES
(1, 2000000, 'Hoàn tiền một phần do dịch vụ không đạt', 'PENDING', NULL, NOW() - INTERVAL '2 days'),
(5, 1000000, 'Khuyến mãi bù trừ', 'APPROVED', NOW() - INTERVAL '1 days', NOW() - INTERVAL '3 days');

-- ============================================
-- SUMMARY
-- ============================================

SELECT 'PAYMENTDB seeded successfully!' as status,
       (SELECT COUNT(*) FROM payments) as total_payments,
       (SELECT COUNT(*) FROM payments WHERE status = 'COMPLETED') as completed_payments,
       (SELECT COUNT(*) FROM payments WHERE status = 'PENDING') as pending_payments,
       (SELECT COUNT(*) FROM payments WHERE status = 'REFUNDED') as refunded_payments,
       (SELECT COUNT(*) FROM payments WHERE status = 'FAILED') as failed_payments,
       (SELECT COUNT(*) FROM payment_logs) as total_logs,
       (SELECT COUNT(*) FROM refunds) as total_refunds;
