-- Create tour_reviews table for review & rating feature
CREATE TABLE tour_reviews (
    review_id BIGSERIAL PRIMARY KEY,
    tour_id BIGINT NOT NULL REFERENCES tours(tour_id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL,
    booking_id BIGINT,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    title VARCHAR(200) NOT NULL,
    comment TEXT NOT NULL,
    guest_name VARCHAR(100) NOT NULL,
    guest_avatar VARCHAR(500),
    badges TEXT[],
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_tour_reviews_tour_id ON tour_reviews(tour_id);
CREATE INDEX idx_tour_reviews_user_id ON tour_reviews(user_id);
CREATE INDEX idx_tour_reviews_status ON tour_reviews(status);
CREATE INDEX idx_tour_reviews_rating ON tour_reviews(rating DESC);
CREATE INDEX idx_tour_reviews_created_at ON tour_reviews(created_at DESC);

-- Add constraint to prevent duplicate reviews from same user for same tour
CREATE UNIQUE INDEX idx_tour_reviews_unique_user_tour
    ON tour_reviews(tour_id, user_id)
    WHERE status != 'REJECTED';

-- Comments for documentation
COMMENT ON TABLE tour_reviews IS 'Stores user reviews and ratings for tours';
COMMENT ON COLUMN tour_reviews.user_id IS 'External reference to User Service';
COMMENT ON COLUMN tour_reviews.booking_id IS 'External reference to Booking Service (optional)';
COMMENT ON COLUMN tour_reviews.status IS 'Review moderation status: PENDING, APPROVED, REJECTED';
COMMENT ON COLUMN tour_reviews.badges IS 'Array of badge keywords for filtering (e.g., Cặp đôi, Gia đình)';
