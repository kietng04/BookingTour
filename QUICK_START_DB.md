# 🚀 Quick Start - Import Database (Nhanh Nhất)

## 📌 Cách Nhanh Nhất: Docker Compose (2 Bước)

### **Bước 1: Chạy Docker Compose**

```powershell
# Windows
docker-compose up -d postgres-db booking-db payment-db

# Linux/Mac
docker-compose up -d postgres-db booking-db payment-db
```

**Kết quả:** Docker sẽ tự động:
- ✅ Tạo 3 PostgreSQL containers
- ✅ Tạo 4 databases (userdb, tourdb, bookingdb, paymentdb)
- ✅ Chạy init scripts → Tạo tables
- ✅ Chạy seed scripts → Insert dữ liệu mẫu (nếu có)

### **Bước 2: Kiểm tra**

```powershell
# Xem status containers
docker-compose ps

# Kiểm tra logs
docker-compose logs postgres-db

# Xem dữ liệu
docker-compose exec postgres-db psql -U postgres -d userdb -c "SELECT COUNT(*) FROM users;"
```

**Done!** 🎉 Databases đã sẵn sàng để dùng!

---

## 🎯 Nếu Không Có Docker

### **Cách Thủ Công (Windows PowerShell)**

```powershell
# 1. Chạy script import tự động
.\import-db.bat

# Hoặc chạy command trực tiếp:
$env:PGPASSWORD="postgres"

# 2. Import schemas
psql -U postgres -h localhost -p 5432 -f "sql-scripts\init-databases.sql"
psql -U postgres -h localhost -p 5432 -f "sql-scripts\init-booking-db.sql"
psql -U postgres -h localhost -p 5432 -f "sql-scripts\init-payment-db.sql"

# 3. Import dữ liệu (optional)
psql -U postgres -h localhost -p 5432 -d userdb -f "sql-scripts\script_data.sql"
```

### **Linux/Mac Bash**

```bash
# 1. Chạy script import tự động
chmod +x import-db.sh
./import-db.sh

# Hoặc chạy command trực tiếp:
export PGPASSWORD="postgres"

# 2. Import schemas
psql -U postgres -h localhost -p 5432 -f "sql-scripts/init-databases.sql"
psql -U postgres -h localhost -p 5432 -f "sql-scripts/init-booking-db.sql"
psql -U postgres -h localhost -p 5432 -f "sql-scripts/init-payment-db.sql"

# 3. Import dữ liệu (optional)
psql -U postgres -h localhost -p 5432 -d userdb -f "sql-scripts/script_data.sql"
```

---

## 🔍 Kiểm Tra Kết Quả

```bash
# Kết nối PostgreSQL
psql -U postgres -h localhost -p 5432

# Liệt kê databases (trong psql console)
\l

# Chuyển sang database userdb
\c userdb

# Xem tất cả tables
\dt

# Đếm users
SELECT COUNT(*) FROM users;

# Đếm tours
SELECT COUNT(*) FROM tours;

# Exit psql
\q
```

**Kết quả mong đợi:**
- ✅ 4 databases: userdb, tourdb, bookingdb, paymentdb
- ✅ Tất cả tables được tạo
- ✅ Dữ liệu mẫu được insert (nếu có seed data)

---

## ⚡ Một Lệnh Duy Nhất (Tất Cả)

### **Windows PowerShell**
```powershell
docker-compose up -d postgres-db booking-db payment-db; Start-Sleep -Seconds 15; docker-compose ps
```

### **Linux/Mac Bash**
```bash
docker-compose up -d postgres-db booking-db payment-db && sleep 15 && docker-compose ps
```

---

## 📊 Database Connection Details

| Database | Host | Port | Username | Password |
|----------|------|------|----------|----------|
| userdb, tourdb | localhost | 5432 | postgres | postgres |
| bookingdb | localhost | 5433 | postgres | postgres |
| paymentdb | localhost | 5434 | postgres | postgres |

---

## 🐛 Nếu Có Lỗi

### ❌ "Connection refused"
```bash
# Kiểm tra xem PostgreSQL đã start?
docker-compose ps

# Hoặc start lại
docker-compose restart postgres-db booking-db payment-db
```

### ❌ "Database already exists"
```bash
# Reset lại
docker-compose down
docker volume rm bookingtour_postgres_data bookingtour_booking_data bookingtour_payment_data
docker-compose up -d postgres-db booking-db payment-db
```

### ❌ "psql: command not found"
```bash
# Cài đặt PostgreSQL Client
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql@15
# Linux: sudo apt-get install postgresql-client
```

---

## 📚 Tài Liệu Đầy Đủ

Xem file `DATABASE_IMPORT_GUIDE.md` để biết thêm chi tiết về:
- Tất cả các cách import
- Troubleshooting chi tiết
- Import từ backup files
- Sử dụng DBeaver GUI
- Cấu hình Spring Boot JPA

---

## ✅ Checklist

- [ ] Docker Compose đã start
- [ ] Xem được `docker-compose ps` output
- [ ] Kết nối được psql
- [ ] 4 databases được tạo
- [ ] Tables được tạo thành công
- [ ] (Optional) Dữ liệu mẫu được import

**Xong!** Ready to code 🚀

