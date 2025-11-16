-- Connect to bookingdb
\c bookingdb;

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    booking_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    tour_id BIGINT NOT NULL,
    departure_id BIGINT NOT NULL,
    num_seats INTEGER NOT NULL,
    total_amount DECIMAL(19, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_status CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'FAILED'))
);

-- Create booking_guests table
CREATE TABLE IF NOT EXISTS booking_guests (
    guest_id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255),
    guest_phone VARCHAR(20),
    guest_type VARCHAR(50) NOT NULL DEFAULT 'ADULT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    CONSTRAINT chk_guest_type CHECK (guest_type IN ('ADULT', 'CHILD', 'INFANT'))
);

-- Create indexes for better query performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_tour_id ON bookings(tour_id);
CREATE INDEX idx_bookings_departure_id ON bookings(departure_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
CREATE INDEX idx_booking_guests_booking_id ON booking_guests(booking_id);

-- Create audit log table
CREATE TABLE IF NOT EXISTS booking_logs (
    log_id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT,
    action VARCHAR(100) NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_log FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE SET NULL
);

CREATE INDEX idx_booking_logs_booking_id ON booking_logs(booking_id);
