-- Fix custom_tours table schema to match the entity model
-- This script migrates from old schema to new schema

-- Step 1: Drop old columns if they exist
ALTER TABLE custom_tours
DROP COLUMN IF EXISTS destination,
DROP COLUMN IF EXISTS number_of_people,
DROP COLUMN IF EXISTS special_request;

-- Step 2: Add new columns if they don't exist
ALTER TABLE custom_tours
ADD COLUMN IF NOT EXISTS tour_name VARCHAR(255) NOT NULL DEFAULT 'Tour tùy chỉnh',
ADD COLUMN IF NOT EXISTS num_adult INTEGER NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS num_children INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS region_id BIGINT,
ADD COLUMN IF NOT EXISTS province_id BIGINT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Step 3: Ensure start_date and end_date exist
ALTER TABLE custom_tours
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Step 4: Ensure created_at and updated_at exist
ALTER TABLE custom_tours
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Step 5: Remove default from tour_name after adding column
ALTER TABLE custom_tours
ALTER COLUMN tour_name DROP DEFAULT;

-- Step 6: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_custom_tours_user_id ON custom_tours(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_tours_status ON custom_tours(status);
CREATE INDEX IF NOT EXISTS idx_custom_tours_created_at ON custom_tours(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_custom_tours_region_id ON custom_tours(region_id);
CREATE INDEX IF NOT EXISTS idx_custom_tours_province_id ON custom_tours(province_id);

-- Step 7: Add comments
COMMENT ON TABLE custom_tours IS 'Stores custom tour requests from users';
COMMENT ON COLUMN custom_tours.tour_name IS 'Name of the custom tour';
COMMENT ON COLUMN custom_tours.num_adult IS 'Number of adults';
COMMENT ON COLUMN custom_tours.num_children IS 'Number of children';
COMMENT ON COLUMN custom_tours.region_id IS 'Region ID for the tour';
COMMENT ON COLUMN custom_tours.province_id IS 'Province ID for the tour';
COMMENT ON COLUMN custom_tours.description IS 'Tour description and special requests';
COMMENT ON COLUMN custom_tours.status IS 'Tour status: PENDING, COMPLETED, REJECTED';
