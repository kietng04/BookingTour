# 🌱 Seed Data for BookingTour

Realistic Vietnam tour data for development and testing.

## 📋 Overview

This folder contains SQL seed scripts to populate all 4 databases with realistic data:

- **USERDB**: Users and email verifications
- **TOURDB**: Tours, regions, provinces, images, schedules, departures, discounts
- **BOOKINGDB**: Bookings, guests, booking logs
- **PAYMENTDB**: Payments, payment logs, refunds

## 📊 Data Summary

### USERDB
- **25 users** (20 customers + 5 admin/staff)
- **25 email verifications** (all verified)
- Default password: `password123`

### TOURDB
- **4 regions** (Miền Bắc, Trung, Nam, Tây Nguyên)
- **20 provinces** (Quảng Ninh, Lâm Đồng, Kiên Giang...)
- **18 realistic Vietnam tours** (Hạ Long, Phú Quốc, Đà Lạt, Sapa...)
- **65+ tour images** (3-4 per tour, using 11 Cloudinary URLs)
- **100+ tour schedules** (full itineraries)
- **72 departures** (4 per tour, future dates)
- **8 tour discounts** (seasonal promotions)

### BOOKINGDB
- **80 bookings** total:
  - 30 CONFIRMED
  - 25 PENDING
  - 15 COMPLETED
  - 10 CANCELLED
- **160+ booking guests** (avg 2 per booking)
- **80+ booking logs** (status tracking)

### PAYMENTDB
- **80 payments** (matching 80 bookings)
- **50+ payment logs** (transaction tracking)
- **6 refunds** (for cancelled bookings)

## 🚀 Quick Start

### Option 1: Run Master Script (Recommended)

```bash
# Run all seeds in correct order
psql -U postgres -f sql-scripts/seed_master.sql
```

### Option 2: Run Individual Scripts

```bash
# 1. Seed USERDB
psql -U postgres -d userdb -f sql-scripts/seed_01_userdb.sql

# 2. Seed TOURDB
psql -U postgres -d tourdb -f sql-scripts/seed_02_tourdb.sql

# 3. Seed BOOKINGDB
psql -U postgres -d bookingdb -f sql-scripts/seed_03_bookingdb.sql

# 4. Seed PAYMENTDB
psql -U postgres -d paymentdb -f sql-scripts/seed_04_paymentdb.sql
```

## 📝 Prerequisites

1. **PostgreSQL installed** and running
2. **Databases created**:
   - `userdb` (port 5432)
   - `tourdb` (port 5432)
   - `bookingdb` (port 5433)
   - `paymentdb` (port 5434)
3. **Schema initialized** (tables created via Spring Boot JPA or init scripts)

## 🔐 Sample Credentials

### Regular Users
| Email | Password | Role |
|-------|----------|------|
| nguyenvana@gmail.com | password123 | Customer |
| tranthib@gmail.com | password123 | Customer |
| levanc@gmail.com | password123 | Customer |

### Admin/Staff
| Email | Password | Role |
|-------|----------|------|
| admin.nguyen@bookingtour.vn | password123 | Admin |
| admin.tran@bookingtour.vn | password123 | Admin |
| staff.le@bookingtour.vn | password123 | Staff |

## 🗺️ Featured Tours

1. **Du lịch Vịnh Hạ Long 3N2Đ** - 6,500,000 VND
2. **Khám phá đảo Phú Quốc 4N3Đ** - 8,900,000 VND
3. **Đà Lạt - Thành phố ngàn hoa 3N2Đ** - 4,500,000 VND
4. **Sapa - Chinh phục Fansipan 4N3Đ** - 7,200,000 VND
5. **Nha Trang - Thiên đường biển 3N2Đ** - 5,800,000 VND
6. **Hội An - Phố cổ bên sông Thu 2N1Đ** - 3,200,000 VND
7. **Huế - Cố đô ngàn năm 3N2Đ** - 4,800,000 VND
8. **Đà Nẵng - Bà Nà Hills 3N2Đ** - 6,200,000 VND
9. **Ninh Bình - Tràng An Bái Đính 2N1Đ** - 2,800,000 VND
10. **Vũng Tàu - Biển gần Sài Gòn 2N1Đ** - 2,500,000 VND
11. **Miền Tây sông nước 3N2Đ** - 4,200,000 VND
12. **Quy Nhơn - Biển xanh cát trắng 3N2Đ** - 5,200,000 VND
13. **Phong Nha - Thiên đường động 3N2Đ** - 5,500,000 VND
14. **Buôn Ma Thuột - Thủ phủ Cà phê 3N2Đ** - 4,800,000 VND
15. **Hà Giang - Cao nguyên đá 4N3Đ** - 6,800,000 VND
16. **Mũi Né - Thiên đường resort 3N2Đ** - 4,500,000 VND
17. **Hà Nội - Thủ đô ngàn năm văn hiến 2N1Đ** - 3,800,000 VND
18. **Côn Đảo - Quần đảo hoang sơ 3N2Đ** - 12,500,000 VND

## 🖼️ Cloudinary Images Used

All tours use these 11 Cloudinary URLs (rotated across tours):

1. `https://res.cloudinary.com/dimvm7r9g/image/upload/v1761203000/tours/ofxieetfmx0xy7jldhby.jpg`
2. `https://res.cloudinary.com/dimvm7r9g/image/upload/v1761202979/tours/wbnfoucgoh2bs9v8l4vb.jpg`
3. `https://res.cloudinary.com/dimvm7r9g/image/upload/v1761202954/tours/fprqa5ieroea4vajihp5.jpg`
4. `https://res.cloudinary.com/dimvm7r9g/image/upload/v1719321383/cld-sample-2.jpg`
5. `https://res.cloudinary.com/dimvm7r9g/image/upload/v1719321380/samples/coffee.jpg`
6. `https://res.cloudinary.com/dimvm7r9g/image/upload/v1719321380/samples/cup-on-a-table.jpg`
7. `https://res.cloudinary.com/dimvm7r9g/image/upload/v1719321375/samples/balloons.jpg`
8. `https://res.cloudinary.com/dimvm7r9g/image/upload/v1719321361/samples/landscapes/nature-mountains.jpg`
9. `https://res.cloudinary.com/dimvm7r9g/image/upload/v1719321357/samples/landscapes/beach-boat.jpg`
10. `https://res.cloudinary.com/dimvm7r9g/image/upload/v1719321353/samples/landscapes/girl-urban-view.jpg`
11. `https://res.cloudinary.com/dimvm7r9g/image/upload/v1719321352/samples/sheep.jpg`

First image of each tour is marked as `is_primary=true` (banner).

## 🧪 Testing Scenarios

### Test User Login
```bash
# Login as customer
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nguyenvana@gmail.com","password":"password123"}'
```

### Test Tour Browsing
- All tours are ACTIVE except Tour 18 (Côn Đảo) which is FULL
- Departures range from June 2025 to November 2025
- Some departures are SAPFULL (almost full)

### Test Booking Flow
- **CONFIRMED bookings**: Have successful payments
- **PENDING bookings**: Awaiting payment confirmation
- **COMPLETED bookings**: Past trips with completed status
- **CANCELLED bookings**: Some with refunds, some without

### Test Payment Flow
- **MoMo payments**: Have momo_trans_id and response_data
- **Bank transfers**: Simple transaction_id
- **Credit/Debit cards**: Standard transaction_id
- **Refunds**: 4 COMPLETED refunds for cancelled bookings

## 🔧 Customization

### Clear Existing Data (Optional)

Each seed file has commented-out TRUNCATE commands at the top. Uncomment to clear data before seeding:

```sql
-- In each seed file, uncomment these lines:
TRUNCATE TABLE table_name CASCADE;
```

### Modify Data Quantities

Edit the INSERT statements in each file to add/remove records.

### Change Dates

Update departure dates to match your testing timeline:

```sql
-- In seed_02_tourdb.sql
INSERT INTO departures (..., start_date, end_date, ...) VALUES
(..., '2025-12-01', '2025-12-03', ...);  -- Change dates here
```

## 📞 Support

If you encounter issues:

1. **Check database connections**: Ensure all 4 databases are running
2. **Check table schemas**: Ensure JPA has created all tables
3. **Check foreign keys**: Data must be seeded in order (user → tour → booking → payment)
4. **Check logs**: Review PostgreSQL logs for detailed errors

## ✅ Verification

After seeding, verify data:

```sql
-- Check USERDB
\c userdb
SELECT COUNT(*) FROM users;        -- Should be 25
SELECT COUNT(*) FROM email_verifications;  -- Should be 25

-- Check TOURDB
\c tourdb
SELECT COUNT(*) FROM tours;        -- Should be 18
SELECT COUNT(*) FROM departures;   -- Should be 72
SELECT COUNT(*) FROM tour_images;  -- Should be 65+

-- Check BOOKINGDB
\c bookingdb
SELECT COUNT(*) FROM bookings;     -- Should be 80
SELECT status, COUNT(*) FROM bookings GROUP BY status;

-- Check PAYMENTDB
\c paymentdb
SELECT COUNT(*) FROM payments;     -- Should be 80
SELECT status, COUNT(*) FROM payments GROUP BY status;
```

## 🎉 Success!

If all queries return expected counts, your database is ready for testing!

---

**Generated with ❤️ for BookingTour Development**
