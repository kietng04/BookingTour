-- Ensure admin user exists in database
-- Password: "admin" (BCrypt hashed with strength 10)
-- Can be run multiple times safely

\c tourdb;

-- Set client encoding to UTF-8
SET client_encoding = 'UTF8';

-- Insert admin user if not exists (by username)
INSERT INTO users (username, full_name, email, phone_number, password_hash, status)
VALUES ('admin', 'Quản Trị Viên', 'admin@gmail.com', '0900000000',
        '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'ACTIVE')
ON CONFLICT (username)
DO UPDATE SET
    full_name = 'Quản Trị Viên',
    email = 'admin@gmail.com',
    phone_number = '0900000000',
    password_hash = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
    status = 'ACTIVE';

-- Verify admin exists
SELECT user_id, username, email, full_name, phone_number, status
FROM users
WHERE username = 'admin' OR email = 'admin@gmail.com';
