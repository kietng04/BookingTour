# 🚀 START HERE - Database Import (Bắt Đầu Từ Đây!)

## 🎯 3 Lựa Chọn

### **Lựa Chọn A: Chỉ Cần 1 Lệnh (Nhanh Nhất - RECOMMENDED)**

```bash
docker-compose up -d postgres-db booking-db payment-db
```

**Xong!** ✅ Chỉ cần ~15 giây

---

### **Lựa Chọn B: Chạy Script (Interactive Menu)**

**Windows:**
```bash
.\import-db.bat
```

**Linux/Mac:**
```bash
chmod +x import-db.sh
./import-db.sh
```

Chọn menu option 1 → Import tất cả

---

### **Lựa Chọn C: Chạy Command Trực Tiếp**

**Windows PowerShell:**
```powershell
$env:PGPASSWORD="postgres"
psql -U postgres -h localhost -p 5432 -f "sql-scripts\init-databases.sql"
psql -U postgres -h localhost -p 5432 -f "sql-scripts\init-booking-db.sql"
psql -U postgres -h localhost -p 5432 -f "sql-scripts\init-payment-db.sql"
```

**Linux/Mac:**
```bash
export PGPASSWORD="postgres"
psql -U postgres -h localhost -p 5432 -f "sql-scripts/init-databases.sql"
psql -U postgres -h localhost -p 5432 -f "sql-scripts/init-booking-db.sql"
psql -U postgres -h localhost -p 5432 -f "sql-scripts/init-payment-db.sql"
```

---

## ✅ Kiểm Tra Thành Công

```bash
# Xem databases
psql -U postgres -h localhost -p 5432 -c "\l"

# Xem tables
psql -U postgres -h localhost -p 5432 -d userdb -c "\dt"

# Đếm users
psql -U postgres -h localhost -p 5432 -d userdb -c "SELECT COUNT(*) FROM users;"
```

**Kết quả mong đợi:**
- ✅ 4 databases: userdb, tourdb, bookingdb, paymentdb
- ✅ Tất cả tables được tạo
- ✅ Có dữ liệu (nếu seed data)

---

## 📚 File Hướng Dẫn Khác

Nếu cần chi tiết hơn:

| File | Mục đích |
|------|----------|
| `DATABASE_FILES_README.md` | Index của tất cả files |
| `QUICK_START_DB.md` | Quick start (2-3 phút) |
| `DATABASE_IMPORT_GUIDE.md` | Chi tiết (10-15 phút) |
| `DATABASE_SETUP.txt` | Diagram ASCII (5 phút) |
| `IMPORT_DB_SUMMARY.txt` | TL;DR (1 phút) |
| `DATABASE_IMPORT_QUICK_GUIDE.html` | Web UI (mở browser) |

---

## 🔐 Connection Details

```
Host: localhost
Port: 5432 (userdb/tourdb), 5433 (bookingdb), 5434 (paymentdb)
Username: postgres
Password: postgres
```

---

## ⚠️ Nếu Có Vấn Đề

### Problem: "Connection refused"
```bash
docker-compose ps              # Kiểm tra containers
docker-compose restart          # Restart
```

### Problem: "Database already exists"
```bash
docker-compose down
docker volume prune
docker-compose up -d postgres-db booking-db payment-db
```

### Problem: "psql: command not found"
- Windows: Install PostgreSQL từ https://www.postgresql.org/download/windows/
- Mac: `brew install postgresql@15`
- Linux: `sudo apt-get install postgresql-client`

---

## 🚀 Tiếp Theo

Sau khi import database:

```bash
# 1. Start tất cả services
docker-compose up -d

# 2. Kiểm tra services
docker-compose ps

# 3. Truy cập:
# - Eureka: http://localhost:8761
# - API Gateway: http://localhost:8080
# - RabbitMQ: http://localhost:15672
# - Frontend: http://localhost:3000
# - Admin: http://localhost:5174
```

---

## 💡 Khuyến Nghị

**Lần đầu tiên:** Dùng **Lựa Chọn A** (Docker Compose)

**Nếu Docker có vấn đề:** Dùng **Lựa Chọn B hoặc C**

**Để hiểu:** Đọc `DATABASE_IMPORT_GUIDE.md`

---

## ✨ Bây Giờ Bạn Đã Sẵn Sàng!

Choose one method above and start! 🎯

```bash
# Quickest way:
docker-compose up -d postgres-db booking-db payment-db
```

**Happy Coding! 🚀**

---

*Xem `DATABASE_FILES_README.md` để biết tất cả các file hướng dẫn khác*

