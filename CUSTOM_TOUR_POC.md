# 🎯 CUSTOM TOUR - POC (Proof of Concept)

## ✅ Tính năng Custom Tour đã hoàn chỉnh

Custom Tour cho phép khách hàng gửi yêu cầu tùy chỉnh tour theo nhu cầu của họ, sau đó Admin sẽ xem xét và xử lý.

---

## 🔧 KIẾN TRÚC & FLOW

### Database Schema
```sql
-- Table: custom_tours
CREATE TABLE custom_tours (
    custom_tour_id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id),
    tour_name VARCHAR(255) NOT NULL,
    num_adult INTEGER NOT NULL,
    num_children INTEGER NOT NULL,
    region_id BIGINT,
    province_id BIGINT,
    start_date DATE,
    end_date DATE,
    description TEXT,
    status VARCHAR(20) NOT NULL,  -- PENDING, COMPLETED, REJECTED, CANCELLED
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Backend APIs

#### User Endpoints
```
POST   /api/custom-tours?userId={id}
       Body: { tourName, numAdult, numChildren, regionId, provinceId,
               startDate, endDate, description }
       → Tạo custom tour request mới

GET    /api/custom-tours/{id}
       → Xem chi tiết custom tour

GET    /api/custom-tours/user/{userId}
       → Xem tất cả custom tours của user
```

#### Admin Endpoints
```
GET    /api/custom-tours/admin?status={status}&userId={userId}&page={page}
       → Admin xem tất cả requests với filters

PUT    /api/custom-tours/{id}/status
       Body: { status: "COMPLETED" | "REJECTED" | "CANCELLED" }
       → Admin cập nhật trạng thái

DELETE /api/custom-tours/{id}
       → Admin xóa request

GET    /api/custom-tours/stats
       → Thống kê số lượng theo status
```

### Frontend Routes

#### User Frontend (port 3000)
```
/custom-tour-request  → Form gửi yêu cầu tour tùy chỉnh
/my-custom-tours      → Xem danh sách requests của mình
/destinations         → Redirect to /custom-tour-request
```

#### Admin Frontend (port 5174)
```
/custom-tours  → Quản lý tất cả custom tour requests
```

---

## 🚀 HƯỚNG DẪN SỬ DỤNG

### Bước 1: User tạo Custom Tour Request

1. **Truy cập**: http://localhost:3000/custom-tour-request
2. **Đăng nhập** (bắt buộc - cần userId)
3. **Điền form**:
   - Tên tour
   - Số người lớn / trẻ em
   - Chọn Vùng miền
   - Chọn Tỉnh/Thành phố
   - Ngày bắt đầu / kết thúc
   - Mô tả yêu cầu

4. **Submit** → Request được tạo với status = `PENDING`

### Bước 2: User xem lại requests

1. **Truy cập**: http://localhost:3000/my-custom-tours
2. **Xem danh sách** tất cả requests đã gửi
3. **Check status**:
   - 🟡 PENDING - Đang chờ xử lý
   - 🟢 COMPLETED - Đã hoàn thành
   - 🔴 REJECTED - Bị từ chối
   - ⚫ CANCELLED - Đã hủy

### Bước 3: Admin xử lý

1. **Truy cập**: http://localhost:5174/custom-tours
2. **Xem danh sách** tất cả requests
3. **Lọc theo**:
   - Status (PENDING/COMPLETED/REJECTED)
   - User ID
   - Keyword (search)
4. **Xem chi tiết** request
5. **Cập nhật status**:
   - COMPLETED - Đã xử lý xong
   - REJECTED - Từ chối với lý do

---

## 🧪 TEST CASES

### Test Case 1: Tạo Custom Tour thành công
```
Given: User đã đăng nhập (userId = 1)
When: User điền form và submit
Then:
  - Request được tạo với status = PENDING
  - Hiển thị thông báo thành công
  - Redirect về /my-custom-tours
```

### Test Case 2: Validation lỗi ngày
```
Given: User chọn endDate < startDate
When: Submit form
Then: Hiển thị lỗi "End date must be after or equal to start date"
```

### Test Case 3: Validation lỗi startDate quá khứ
```
Given: User chọn startDate trước ngày hiện tại
When: Submit form
Then: Hiển thị lỗi "Start date must be today or in the future"
```

### Test Case 4: Lỗi User không tồn tại (BUG 2 - ĐÃ FIX)
```
Given: userId = 29 không tồn tại trong database
When: Submit form
Then:
  - Hiển thị lỗi rõ ràng: "User ID 29 không tồn tại trong hệ thống"
  - Gợi ý đăng xuất và đăng nhập lại
  - Không bị database constraint error
```

### Test Case 5: Admin duyệt request
```
Given: Admin xem PENDING request
When: Admin click "Approve" và set status = COMPLETED
Then:
  - Status cập nhật thành công
  - User có thể thấy status mới khi xem lại
```

---

## 🐛 BUGS ĐÃ FIX

### Bug 2: Foreign Key Constraint Violation ✅
**Vấn đề**:
- User với userId không tồn tại gửi request → Database reject với error:
  ```
  violates foreign key constraint "custom_tours_user_id_fkey"
  ```

**Solution**:
- ✅ Thêm validation userId trước khi save
- ✅ Catch `DataIntegrityViolationException`
- ✅ Throw error message rõ ràng bằng tiếng Việt
- ✅ Gợi ý user đăng xuất và đăng nhập lại

**Code Fix**: `CustomTourServiceImpl.java` lines 36-84

---

## 📊 STATUS LIFECYCLE

```
┌─────────┐
│ PENDING │  ← Initial state khi user tạo mới
└────┬────┘
     │
     ├──→ COMPLETED   (Admin duyệt và hoàn thành)
     ├──→ REJECTED    (Admin từ chối)
     └──→ CANCELLED   (User hoặc Admin hủy)
```

---

## 🔍 VALIDATION RULES

### Backend Validation
1. ✅ `userId` không null và > 0
2. ✅ `userId` phải tồn tại trong database
3. ✅ `endDate >= startDate`
4. ✅ `startDate >= today`
5. ✅ `tourName` không empty
6. ✅ `numAdult >= 1`
7. ✅ `numChildren >= 0`

### Frontend Validation
1. ✅ Required fields check
2. ✅ Date picker với min/max constraints
3. ✅ Number inputs không cho số âm
4. ✅ Authentication check (phải login mới submit được)

---

## 📁 FILES LIÊN QUAN

### Backend
- `CustomTour.java` - Entity model
- `CustomTourController.java` - REST endpoints
- `CustomTourService.java` - Service interface
- `CustomTourServiceImpl.java` - Business logic (✅ ĐÃ FIX BUG 2)
- `CustomTourRepository.java` - Data access
- `CustomTourResponse.java` - DTO response
- `CreateCustomTourRequest.java` - DTO request

### Frontend User
- `CustomTourRequest.jsx` - Form tạo request
- `MyCustomTours.jsx` - List requests của user
- `customTourService.js` - API client

### Frontend Admin
- `CustomTourList.jsx` - Quản lý tất cả requests
- `CustomTourDetailModal.jsx` - Modal xem chi tiết
- `customTourService.js` - API client (admin)

---

## ✨ FEATURES NÂNG CAO (Có thể thêm)

### Phase 2 - Enhancement Ideas
1. 📧 Email notification khi status thay đổi
2. 💬 Chat/Comment giữa user và admin
3. 💰 Quote giá tự động dựa trên yêu cầu
4. 📎 Upload hình ảnh tham khảo
5. 🗓️ Calendar view cho admin
6. 📊 Analytics & reporting
7. 🔔 Real-time notifications (WebSocket)
8. 📱 Mobile responsive improvements

---

## 🎓 LESSON LEARNED

1. **Foreign Key Constraints**: Luôn validate referenced entities trước khi insert
2. **Error Messages**: User-friendly errors bằng tiếng mẹ đẻ quan trọng hơn technical errors
3. **Transaction Handling**: Wrap database operations trong try-catch để handle constraints
4. **Authentication Flow**: Cần clear expired sessions khi user bị xóa khỏi database

---

## ✅ CHECKLIST - Custom Tour READY FOR PRODUCTION

- [x] Backend APIs hoạt động
- [x] Frontend UI hoàn chỉnh
- [x] Database schema đúng
- [x] Validation đầy đủ
- [x] Error handling tốt
- [x] Bug fixes applied
- [x] POC document
- [ ] Unit tests (TODO)
- [ ] Integration tests (TODO)
- [ ] Email notifications (TODO)
- [ ] Admin analytics (TODO)

---

**Last Updated**: 2025-11-20
**Status**: ✅ FULLY FUNCTIONAL
