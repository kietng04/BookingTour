# 🧪 HƯỚNG DẪN TEST TOÀN BỘ FLOW

## ✅ **ĐÃ FIX XONG:**
1. ✅ Foreign key constraint đã xóa (custom_tours không còn FK đến users)
2. ✅ Frontend-admin API URL đã fix (gọi đúng http://localhost:8080/api)
3. ✅ Date validation đã fix (cho phép tạo tour từ hôm nay)

---

## 📋 **BƯỚC TEST CHI TIẾT:**

### **BƯỚC 1: TẠO USER MỚI (http://localhost:3000)**

1. Mở: **http://localhost:3000/auth/login**
2. Click nút **"Đăng ký ngay"** (ở dưới form login)
3. Điền thông tin:
   - **Username**: `testuser2024`
   - **Email**: `testuser2024@gmail.com`
   - **Password**: `password123`
   - **Full Name**: `Test User 2024`
4. Click **"Đăng ký"**
5. ✅ Nếu thành công → Tự động đăng nhập

**LƯU Ý:** Nếu đã có user, dùng:
- Username: `pvk210504` 
- Password: `1` (hoặc thử password khác)

---

### **BƯỚC 2: TẠO CUSTOM TOUR**

1. Sau khi đăng nhập, vào: **http://localhost:3000/custom-tour-request**
2. Điền form:
   - **Tên tour**: `Test Custom Tour from Browser 2024`
   - **Ngày khởi hành**: `2025-11-21` (chọn từ date picker)
   - **Ngày kết thúc**: `2025-11-24`
   - **Số người lớn**: `2`
   - **Số trẻ em**: `1`
   - **Khu vực**: Chọn `Miền Bắc`
   - **Tỉnh/Thành phố**: Chọn `Hà Nội`
   - **Mô tả**: `Muốn khám phá văn hóa Hà Nội, có trẻ nhỏ đi cùng`
3. Click **"Gửi yêu cầu"**
4. ✅ Alert xuất hiện: "Yêu cầu tour tùy chỉnh đã được gửi thành công!"
5. ✅ Redirect đến: **http://localhost:3000/my-custom-tours**
6. ✅ Thấy custom tour vừa tạo trong danh sách

---

### **BƯỚC 3: XEM TRONG ADMIN**

1. Mở tab mới: **http://localhost:5174**
2. Đăng nhập admin:
   - **Email**: `admin@gmail.com`
   - **Password**: `admin`
3. Click menu **"Tour tùy chỉnh"** (sidebar trái)
4. ✅ **KIỂM TRA:** Thấy custom tour vừa tạo hiển thị:
   - Tên: `Test Custom Tour from Browser 2024`
   - Trạng thái: `Đang chờ` (PENDING)
   - User: Hiển thị user ID
   - Ngày: 21/11/2025 - 24/11/2025
   - Số khách: 2 người lớn, 1 trẻ em

---

## 🎯 **KẾT QUẢ MONG ĐỢI:**

### ✅ **Frontend User:**
- Tạo được custom tour thành công
- Thấy tour trong "Tour Tùy Chỉnh Của Tôi"
- Status: Đang xử lý (PENDING)

### ✅ **Frontend Admin:**
- **API gọi đúng:** `http://localhost:8080/api/custom-tours/admin`
- **Hiển thị đầy đủ:** Tất cả custom tours từ database
- **Có thể filter:** Theo trạng thái (Tất cả, Đang chờ, Đã duyệt, Từ chối)
- **Có action buttons:** Xem chi tiết, Duyệt, Từ chối

---

## 🔍 **CÁCH KIỂM TRA DATABASE (Optional):**

```bash
# Check trong database
wsl docker exec -it postgres-db psql -U postgres -d tourdb

# Run query
SELECT custom_tour_id, user_id, tour_name, start_date, end_date, status, created_at 
FROM custom_tours 
ORDER BY created_at DESC 
LIMIT 5;

# Exit
\q
```

---

## ❌ **NẾU GẶP LỖI:**

### **Lỗi 1: "User ID không tồn tại"**
**Nguyên nhân:** Chưa đăng nhập hoặc token hết hạn  
**Fix:** Đăng xuất và đăng nhập lại

### **Lỗi 2: Admin không hiển thị tour**
**Nguyên nhân:** API call lỗi hoặc frontend-admin chưa rebuild  
**Fix:** 
```bash
wsl docker-compose restart frontend-admin
# Đợi 10s rồi refresh browser (Ctrl + Shift + R)
```

### **Lỗi 3: "Start date must be in the future"**
**Nguyên nhân:** Đã fix nhưng tour-service chưa rebuild  
**Fix:**
```bash
wsl docker-compose restart tour-service
```

---

## 📊 **SUMMARY:**

| Step | URL | Action | Expected Result |
|------|-----|--------|----------------|
| 1 | http://localhost:3000/auth/login | Đăng ký/Login | ✅ Redirect to home |
| 2 | http://localhost:3000/custom-tour-request | Tạo custom tour | ✅ Alert success |
| 3 | http://localhost:3000/my-custom-tours | Xem tour của mình | ✅ Thấy tour mới |
| 4 | http://localhost:5174 | Login admin | ✅ Vào dashboard |
| 5 | http://localhost:5174/custom-tours | Xem tất cả tours | ✅ Thấy tất cả tours |

---

## 🎉 **HOÀN THÀNH!**

Nếu tất cả các bước trên OK → **Flow hoạt động hoàn hảo!** 🚀

**Có vấn đề gì không? Báo cho tôi biết!** 💬





