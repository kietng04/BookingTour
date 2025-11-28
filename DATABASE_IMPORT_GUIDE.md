# 📊 Hướng Dẫn Import Database cho BookingTour

## 🎯 Tổng Quan

Dự án BookingTour sử dụng **3 PostgreSQL databases**:
1. **userdb** (Port 5432) - User Service
2. **bookingdb** (Port 5433) - Booking Service
3. **paymentdb** (Port 5434) - Payment Service

---

## ✅ Cách 1: Import Tự Động Bằng Docker Compose (RECOMMENDED)

### Điều kiện tiên quyết:
- Cài đặt Docker & Docker Compose
- Dự án BookingTour được clone

### Bước thực hiện:

```bash
# 1. Đi đến thư mục dự án
cd C:\Users\KIET\Desktop\New folder\BookingTour

# 2. Start Docker Compose (tự động tạo DB và import script)
docker-compose up -d postgres-db booking-db payment-db

# 3. Kiểm tra status
docker-compose ps

# Output mong muốn:
# NAME                COMMAND             STATUS
# postgres-db         postgres            Up (healthy)
# booking-db          postgres            Up (healthy)
# payment-db          postgres            Up (healthy)

# 4. Kiểm tra logs để đảm bảo không có lỗi
docker-compose logs postgres-db
docker-compose logs booking-db
docker-compose logs payment-db
```

**Điều gì xảy ra:**
- ✅ Tạo 3 database containers
- ✅ Chạy `init-databases.sql` → Tạo schema & tables cho userdb/tourdb
- ✅ Chạy `init-booking-db.sql` → Tạo schema & tables cho bookingdb
- ✅ Chạy `init-payment-db.sql` → Tạo schema & tables cho paymentdb
- ✅ Chạy `script_data.sql` → Insert dữ liệu mẫu (nếu có)

---

## ✅ Cách 2: Import Thủ Công Bằng PSQL Command Line

### Điều kiện tiên quyết:
- PostgreSQL 15 được cài đặt
- Có PostgreSQL Client (psql.exe)

### Bước thực hiện:

#### **Bước 1: Kết nối tới PostgreSQL**

```powershell
# Windows PowerShell
psql -U postgres -h localhost -p 5432

# Hoặc tạo mới 3 databases trước
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE userdb;"
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE tourdb;"
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE bookingdb;"
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE paymentdb;"
```

#### **Bước 2: Import các SQL scripts**

```powershell
# Import init-databases.sql (cho userdb + tourdb)
psql -U postgres -h localhost -p 5432 -f "sql-scripts\init-databases.sql"

# Import init-booking-db.sql
psql -U postgres -h localhost -p 5432 -f "sql-scripts\init-booking-db.sql"

# Import init-payment-db.sql
psql -U postgres -h localhost -p 5432 -f "sql-scripts\init-payment-db.sql"

# Import dữ liệu mẫu (optional)
psql -U postgres -h localhost -p 5432 -d userdb -f "sql-scripts\script_data.sql"
```

#### **Bước 3: Kiểm tra kết quả**

```powershell
# Kết nối tới userdb
psql -U postgres -h localhost -p 5432 -d userdb -c "\dt"

# Output: Liệt kê tất cả các tables
# Schema |       Name       | Type  | Owner
# --------+------------------+-------+----------
# public | users            | table | postgres
# public | user_verification| table | postgres
# public | regions          | table | postgres
# public | provinces        | table | postgres
# ...
```

---

## ✅ Cách 3: Restore Từ Backup Files

Nếu bạn có các backup files trong thư mục `db_backups/20251102-082703/`:

```powershell
# Tìm đường dẫn tới file backup
dir db_backups\20251102-082703\

# Output:
# bookingdb.bak
# paymentdb.bak
# tourdb.bak
# userdb.bak

# Restore từ backup (nếu là .bak format)
# Note: File .bak có thể là PostgreSQL custom format hoặc SQL text
# Nếu là text format:
psql -U postgres -h localhost -p 5432 -f "db_backups\20251102-082703\userdb.bak"
psql -U postgres -h localhost -p 5432 -f "db_backups\20251102-082703\tourdb.bak"
psql -U postgres -h localhost -p 5432 -f "db_backups\20251102-082703\bookingdb.bak"
psql -U postgres -h localhost -p 5432 -f "db_backups\20251102-082703\paymentdb.bak"

# Nếu là PostgreSQL custom format (.bak binary):
pg_restore -U postgres -h localhost -p 5432 -d userdb db_backups\20251102-082703\userdb.bak
pg_restore -U postgres -h localhost -p 5432 -d bookingdb db_backups\20251102-082703\bookingdb.bak
pg_restore -U postgres -h localhost -p 5432 -d paymentdb db_backups\20251102-082703\paymentdb.bak
```

---

## ✅ Cách 4: Sử Dụng DBeaver (GUI Tool)

### Bước 1: Cài đặt DBeaver
- Download từ https://dbeaver.io/
- Cài đặt Community Edition (miễn phí)

### Bước 2: Kết nối PostgreSQL
1. Mở DBeaver
2. File → New Database Connection
3. Chọn PostgreSQL
4. Nhập thông tin:
   - **Host:** localhost
   - **Port:** 5432
   - **Database:** postgres
   - **Username:** postgres
   - **Password:** postgres
5. Click **Finish**

### Bước 3: Import Database
1. Right-click connection → SQL Editor → Open SQL script
2. Chọn file: `sql-scripts/init-databases.sql`
3. Chạy SQL (Ctrl + Enter)
4. Lặp lại cho `init-booking-db.sql` và `init-payment-db.sql`

---

## ✅ Cách 5: Import Qua Dự Án Spring Boot (JPA)

Nếu bạn muốn để Spring Boot JPA tự động tạo database schema:

### application.yml Configuration:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/userdb
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: create-drop  # create, create-drop, update, validate, none
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  sql:
    init:
      mode: always  # always, never
      data-locations: classpath:data.sql
```

**Lưu ý:** Điều này sẽ tự động tạo tables từ Entity classes, nhưng bạn vẫn cần chạy seed scripts để insert dữ liệu.

---

## 📋 Danh Sách Các SQL Scripts

| File | Mục đích | Database |
|------|----------|----------|
| `init-databases.sql` | Tạo schema & tables cho userdb, tourdb | userdb, tourdb |
| `init-booking-db.sql` | Tạo schema & tables cho bookingdb | bookingdb |
| `init-payment-db.sql` | Tạo schema & tables cho paymentdb | paymentdb |
| `script_data.sql` | Insert dữ liệu mẫu (tours, users, etc.) | userdb, tourdb |
| `seed_01_userdb.sql` | Seed dữ liệu user | userdb |
| `seed_02_tourdb.sql` | Seed dữ liệu tour | tourdb |
| `seed_03_bookingdb.sql` | Seed dữ liệu booking | bookingdb |
| `seed_04_paymentdb.sql` | Seed dữ liệu payment | paymentdb |
| `seed_master.sql` | Seed tất cả dữ liệu | Tất cả |
| `ensure-admin-user.sql` | Tạo admin user | userdb |

---

## 🔍 Kiểm Tra Database Đã Import Thành Công

```powershell
# 1. Kết nối postgresql
psql -U postgres -h localhost

# 2. Liệt kê tất cả databases
\l

# Output mong muốn:
#         Name         | Owner    | Encoding |
# ----------------------+----------+----------
# userdb              | postgres | UTF8     |
# tourdb              | postgres | UTF8     |
# bookingdb           | postgres | UTF8     |
# paymentdb           | postgres | UTF8     |

# 3. Kết nối tới userdb
\c userdb

# 4. Xem tất cả tables
\dt

# Output mong muốn:
# Schema |       Name       | Type  | Owner
# --------+------------------+-------+----------
# public | users            | table | postgres
# public | user_verification| table | postgres
# public | regions          | table | postgres
# public | provinces        | table | postgres
# public | tours            | table | postgres
# public | tour_schedules   | table | postgres
# public | tour_images      | table | postgres
# public | departures       | table | postgres
# public | bookings         | table | postgres
# public | payments         | table | postgres
# public | tour_logs        | table | postgres
# public | tour_discounts   | table | postgres
# public | custom_tours     | table | postgres

# 5. Xem số lượng records
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM tours;
SELECT COUNT(*) FROM departures;
```

---

## ⚠️ Troubleshooting

### Lỗi: "Database already exists"
```bash
# Xóa database trước rồi tạo lại
psql -U postgres -h localhost -p 5432 -c "DROP DATABASE IF EXISTS userdb;"
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE userdb;"
```

### Lỗi: "Connection refused"
```bash
# Kiểm tra PostgreSQL đã start
pg_isready -h localhost -p 5432

# Hoặc dùng Docker
docker-compose ps
docker-compose logs postgres-db
```

### Lỗi: "Encoding UTF-8 mismatch"
```sql
-- Trong sql script, thêm dòng này vào đầu:
SET client_encoding = 'UTF8';
```

### Lỗi: "Permission denied"
```bash
# Kiểm tra password
psql -U postgres -h localhost -p 5432 -W

# Hoặc dùng .pgpass file (Windows)
# Tạo file: %APPDATA%\postgresql\pgpass.conf
# localhost:5432:*:postgres:postgres
```

---

## 🚀 Quy Trình Hoàn Chỉnh (Recommended)

```powershell
# 1. Start Docker Compose
docker-compose up -d postgres-db booking-db payment-db

# 2. Chờ databases ready (khoảng 10-15 giây)
Start-Sleep -Seconds 15

# 3. Kiểm tra health
docker-compose ps

# 4. Nếu cần, xem logs
docker-compose logs postgres-db -n 50

# 5. Connect và kiểm tra
psql -U postgres -h localhost -p 5432 -c "\l"

# 6. Start tất cả services
docker-compose up -d

# 7. Kiểm tra tất cả services
docker-compose ps
```

---

## 📝 Ghi Chú

- **Userdb & Tourdb** chia sẻ cùng 1 PostgreSQL instance (port 5432)
- **Bookingdb** ở instance riêng (port 5433)
- **Paymentdb** ở instance riêng (port 5434)
- Dữ liệu mẫu (seed data) là optional - bạn có thể chạy hoặc bỏ qua
- Nếu cần reset database, xóa folder `postgres_data` trong docker volumes

---

## 📞 Liên Hệ Hỗ Trợ

Nếu có vấn đề, kiểm tra:
1. Docker containers đang chạy?
2. Ports không bị conflict?
3. SQL syntax có lỗi không?
4. File permissions có đúng không?

