-- ============================================
-- MASTER SEED SCRIPT FOR BOOKINGTOUR
-- Runs all seed files in correct order
-- ============================================
--
-- USAGE:
--   psql -U postgres -f sql-scripts/seed_master.sql
--
-- Or run individually:
--   psql -U postgres -d userdb -f sql-scripts/seed_01_userdb.sql
--   psql -U postgres -d tourdb -f sql-scripts/seed_02_tourdb.sql
--   psql -U postgres -d bookingdb -f sql-scripts/seed_03_bookingdb.sql
--   psql -U postgres -d paymentdb -f sql-scripts/seed_04_paymentdb.sql
--
-- ============================================

\echo '=========================================='
\echo 'BOOKINGTOUR MASTER SEED SCRIPT'
\echo 'Seeding all databases with realistic Vietnam tour data...'
\echo '=========================================='
\echo ''

-- ============================================
-- 1. SEED USERDB
-- ============================================

\echo '1/4 - Seeding USERDB (users & email verifications)...'
\c userdb
\i seed_01_userdb.sql
\echo ''
\echo 'USERDB seeding complete!'
\echo ''

-- ============================================
-- 2. SEED TOURDB
-- ============================================

\echo '2/4 - Seeding TOURDB (tours, regions, provinces, images, schedules, departures, discounts)...'
\c tourdb
\i seed_02_tourdb.sql
\echo ''
\echo 'TOURDB seeding complete!'
\echo ''

-- ============================================
-- 3. SEED BOOKINGDB
-- ============================================

\echo '3/4 - Seeding BOOKINGDB (bookings, guests, logs)...'
\c bookingdb
\i seed_03_bookingdb.sql
\echo ''
\echo 'BOOKINGDB seeding complete!'
\echo ''

-- ============================================
-- 4. SEED PAYMENTDB
-- ============================================

\echo '4/4 - Seeding PAYMENTDB (payments, logs, refunds)...'
\c paymentdb
\i seed_04_paymentdb.sql
\echo ''
\echo 'PAYMENTDB seeding complete!'
\echo ''

-- ============================================
-- FINAL SUMMARY
-- ============================================

\echo '=========================================='
\echo 'ALL DATABASES SEEDED SUCCESSFULLY!'
\echo '=========================================='
\echo ''
\echo 'Summary of seeded data:'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo ''

\echo 'USERDB:'
\c userdb
SELECT
    (SELECT COUNT(*) FROM users) as users,
    (SELECT COUNT(*) FROM email_verifications) as email_verifications;
\echo ''

\echo 'TOURDB:'
\c tourdb
SELECT
    (SELECT COUNT(*) FROM regions) as regions,
    (SELECT COUNT(*) FROM provinces) as provinces,
    (SELECT COUNT(*) FROM tours) as tours,
    (SELECT COUNT(*) FROM tour_images) as tour_images,
    (SELECT COUNT(*) FROM tour_schedules) as tour_schedules,
    (SELECT COUNT(*) FROM departures) as departures,
    (SELECT COUNT(*) FROM tour_discounts) as tour_discounts;
\echo ''

\echo 'BOOKINGDB:'
\c bookingdb
SELECT
    (SELECT COUNT(*) FROM bookings) as total_bookings,
    (SELECT COUNT(*) FROM bookings WHERE status = 'CONFIRMED') as confirmed,
    (SELECT COUNT(*) FROM bookings WHERE status = 'PENDING') as pending,
    (SELECT COUNT(*) FROM bookings WHERE status = 'COMPLETED') as completed,
    (SELECT COUNT(*) FROM bookings WHERE status = 'CANCELLED') as cancelled,
    (SELECT COUNT(*) FROM booking_guests) as booking_guests,
    (SELECT COUNT(*) FROM booking_logs) as booking_logs;
\echo ''

\echo 'PAYMENTDB:'
\c paymentdb
SELECT
    (SELECT COUNT(*) FROM payments) as total_payments,
    (SELECT COUNT(*) FROM payments WHERE status = 'COMPLETED') as completed,
    (SELECT COUNT(*) FROM payments WHERE status = 'PENDING') as pending,
    (SELECT COUNT(*) FROM payments WHERE status = 'REFUNDED') as refunded,
    (SELECT COUNT(*) FROM payments WHERE status = 'FAILED') as failed,
    (SELECT COUNT(*) FROM payment_logs) as payment_logs,
    (SELECT COUNT(*) FROM refunds) as refunds;
\echo ''

\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo '✅ All seed scripts executed successfully!'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo ''
\echo 'DATA OVERVIEW:'
\echo '• 25 users (20 customers + 5 admin/staff)'
\echo '• 4 regions, 20 provinces'
\echo '• 18 realistic Vietnam tours'
\echo '• 65+ tour images (3-4 per tour)'
\echo '• 100+ tour schedules'
\echo '• 72 departures (4 per tour)'
\echo '• 8 tour discounts'
\echo '• 80 bookings (30 confirmed, 25 pending, 15 completed, 10 cancelled)'
\echo '• 160+ booking guests'
\echo '• 80+ booking logs'
\echo '• 80 payments matching bookings'
\echo '• 50+ payment logs'
\echo '• 6 refunds'
\echo ''
\echo 'CREDENTIALS:'
\echo '• All user passwords: "password123"'
\echo '• Sample users:'
\echo '  - nguyenvana@gmail.com / password123'
\echo '  - tranthib@gmail.com / password123'
\echo '  - admin.nguyen@bookingtour.vn / password123 (Admin)'
\echo ''
\echo 'NEXT STEPS:'
\echo '1. Start your microservices (user-service, tour-service, booking-service, payment-service)'
\echo '2. Test login with sample credentials'
\echo '3. Browse tours on frontend'
\echo '4. Test booking flow'
\echo ''
\echo '=========================================='
\echo 'Happy Testing! 🚀'
\echo '=========================================='
