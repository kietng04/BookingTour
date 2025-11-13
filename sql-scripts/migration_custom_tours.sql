-- Migration script for custom_tours table
-- Add missing columns for custom tour functionality

-- Add new columns to custom_tours table
ALTER TABLE custom_tours
ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS budget_range VARCHAR(50),
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_custom_tours_user_id ON custom_tours(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_tours_status ON custom_tours(status);
CREATE INDEX IF NOT EXISTS idx_custom_tours_created_at ON custom_tours(created_at DESC);

-- Add comment to table
COMMENT ON TABLE custom_tours IS 'Stores custom tour requests from users';
COMMENT ON COLUMN custom_tours.contact_email IS 'Contact email for this request';
COMMENT ON COLUMN custom_tours.contact_phone IS 'Contact phone number';
COMMENT ON COLUMN custom_tours.budget_range IS 'Budget range: Under 10M, 10M-20M, 20M-50M, 50M+';
COMMENT ON COLUMN custom_tours.admin_notes IS 'Admin response/notes for the request';
