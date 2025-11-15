# 🐛 BUG REPORT - BookingTour System

**Ngày test:** 15/11/2025  
**Tester:** AI Testing Agent  
**Status:** 🔴 3 CRITICAL BUGS FOUND

---

## 🔴 CRITICAL BUGS

### 🔴 BUG #1: Admin Review Filter Không Hoạt Động

#### Thông tin
- **Severity:** 🔴 HIGH
- **URL:** http://localhost:5174/reviews
- **Module:** Admin Frontend - Review Management

#### Mô tả
Filter "Trạng thái" trên trang quản lý reviews không hoạt động. Khi chọn "Chờ duyệt", vẫn hiển thị tất cả reviews (bao gồm "Đã duyệt" và "Từ chối").

#### Steps to Reproduce
1. Login admin → http://localhost:5174/reviews
2. Click dropdown "Tất cả trạng thái"
3. Chọn "Chờ duyệt"
4. ❌ Kết quả: Vẫn hiển thị tất cả reviews (11 reviews)
5. ✅ Mong đợi: Chỉ hiển thị reviews có status "Chờ duyệt" (5 reviews)

#### Evidence
```
Trước filter: 11 reviews (Chờ duyệt + Đã duyệt + Từ chối)
Sau filter "Chờ duyệt": Vẫn 11 reviews ❌
```

#### Nguyên nhân
- Filter state không trigger API call
- Hoặc API không nhận filter params
- Frontend không filter client-side

#### Impact
- 🔴 Admin không thể lọc reviews theo trạng thái
- Khó quản lý khi có nhiều reviews
- Ảnh hưởng workflow moderation

---

### 🔴 BUG #2: Client Tour List Không Hiển Thị Tours

#### Thông tin
- **Severity:** 🔴 CRITICAL
- **URL:** http://localhost:3000/tours
- **Module:** Client Frontend - Tour Listing

#### Mô tả
Trang tour listing không hiển thị tour nào, mặc dù Admin có 10+ tours trong database.

#### Steps to Reproduce
1. Vào http://localhost:3000/tours
2. ❌ Kết quả: Không có tour nào hiển thị
3. ✅ Mong đợi: Hiển thị danh sách tours

#### Evidence
```
Page: http://localhost:3000/tours
Content: 
- Bộ lọc: ✅ Hiển thị
- Tour cards: ❌ Không có
- Pagination: ✅ Hiển thị (Page 1)
```

#### Nguyên nhân
- API call failed
- Tours không match filter criteria
- Frontend không render tours
- Có thể do tours status = INACTIVE

#### Impact
- 🔴 CRITICAL: Khách hàng không thể xem tours
- Hệ thống không sử dụng được
- Blocking toàn bộ booking flow

---

### 🔴 BUG #3: Client Tour Detail Không Load

#### Thông tin
- **Severity:** 🔴 CRITICAL
- **URL:** http://localhost:3000/tours/56, http://localhost:3000/tours/55
- **Module:** Client Frontend - Tour Detail

#### Mô tả
Tất cả tour detail pages đều không load, hiển thị error "Không tìm thấy tour".

#### Steps to Reproduce
1. Vào http://localhost:3000/tours/56
2. Wait 4 seconds
3. ❌ Kết quả: "Không tìm thấy tour - Không thể tải chi tiết tour"
4. Thử tour khác: http://localhost:3000/tours/55
5. ❌ Kết quả: Same error

#### Evidence
```
URL: http://localhost:3000/tours/56
Error: "Không tìm thấy tour"
Message: "Không thể tải chi tiết tour. Vui lòng thử lại."

Tested tours: 56, 55 → All failed
```

#### Nguyên nhân
- API endpoint không hoạt động
- Tour IDs không tồn tại trong client API
- CORS issue
- Client API URL sai

#### Impact
- 🔴 CRITICAL: Không thể xem chi tiết tour
- Không thể booking
- Blocking toàn bộ user flow

---

## ⚠️ MINOR BUG (From Previous Report)

### ⚠️ BUG #4: Tên Người Đánh Giá Hiển Thị "undefined"

#### Thông tin
- **Severity:** ⚠️ MINOR (UI Issue)
- **Status:** Still present (if tour detail worked)

---

## 📊 SUMMARY

| Status | Count | Details |
|--------|-------|---------|
| 🔴 Critical | 3 | Review filter, Tour list, Tour detail |
| ⚠️ Minor | 1 | Guest name "undefined" |
| ✅ Working | 10+ | Admin modules (except review filter) |

### Admin Panel Test Results
| Module | Status | Notes |
|--------|--------|-------|
| Dashboard | ✅ PASS | Stats, charts OK |
| Tours | ✅ PASS | List, filters, pagination OK |
| Departures | ✅ PASS | List, filters OK |
| Bookings | ✅ PASS | List, detail, filters OK |
| Reviews | ⚠️ PARTIAL | List OK, **filter broken** |
| Users | ✅ PASS | List, activate/deactivate OK |

### Client Frontend Test Results
| Module | Status | Notes |
|--------|--------|-------|
| Homepage | ✅ PASS | Hero, features OK |
| Tour List | 🔴 FAIL | **No tours displayed** |
| Tour Detail | 🔴 FAIL | **All tours fail to load** |
| Reviews | ⚠️ N/A | Can't test (tour detail broken) |
| Booking | ⚠️ N/A | Can't test (tour detail broken) |

---

## 🎯 PRIORITY FIXES

### P0 - CRITICAL (Must Fix)
1. **Fix Tour List API** - Tours không hiển thị
2. **Fix Tour Detail API** - Tour detail không load
3. **Fix Review Filter** - Filter không hoạt động

### P1 - Minor
4. Fix guest name "undefined" display

---

## 🔍 DEBUG RECOMMENDATIONS

### For Bug #2 & #3 (Tour Issues)
```bash
# Check API Gateway
curl http://localhost:8080/api/tours

# Check Tour Service directly
curl http://localhost:8082/api/tours

# Check tour status in database
# Có thể tours đều INACTIVE → Client không hiển thị
```

### For Bug #1 (Review Filter)
```javascript
// Check if filter params sent to API
// Frontend: admin/src/pages/ReviewsPage.jsx
// Backend: tour-service ReviewController
```

---

## 📝 SYSTEM STATUS

**Overall Status:** 🔴 **NOT READY FOR PRODUCTION**

**Blocking Issues:**
- Client frontend hoàn toàn không sử dụng được
- Không thể xem tours
- Không thể booking
- Admin review filter broken

**Working Features:**
- ✅ Admin dashboard
- ✅ Admin tour management
- ✅ Admin booking management
- ✅ Admin user management
- ⚠️ Admin review management (partial)

---

*Report created: 15/11/2025 - Comprehensive testing completed*
