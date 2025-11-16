# BookingTour – Bug Report

## Environment
- Commit: current working tree (2025-11-16)
- Stack: Docker Compose (PostgreSQL, microservices) + Vite admin (`http://localhost:5174`)
- Admin credentials: `admin@gmail.com` / `admin`

---

## 1. Departure creation rejects 1-day range for multi-day tours

**Location**: `frontend-admin/src/components/departures/DepartureForm.jsx` (`validateEndDate`, lines ~96-139) and backend `POST /api/tours/{tourId}/departures`

**Severity**: High (blocker for configuring custom departures)

**Reproduction**
1. `docker compose up -d`
2. Login at `http://localhost:5174/auth/login` with the default admin.
3. Navigate `Chuyến đi → Add Departure`.
4. Chọn tour “Hành trình Hà Nội - Hạ Long 3N2Đ”.
5. Điền `Ngày bắt đầu = 2025-11-17`, manually sửa `Ngày kết thúc = 2025-11-17`, `Tổng số chỗ = 20`, bấm **Tạo chuyến đi**.

**Actual**
- Form không submit, hiển thị toast/validation:  
  `Tour này là 3 ngày 2 đêm. Với ngày bắt đầu 17/11/2025, ngày kết thúc phải là 19/11/2025.`
- Không có request gửi đi. Nếu gửi trực tiếp (`curl -X POST http://localhost:8080/api/tours/1/departures …`) thì tour-service trả `400 Bad Request` với body rỗng.
- Console log: `Admin API Error (/tours/1/departures): Error: Bad Request`.

**Expected**
- Cho phép tạo departure 1N nếu business chấp nhận, hoặc ít nhất backend trả message rõ ràng được hiển thị thay vì chặn cứng ở UI.

**Notes**
- Validation ở UI luôn ép endDate = startDate + (tour.days - 1) và reject mọi giá trị khác, nên người dùng không thể tạo lịch linh hoạt. Backend cũng áp cùng rule nhưng response thiếu thông tin, dẫn đến “UI invalid + 400” đúng log người dùng gửi.

---

## 2. Departure detail page crashes when bookings exist

**Location**: `frontend-admin/src/pages/Departures/DepartureDetail.jsx` (columns renderers around line 89) + `src/components/common/Table.jsx`

**Severity**: High (page unusable when data present)

**Reproduction**
1. Seed booking (ví dụ:  
   `curl -X POST http://localhost:8080/api/bookings -H 'Content-Type: application/json' -d '{"userId":1,"tourId":1,"departureId":1,"seats":2,"totalAmount":7780000,"paymentOverride":"SUCCESS"}'`)
2. Trong admin, mở `Chuyến đi`, click **View Details** cho departure ID 1 (có booking ở bước 1).

**Actual**
- React crash ngay lập tức. Console:  
  `TypeError: Cannot read properties of undefined (reading 'bookingId')`  
  Stack points to `DepartureDetail.jsx:94` → `Table.jsx:23`.
- Trang trắng, không hiển thị thông tin.

**Expected**
- Trang chi tiết hiển thị bảng booking (booking id, user, seats, amount, status) bình thường.

**Notes**
- `Table` gọi `column.render(row[column.key], row)` nhưng các column trong `DepartureDetail` đọc trực tiếp `row.bookingId`, `row.userId`, …; đồng thời dữ liệu REST trả `id`, `userId`, `numSeats`, … chứ không có `bookingId`. Khi `row[column.key]` undefined, render function truy cập `bookingId` → TypeError.

---
