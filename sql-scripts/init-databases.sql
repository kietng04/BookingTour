-- Create databases
CREATE DATABASE tourdb WITH ENCODING 'UTF8' LC_COLLATE='en_US.UTF-8' LC_CTYPE='en_US.UTF-8' TEMPLATE=template0;
\c tourdb;

-- Set client encoding to UTF-8
SET client_encoding = 'UTF8';

-- Create enum types
CREATE TYPE user_status AS ENUM ('ACTIVE', 'UNACTIVE');
CREATE TYPE departure_status AS ENUM ('CONCHO', 'SAPFULL', 'FULL', 'DAKHOIHANH');
CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
CREATE TYPE payment_method AS ENUM ('CREDITCARD', 'BANKTRANSFER', 'CASH');
CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'Failed');
CREATE TYPE custom_tour_status AS ENUM ('PENDING', 'REJECTED', 'COMPLETED');
CREATE TYPE tour_status AS ENUM ('ACTIVE', 'UNACTIVE', 'FULL', 'END');
CREATE TYPE discount_type AS ENUM ('PERCENT', 'FIXED');

-- Create tables
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status user_status DEFAULT 'ACTIVE'
);

CREATE TABLE user_verification (
    verification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    verification_code VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE regions (
    region_id SERIAL PRIMARY KEY,
    region_name VARCHAR(100) NOT NULL
);

CREATE TABLE provinces (
    province_id SERIAL PRIMARY KEY,
    province_name VARCHAR(100) NOT NULL,
    region_id INTEGER NOT NULL,
    FOREIGN KEY (region_id) REFERENCES regions(region_id)
);

CREATE TABLE tours (
    tour_id SERIAL PRIMARY KEY,
    tour_name VARCHAR(255) NOT NULL,
    tour_slug VARCHAR(255) UNIQUE NOT NULL,
    region_id INTEGER NOT NULL,
    province_id INTEGER NOT NULL,
    description TEXT,
    days INTEGER,
    nights INTEGER,
    departure_point VARCHAR(255),
    main_destination VARCHAR(255),
    adult_price DECIMAL(12,2),
    child_price DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status tour_status DEFAULT 'ACTIVE',
    FOREIGN KEY (region_id) REFERENCES regions(region_id),
    FOREIGN KEY (province_id) REFERENCES provinces(province_id)
);

CREATE TABLE tour_schedules (
    schedule_id SERIAL PRIMARY KEY,
    tour_id INTEGER NOT NULL,
    day_number INTEGER NOT NULL,
    schedule_description TEXT NOT NULL,
    FOREIGN KEY (tour_id) REFERENCES tours(tour_id)
);

CREATE TABLE tour_images (
    image_id SERIAL PRIMARY KEY,
    tour_id INTEGER NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (tour_id) REFERENCES tours(tour_id)
);

CREATE TABLE departures (
    departure_id SERIAL PRIMARY KEY,
    tour_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_slots INTEGER NOT NULL,
    remaining_slots INTEGER NOT NULL,
    status departure_status DEFAULT 'CONCHO',
    FOREIGN KEY (tour_id) REFERENCES tours(tour_id)
);

CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    tour_id INTEGER NOT NULL,
    departure_id INTEGER NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(12,2) NOT NULL,
    payment_override VARCHAR(20),
    status booking_status DEFAULT 'PENDING',
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (tour_id) REFERENCES tours(tour_id),
    FOREIGN KEY (departure_id) REFERENCES departures(departure_id)
);

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(12,2) NOT NULL,
    payment_method payment_method,
    status payment_status DEFAULT 'PENDING',
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

CREATE TABLE custom_tours (
    custom_tour_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    tour_name VARCHAR(255) NOT NULL,
    num_adult INTEGER NOT NULL DEFAULT 1,
    num_children INTEGER NOT NULL DEFAULT 0,
    region_id BIGINT,
    province_id BIGINT,
    start_date DATE,
    end_date DATE,
    description TEXT,
    status custom_tour_status DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE tour_logs (
    log_id SERIAL PRIMARY KEY,
    tour_id INTEGER NOT NULL,
    action VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tour_id) REFERENCES tours(tour_id)
);

CREATE TABLE tour_discounts (
    discount_id SERIAL PRIMARY KEY,
    tour_id INTEGER NOT NULL,
    discount_name VARCHAR(100),
    discount_type discount_type NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    FOREIGN KEY (tour_id) REFERENCES tours(tour_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

CREATE INDEX idx_tours_region_id ON tours(region_id);
CREATE INDEX idx_tours_province_id ON tours(province_id);
CREATE INDEX idx_tours_status ON tours(status);
CREATE INDEX idx_tours_slug ON tours(tour_slug);

CREATE INDEX idx_tour_images_tour_id ON tour_images(tour_id);
CREATE INDEX idx_tour_images_is_primary ON tour_images(tour_id, is_primary);

CREATE INDEX idx_departures_tour_id ON departures(tour_id);
CREATE INDEX idx_departures_start_date ON departures(start_date);
CREATE INDEX idx_departures_status ON departures(status);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_tour_id ON bookings(tour_id);
CREATE INDEX idx_bookings_departure_id ON bookings(departure_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date DESC);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);

CREATE INDEX idx_custom_tours_user_id ON custom_tours(user_id);
CREATE INDEX idx_custom_tours_status ON custom_tours(status);
CREATE INDEX idx_custom_tours_region_id ON custom_tours(region_id);
CREATE INDEX idx_custom_tours_province_id ON custom_tours(province_id);
CREATE INDEX idx_custom_tours_created_at ON custom_tours(created_at DESC);

CREATE INDEX idx_tour_discounts_tour_id ON tour_discounts(tour_id);
CREATE INDEX idx_tour_discounts_dates ON tour_discounts(start_date, end_date);

-- Add comments to tables
COMMENT ON TABLE users IS 'User accounts and authentication information';
COMMENT ON TABLE tours IS 'Tour packages with details and pricing';
COMMENT ON TABLE custom_tours IS 'Custom tour requests from users';
COMMENT ON TABLE bookings IS 'Tour bookings made by users';
COMMENT ON TABLE payments IS 'Payment transactions for bookings';
COMMENT ON TABLE departures IS 'Tour departure schedules';

-- Add comments to important columns
COMMENT ON COLUMN custom_tours.tour_name IS 'Name of the custom tour request';
COMMENT ON COLUMN custom_tours.num_adult IS 'Number of adult travelers';
COMMENT ON COLUMN custom_tours.num_children IS 'Number of child travelers';
COMMENT ON COLUMN custom_tours.description IS 'Tour description and special requests';
COMMENT ON COLUMN custom_tours.status IS 'Request status: PENDING, COMPLETED, REJECTED';
