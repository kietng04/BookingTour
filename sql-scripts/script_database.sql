-- Tạo database
CREATE DATABASE tour_management;
USE tour_management;

-- Bảng người dùng
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Active', 'Unactive') DEFAULT 'Active'
);

-- Bảng xác minh người dùng
CREATE TABLE user_verification (
    verification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    verification_code VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Bảng khu vực (Miền)
CREATE TABLE regions (
    region_id INT AUTO_INCREMENT PRIMARY KEY,
    region_name VARCHAR(100) NOT NULL
);

-- Bảng tỉnh/thành phố
CREATE TABLE provinces (
    province_id INT AUTO_INCREMENT PRIMARY KEY,
    province_name VARCHAR(100) NOT NULL,
    region_id INT NOT NULL,
    FOREIGN KEY (region_id) REFERENCES regions(region_id)
);

-- Bảng tour
CREATE TABLE tours (
    tour_id INT AUTO_INCREMENT PRIMARY KEY,
    tour_name VARCHAR(255) NOT NULL,
    region_id INT NOT NULL,
    province_id INT NOT NULL,
    description TEXT,
    days INT,
    nights INT,
    departure_point VARCHAR(255),
    main_destination VARCHAR(255),
    adult_price DECIMAL(12,2),
    child_price DECIMAL(12,2),
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Active', 'Unactive', 'Full', 'End') DEFAULT 'Active',
    FOREIGN KEY (region_id) REFERENCES regions(region_id),
    FOREIGN KEY (province_id) REFERENCES provinces(province_id)
);

-- Bảng lịch trình tour
CREATE TABLE tour_schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT NOT NULL,
    day_number INT NOT NULL,
    schedule_description TEXT NOT NULL,
    FOREIGN KEY (tour_id) REFERENCES tours(tour_id)
);

-- Bảng hình ảnh tour
CREATE TABLE tour_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (tour_id) REFERENCES tours(tour_id)
);

-- Bảng khởi hành
CREATE TABLE departures (
    departure_id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_slots INT NOT NULL,
    remaining_slots INT NOT NULL,
    status ENUM('ConCho', 'SapFull', 'Full', 'DaKhoiHanh') DEFAULT 'ConCho',
    FOREIGN KEY (tour_id) REFERENCES tours(tour_id)
);

-- Bảng đặt tour
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    departure_id INT NOT NULL,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(12,2) NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') DEFAULT 'Pending',
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (departure_id) REFERENCES departures(departure_id)
);

-- Bảng thanh toán
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(12,2) NOT NULL,
    payment_method ENUM('CreditCard', 'BankTransfer', 'Cash'),
    status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- Bảng tour tùy chỉnh
CREATE TABLE custom_tours (
    custom_tour_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    destination VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    number_of_people INT,
    special_request TEXT,
    status ENUM('Pending', 'Rejected', 'Completed') DEFAULT 'Pending',
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Bảng log tour (lưu thay đổi)
CREATE TABLE tour_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT NOT NULL,
    action VARCHAR(100),
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tour_id) REFERENCES tours(tour_id)
);

-- Bảng giảm giá tour
CREATE TABLE tour_discounts (
    discount_id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT NOT NULL,
    discount_name VARCHAR(100),
    discount_type ENUM('percent','fixed') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    FOREIGN KEY (tour_id) REFERENCES tours(tour_id)
);
