-- Migration script to add created_at column to users table in userdb
-- This fixes the error: column u1_0.created_at does not exist

-- Connect to userdb
\c userdb;

-- Add created_at column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Update existing rows to have created_at if they don't have it
UPDATE users 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL;

-- Make created_at NOT NULL after updating existing rows
ALTER TABLE users 
ALTER COLUMN created_at SET NOT NULL;

