-- Create databases
CREATE DATABASE tourdb;
\c tourdb;

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
