# 🐛 BUG REPORT - BookingTour System

**Ngày test:** 15/11/2025  
**Tester:** AI Testing Agent  
**Status:** 🔴 1 Critical Bug Found

---

## ❌ BUG #1: Reviews Không Hiển Thị - Empty State Sai

### Thông tin
- **Severity:** 🔴 CRITICAL
- **URL:** http://localhost:3000/tours/e2e-test-tour---complete-workflow
- **Module:** Client Frontend - Tour Detail - Reviews Tab

### Mô tả
Click tab "Đánh giá" → Hiển thị **"Chưa có đánh giá cho tour này"** nhưng thực tế backend có **3 reviews APPROVED**.

### Steps to reproduce
1. Vào http://localhost:3000/tours/e2e-test-tour---complete-workflow
2. Click tab "Đánh giá"
3. Kết quả: "Chưa có đánh giá cho tour này" ❌

### Evidence
**Backend có data:**
- Review #1: User 1, 4.5⭐, APPROVED
- Review #34: User 3, 5.0⭐, APPROVED
- Review #43: User 999, 4.5⭐, APPROVED

**Frontend hiển thị:**
```
Nhận xét xác thực từ du khách đã trải nghiệm cùng BookingTour.

Chưa có đánh giá cho tour này
Hãy là người đầu tiên đánh giá!
```

### Nguyên nhân có thể
1. ❌ API call failed (404, 500, CORS)
2. ❌ API endpoint sai
3. ❌ Response data format không match
4. ❌ tourId/slug mapping sai
5. ❌ Empty array được trả về

### Debug steps
```bash
# 1. Check API call
curl http://localhost:8080/api/reviews/approved/tour/56
# hoặc
curl http://localhost:8080/api/reviews/approved/tour/e2e-test-tour---complete-workflow

# 2. Check browser console
# Mở DevTools > Console > Xem errors

# 3. Check Network tab
# DevTools > Network > Filter XHR > Click tab "Đánh giá"
# Xem request URL và response
```

### Fix đề xuất
```javascript
// File: client/src/pages/TourDetail.jsx

// 1. Đảm bảo dùng đúng tourId (numeric ID, không phải slug)
const fetchReviews = async () => {
  try {
    // Dùng tourId (56) thay vì slug
    const response = await fetch(
      `http://localhost:8080/api/reviews/approved/tour/${tour.id}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Reviews data:', data); // Debug
    setReviews(data);
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};

// 2. Gọi khi có tourId
useEffect(() => {
  if (activeTab === 'reviews' && tour?.id) {
    fetchReviews();
  }
}, [activeTab, tour?.id]);
```

### Impact
- ❌ Users không thấy reviews → Mất social proof
- ❌ Giảm conversion rate
- ❌ Review system không hoạt động trên client

---

## ✅ VERIFIED FIXES

### ✅ Bug #2: Booking Detail Loading Mãi - FIXED
- **URL:** http://localhost:5174/bookings/31
- **Status:** ✅ FIXED
- **Result:** Booking detail hiển thị đầy đủ thông tin:
  - Guest profile: kien kien (User ID 1)
  - Financial summary: 20.000 ₫
  - Timeline: Booking created, Seat reservation, Payment processing
  - Không còn stuck ở loading state

---

## 📊 SUMMARY

| Status | Count | Details |
|--------|-------|---------|
| ❌ Critical Bugs | 1 | Reviews không hiển thị |
| ✅ Fixed Bugs | 1 | Booking detail loading |
| ✅ Working Features | 10+ | Admin panel, Tours, Departures, etc. |

### Test Coverage
- ✅ Admin Login & Dashboard
- ✅ Admin Booking Detail (Fixed)
- ✅ Client Tour Detail Page
- ❌ Client Reviews (Bug found)

---

## 🎯 ACTION REQUIRED

**Priority P0 - Fix ngay:**
1. Fix Reviews API call trên client
2. Verify tourId vs slug mapping
3. Test lại reviews hiển thị

**Estimated fix time:** 2-3 giờ

---

*Report generated: 15/11/2025*

