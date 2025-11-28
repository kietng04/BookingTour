# 📚 Database Import Files - Tất Cả File Hướng Dẫn

## 📋 Các File Vừa Được Tạo

### 1. **DATABASE_IMPORT_GUIDE.md** (Hướng dẫn chi tiết - Trang dài)
   - **Dùng cho:** Bạn muốn hiểu chi tiết tất cả các cách import
   - **Nội dung:**
     - ✅ 5 cách import database
     - ✅ Hướng dẫn từng bước chi tiết
     - ✅ Sử dụng DBeaver GUI
     - ✅ Import từ backup files
     - ✅ Troubleshooting chi tiết
   - **Đọc khi:** Bạn muốn hiểu sâu về database setup

### 2. **QUICK_START_DB.md** (Quick Start - Ngắn gọn)
   - **Dùng cho:** Bạn chỉ cần start nhanh
   - **Nội dung:**
     - ✅ Docker Compose (1 lệnh)
     - ✅ Thủ công nếu không có Docker
     - ✅ Quick checklist
   - **Đọc khi:** Bạn vội vàng hoặc lần đầu tiên

### 3. **DATABASE_SETUP.txt** (Hình ảnh ASCII art)
   - **Dùng cho:** Bạn muốn nhìn thấy diagram
   - **Nội dung:**
     - ✅ Sơ đồ database structure
     - ✅ Connection details
     - ✅ SQL scripts description
     - ✅ ASCII art dễ đọc
   - **Đọc khi:** Bạn thích hình ảnh ASCII

### 4. **IMPORT_DB_SUMMARY.txt** (Tóm tắt siêu ngắn)
   - **Dùng cho:** TL;DR - Chỉ cần biết cách dùng
   - **Nội dung:**
     - ✅ 3 cách import ngắn gọn
     - ✅ Commands chính
     - ✅ Troubleshooting
   - **Đọc khi:** Bạn chỉ cần command

### 5. **DATABASE_IMPORT_QUICK_GUIDE.html** (Web interface)
   - **Dùng cho:** Bạn muốn UI đẹp
   - **Nội dung:**
     - ✅ Beautiful HTML page
     - ✅ Organized sections
     - ✅ Copy-paste friendly
   - **Mở bằng:** Browser (Chrome, Firefox, Edge)
   - **Đọc khi:** Bạn thích giao diện web

### 6. **import-db.bat** (Script Windows)
   - **Dùng cho:** Automatic import on Windows
   - **Nội dung:**
     - ✅ Interactive menu
     - ✅ 6 lựa chọn
     - ✅ Error handling
   - **Chạy:** `.\import-db.bat`

### 7. **import-db.sh** (Script Linux/Mac)
   - **Dùng cho:** Automatic import on Linux/Mac
   - **Nội dung:**
     - ✅ Interactive menu (bash)
     - ✅ 6 lựa chọn
     - ✅ Error handling
   - **Chạy:** `chmod +x import-db.sh && ./import-db.sh`

---

## 🎯 Nên Đọc Cái Nào?

### Bạn muốn làm gì?

| Mục đích | File | Lệnh |
|---------|------|------|
| **Chỉ cần 1 lệnh** | IMPORT_DB_SUMMARY.txt | `docker-compose up -d postgres-db booking-db payment-db` |
| **Quick Start** | QUICK_START_DB.md | Đọc 2-3 phút |
| **Hiểu chi tiết** | DATABASE_IMPORT_GUIDE.md | Đọc 10-15 phút |
| **Nhìn diagram** | DATABASE_SETUP.txt | Đọc 5 phút |
| **Giao diện đẹp** | DATABASE_IMPORT_QUICK_GUIDE.html | Mở trong browser |
| **Tương tác** | import-db.bat hoặc import-db.sh | Chạy script |

---

## ⚡ Nhanh Nhất: Chỉ 1 Lệnh

```bash
# Windows PowerShell
docker-compose up -d postgres-db booking-db payment-db

# Linux/Mac
docker-compose up -d postgres-db booking-db payment-db
```

Đợi ~15 giây. Done! 🎉

---

## 🚀 Các Bước Tiếp Theo

Sau khi import database thành công:

### 1. **Start tất cả backend services**
```bash
docker-compose up -d
```

### 2. **Kiểm tra services**
```bash
docker-compose ps

# Kết quả mong đợi: 8-9 containers running
```

### 3. **Truy cập dashboard**
- Eureka: http://localhost:8761
- API Gateway: http://localhost:8080
- RabbitMQ: http://localhost:15672
- Frontend: http://localhost:3000
- Admin Frontend: http://localhost:5174

### 4. **Test API**
```bash
# Kiểm tra health
curl http://localhost:8080/actuator/health

# Hoặc import Postman collection
# BookingTour.postman_collection.json
```

---

## 📊 Database Ports

| Service | Port | Database |
|---------|------|----------|
| User Service | 5432 | userdb |
| Tour Service | 5432 | tourdb |
| Booking Service | 5433 | bookingdb |
| Payment Service | 5434 | paymentdb |

---

## 💾 Database Credentials

```
Host: localhost
Username: postgres
Password: postgres
```

---

## 🔍 Nếu Có Vấn Đề

1. **Connection refused?**
   ```bash
   docker-compose ps              # Kiểm tra containers
   docker-compose restart          # Restart nếu cần
   ```

2. **Database exists?**
   ```bash
   docker-compose down             # Stop containers
   docker volume prune             # Xóa volumes
   docker-compose up -d            # Start lại
   ```

3. **Cần detail hơn?**
   - Xem: `DATABASE_IMPORT_GUIDE.md` (Troubleshooting section)

---

## 📝 SQL Scripts

| File | Mục đích | Run |
|------|----------|-----|
| `init-databases.sql` | Create userdb + tourdb | Lần đầu |
| `init-booking-db.sql` | Create bookingdb | Lần đầu |
| `init-payment-db.sql` | Create paymentdb | Lần đầu |
| `script_data.sql` | Insert seed data | Optional |

---

## 🎓 Khuyến Nghị

### Cho người mới:
1. Đọc: `QUICK_START_DB.md`
2. Chạy: `docker-compose up -d postgres-db booking-db payment-db`
3. Xong!

### Cho người muốn hiểu:
1. Đọc: `DATABASE_IMPORT_GUIDE.md`
2. Chọn cách phù hợp
3. Thực hiện

### Cho người muốn test:
1. Chạy script: `./import-db.bat` hoặc `./import-db.sh`
2. Chọn menu option
3. Follow instructions

---

## ✅ Checklist Hoàn Chỉnh

- [ ] Docker Compose đã chạy
- [ ] 3 PostgreSQL containers healthy
- [ ] 4 databases tạo thành công
- [ ] Tất cả tables được tạo
- [ ] Kết nối được psql
- [ ] Seed data inserted (optional)
- [ ] ✅ Ready to code!

---

## 📞 Hỗ Trợ

Nếu có vấn đề:
1. Kiểm tra file hướng dẫn tương ứng
2. Xem troubleshooting section
3. Check logs: `docker-compose logs [service-name]`

---

**Bây giờ bạn đã có tất cả tools để import database! 🚀**

Chọn 1 file phù hợp và bắt đầu thôi!

✨ **Recommended:** Chỉ cần `QUICK_START_DB.md` + `docker-compose up`

