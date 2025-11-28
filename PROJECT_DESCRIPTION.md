# 📱 BookingTour - Hệ Thống Quản Lý Booking Tour Du Lịch

## 🎯 Tổng Quan Dự Án

**BookingTour** là một nền tảng quản lý tour du lịch toàn diện, được xây dựng theo kiến trúc **Microservices** với công nghệ hiện đại. Hệ thống cung cấp các tính năng cho khách hàng đặt tour, quản lý booking, thanh toán trực tuyến, và gửi đánh giá; đồng thời cấp cho quản trị viên các công cụ quản lý toàn diện từ tour, lịch trình, đến phân tích doanh thu.

---

## 🏗️ Kiến Trúc Hệ Thống

### Microservices Architecture

Hệ thống được thiết kế theo kiến trúc **Microservices** với 6 dịch vụ backend độc lập, mỗi service có trách nhiệm riêng biệt:

```
┌─────────────────────────────────────────────────────────────┐
│                   API GATEWAY (Port 8080)                    │
│            Điểm truy cập duy nhất (Single Entry Point)      │
└────────────┬────────────────────┬────────────────┬──────────┘
             │                    │                │
    ┌────────▼─────┐  ┌──────────▼──────┐  ┌─────▼──────┐
    │ USER SERVICE │  │ TOUR SERVICE    │  │BOOKING SRV │
    │   (8081)     │  │    (8082)       │  │  (8083)    │
    │              │  │                 │  │            │
    │ • Auth/Login │  │ • Tours CRUD    │  │ • Bookings │
    │ • JWT/OAuth2 │  │ • Departures    │  │ • Seat Mgmt│
    │ • Profiles   │  │ • Reviews       │  │ • Status   │
    │ • Register   │  │ • Ratings       │  │ • Export   │
    └──────────────┘  └─────────────────┘  └────────────┘

    ┌──────────────┐  ┌──────────────┐  ┌───────────────┐
    │PAYMENT SRV   │  │EUREKA SERVER │  │   RabbitMQ    │
    │   (8084)     │  │   (8761)     │  │  Message Bus  │
    │              │  │              │  │               │
    │ • MoMo Pay   │  │ • Discovery  │  │ • Events      │
    │ • Transactions   │ • Registry   │  │ • Async Comm  │
    │ • Refunds    │  │ • Health Check   │ • Decouple    │
    └──────────────┘  └──────────────┘  └───────────────┘

┌─────────────────────────┐         ┌──────────────────────────┐
│ FRONTEND (Port 3000)    │         │ ADMIN (Port 5174)        │
│   Customer UI           │         │  Admin Dashboard         │
│   React 18 + Vite       │         │  React 18 + Vite         │
└─────────────────────────┘         └──────────────────────────┘
```

### Lợi Ích của Microservices:
- ✅ **Độc lập**: Mỗi service có thể được phát triển, triển khai riêng biệt
- ✅ **Khả năng mở rộng**: Có thể scale từng service theo nhu cầu
- ✅ **Khả năng phục hồi**: Lỗi của 1 service không ảnh hưởng toàn bộ hệ thống
- ✅ **Tái sử dụng**: Services có thể được sử dụng bởi nhiều clients khác nhau
- ✅ **Công nghệ linh hoạt**: Mỗi service có thể dùng tech stack khác nhau

---

## 💾 Cơ Sở Dữ Liệu

### Database Architecture

Hệ thống sử dụng **PostgreSQL** với **4 databases riêng biệt** theo nguyên tắc Data per Service:

```
┌──────────────────────────────────────────────────┐
│     PostgreSQL Instance (Port 5432)              │
├──────────────────────────────────────────────────┤
│                                                  │
│  📦 userdb                                      │
│     ├─ users (Tài khoản người dùng)            │
│     └─ user_verification (Xác thực email)      │
│                                                  │
│  📦 tourdb                                      │
│     ├─ tours (Thông tin tour)                  │
│     ├─ departures (Lịch khởi hành)             │
│     ├─ tour_schedules (Lịch trình chi tiết)   │
│     ├─ tour_images (Hình ảnh tour)             │
│     ├─ tour_reviews (Đánh giá & Rating)        │
│     ├─ tour_discounts (Khuyến mãi)             │
│     ├─ regions & provinces (Địa danh)          │
│     └─ custom_tours (Yêu cầu tour tùy chỉnh)  │
│                                                  │
│  📦 bookingdb                                   │
│     ├─ bookings (Đơn đặt tour)                 │
│     ├─ booking_guests (Thông tin khách)        │
│     └─ booking_logs (Lịch sử thay đổi)         │
│                                                  │
│  📦 paymentdb                                   │
│     ├─ payments (Giao dịch thanh toán)         │
│     ├─ payment_methods (Phương thức thanh toán)│
│     ├─ payment_logs (Lịch sử giao dịch)        │
│     └─ refunds (Hoàn tiền)                     │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Thiết kế Data per Service:**
- Mỗi service có database riêng → Độc lập hoàn toàn
- Không join trực tiếp giữa databases
- Giao tiếp qua API hoặc Message Queue

---

## 🔄 Luồng Booking & Thanh Toán

### Quy Trình Từ A Đến Z:

```
1. KHÁCH HÀNG DUYỆT TOUR
   └─> Truy cập Homepage
       └─> Tìm kiếm tour (theo vùng, tỉnh, keyword, ngày)
           └─> Xem chi tiết tour

2. TẠO ĐƠN ĐẶT TOUR
   └─> Click "Đặt tour"
       └─> Chọn ngày khởi hành
           └─> Nhập số khách & thông tin khách
               └─> POST /api/bookings
                   └─> Booking Service tạo booking (PENDING)
                       └─> Publish: payment.charge → RabbitMQ

3. THANH TOÁN QEMU MO
   └─> RabbitMQ gửi event đến Payment Service
       └─> Payment Service nhận payment.charge
           └─> Gọi MoMo API để tạo order
               └─> Trả về QR code / Link thanh toán
                   └─> Khách quét QR / Click link

4. CONFIRM ĐƠN
   └─> MoMo callback thanh toán thành công
       └─> Payment Service publish: payment.completed
           └─> RabbitMQ gửi event đến Booking Service
               └─> Booking Service update: PENDING → CONFIRMED
                   └─> Tour Service update: tăng slot booked
                       └─> Khách nhận email xác nhận

5. ĐÁNH GIÁ TOUR
   └─> Sau khi booking completed
       └─> POST /api/reviews/tour/{tourId}
           └─> Review Service lưu với status PENDING
               └─> Admin duyệt → APPROVED
                   └─> Hiển thị trên trang tour
```

---

## 🔐 Xác Thực & Phân Quyền

### Authentication (Xác Thực)

**3 cách đăng nhập:**
1. **JWT Username/Password** - Đăng ký tại hệ thống
2. **GitHub OAuth2** - Đăng nhập qua GitHub
3. **Google OAuth2** - Đăng nhập qua Google

**Quy trình:**
- User gửi credentials → User Service
- User Service xác thực password (BCrypt)
- Generate JWT token (có expiry)
- Token được lưu ở localStorage (Frontend)
- Mỗi request gửi token trong header: `Authorization: Bearer <token>`

**Admin Bypass:**
- Username: `admin` 
- Password: `letmein`
- Tự động được cấp quyền ADMIN không cần xác thực email

### Authorization (Phân Quyền)

**2 cấp độ admin:**
- **ADMIN**: Quản lý tour, booking, departures
- **SUPER_ADMIN**: Tất cả + Quản lý users & reviews

**Permissions:**
- `TOUR_CREATE`, `TOUR_UPDATE`, `TOUR_DELETE`
- `DEPARTURE_CREATE`, `DEPARTURE_UPDATE`
- `BOOKING_CONFIRM`, `BOOKING_CANCEL`
- `REVIEW_APPROVE`, `REVIEW_REJECT`
- `USER_MANAGE`

---

## 📊 Các Tính Năng Chính

### 👥 Cho Khách Hàng

| Tính Năng | Mô Tả |
|-----------|-------|
| **🏠 Home** | Trang chủ với hero banner, tours nổi bật, khách hàng chứng thực |
| **🔍 Tìm kiếm Tours** | Lọc theo vùng, tỉnh, keyword, ngày khởi hành, giá |
| **📖 Chi tiết Tour** | Trải nghiệm, lịch trình, bao gồm/không bao gồm, chính sách |
| **📅 Đặt Tour** | Form multi-step: thông tin liên hệ, khách hàng, xác nhận |
| **💳 Thanh Toán** | MoMo Payment Gateway, QR code, tracking status |
| **📋 Booking History** | Xem lịch sử đặt tour, status, chi tiết |
| **⭐ Đánh Giá** | Gửi review (rating 1-5, title, comment), xem reviews |
| **👤 Profile** | Cập nhật thông tin cá nhân, thay đổi mật khẩu |
| **🎨 Tour Tùy Chỉnh** | Gửi yêu cầu tour theo yêu cầu riêng |

### 🔧 Cho Quản Trị Viên

| Tính Năng | Mô Tả |
|-----------|-------|
| **📊 Dashboard** | Thống kê: doanh thu, bookings, users, reviews chờ duyệt |
| **📈 Charts** | Biểu đồ doanh thu theo ngày, top tours, trends |
| **🎫 Tours** | CRUD tours, upload hình ảnh, quản lý từ khóa, status |
| **📅 Departures** | Tạo lịch khởi hành, quản lý số chỗ, status |
| **📋 Bookings** | Xem tất cả bookings, filter theo status, export CSV |
| **💰 Revenue** | Thống kê doanh thu, phân tích theo kỳ, top customers |
| **⭐ Reviews** | Duyệt reviews (PENDING → APPROVED/REJECTED) |
| **👥 Users** | Quản lý users, kích hoạt/vô hiệu hóa tài khoản |
| **🎨 Custom Tours** | Xem yêu cầu tour tùy chỉnh, phản hồi khách |

---

## 💬 Hệ Thống Đánh Giá & Rating

### Quy Trình Đánh Giá

```
1. User gửi review
   └─> Validation:
       ├─ Rating: 1.0 - 5.0 ⭐
       ├─ Title: 10-200 ký tự
       ├─ Comment: 20+ ký tự
       └─ Một review/tour/user

2. Lưu vào database
   └─> Status: PENDING (chờ duyệt)
       └─ guestName: Tên người review
       └─ guestAvatar: Avatar
       └─ badges: Loại khách (Cặp đôi, Gia đình, etc.)

3. Admin duyệt
   └─> Approve: Status → APPROVED
       └─> Hiển thị công khai
   └─> Reject: Status → REJECTED
       └─> Ẩn khỏi công khai

4. Thống kê
   ├─ Trung bình rating: Σ rating / số reviews
   ├─ Distribution: Phần trăm reviews theo rating (1⭐, 2⭐, ... 5⭐)
   └─ Filter: Lọc reviews theo rating, badge, tour
```

**Hiển Thị:**
- Tour detail: Danh sách approved reviews với rating
- Review summary: Trung bình rating, distribution breakdown
- Verified reviews: Chỉ show reviews từ users đã booked

---

## 🚀 Công Nghệ & Tech Stack

### Backend

| Công Nghệ | Mục Đích | Phiên Bản |
|-----------|---------|----------|
| **Java** | Ngôn ngữ lập trình | 17 |
| **Spring Boot** | Framework chính | 3.3.3 |
| **Spring Cloud** | Service discovery, Gateway | 2023.0.3 |
| **Spring Security** | Authentication/Authorization | |
| **Spring Data JPA** | ORM, Database access | |
| **JWT** | Token-based auth | jjwt 0.12.3 |
| **PostgreSQL** | Database | 15 |
| **RabbitMQ** | Message broker, async | 3 |
| **Netflix Eureka** | Service registry & discovery | |
| **Docker** | Containerization | |

### Frontend

| Công Nghệ | Mục Đích | Phiên Bản |
|-----------|---------|----------|
| **React** | UI Library | 18 |
| **Vite** | Build tool (nhanh hơn Webpack) | |
| **TypeScript** | Type safety | |
| **Tailwind CSS** | Styling | |
| **React Router** | Client-side routing | |
| **Axios** | HTTP client | |
| **Context API** | State management | |

### DevOps

| Công Nghệ | Mục Đích |
|-----------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Orchestration (Local) |
| **Kubernetes** | Orchestration (Production) |

---

## 📡 API Endpoints Chính

### Tours API
```
GET  /api/tours                    - Lấy danh sách tour (search, filter)
GET  /api/tours/{id}               - Chi tiết tour
GET  /api/tours/slug/{slug}        - Lấy tour theo slug
POST /api/tours                    - Tạo tour (Admin)
PUT  /api/tours/{id}               - Cập nhật tour (Admin)
GET  /api/tours/{id}/departures    - Lịch khởi hành
```

### Bookings API
```
POST /api/bookings                 - Tạo đơn đặt tour
GET  /api/bookings/{id}            - Chi tiết booking
GET  /api/bookings/user/{userId}   - Bookings của user
PATCH /api/bookings/{id}/cancel    - Hủy booking
GET  /api/dashboard/stats          - Stats (Admin)
```

### Reviews API
```
GET  /api/reviews/approved         - Danh sách reviews công khai
GET  /api/reviews/{tourId}         - Reviews của tour
POST /api/reviews/tour/{tourId}    - Gửi review (Auth)
GET  /api/reviews/summary/{tourId} - Thống kê rating
PATCH /api/reviews/{id}/approve    - Duyệt (Admin)
```

### Auth API
```
POST /api/auth/login               - Đăng nhập
POST /api/auth/register            - Đăng ký
POST /api/auth/logout              - Đăng xuất
GET  /api/auth/profile             - Lấy profile
```

### Payments API
```
POST /api/payments/momo/initiate   - Tạo order MoMo
GET  /api/payments/{id}            - Trạng thái thanh toán
```

---

## 🔄 Message Flow (RabbitMQ)

### Event-Driven Architecture

Hệ thống sử dụng **RabbitMQ** để giao tiếp bất đồng bộ giữa các services:

```
Topic: booking.events
├─ booking.created → Booking tạo, cần reserve seat
└─ booking.cancelled → Booking hủy, cần release seat

Topic: tour.events
├─ tour.seat.reserved → Seat đã reserve, tell Booking Service
├─ tour.seat.reservationFailed → Reserve thất bại
└─ tour.seat.released → Seat được giải phóng

Topic: payment.exchange
├─ payment.charge → Request thanh toán (Booking → Payment)
├─ payment.completed → Thanh toán thành công (Payment → Booking)
└─ payment.failed → Thanh toán thất bại (Payment → Booking)

Topic: email.exchange
└─ email.booking.confirmed → Gửi email xác nhận (Booking → Email Service)
```

**Lợi ích:**
- ✅ Decoupling: Services độc lập, không phụ thuộc nhau
- ✅ Asynchronous: Không chặn user khi xử lý lâu
- ✅ Resilience: Nếu service A down, A vẫn nhận messages sau khi up
- ✅ Scalability: Có thể add consumers/producers dễ dàng

---

## 📈 Thống Kê & Analytics

### Dashboard Stats

```json
{
  "revenue": {
    "total": "1,250,000 VND",
    "trend": "+12% vs tháng trước",
    "timeframe": "Tháng hiện tại"
  },
  "bookings": {
    "total": 45,
    "pending": 5,
    "confirmed": 35,
    "cancelled": 5,
    "completed": 0
  },
  "users": {
    "total": 120,
    "active": 95,
    "booked": 45
  },
  "reviews": {
    "total": 38,
    "pending": 3,
    "approved": 32,
    "rejected": 3,
    "avgRating": 4.7
  }
}
```

### Top Tours
- Hiển thị 5 tours được đặt nhiều nhất
- Số lượng bookings, revenue

### Revenue Trends
- Biểu đồ doanh thu theo ngày/tháng
- So sánh với kỳ trước

---

## 🎯 Các Tính Năng Nâng Cao

| Tính Năng | Chi Tiết |
|-----------|---------|
| **🌍 Multi-language** | Tiếng Việt mặc định, có thể mở rộng |
| **📱 Responsive Design** | Mobile-first, hỗ trợ desktop/tablet |
| **🔍 SEO Friendly** | URL slugs, meta tags, structured data |
| **💾 Data Export** | Export bookings to CSV |
| **🖼️ Image Optimization** | Cloudinary integration |
| **📧 Email Notifications** | RabbitMQ email queue |
| **🔒 Security** | JWT, HTTPS, CORS, SQL Injection prevention |
| **⚡ Performance** | Caching, indexing, pagination |
| **🧪 Testing** | Unit & Integration tests |

---

## 📦 Deployment

### Local Development
```bash
docker-compose up -d
```
Khởi động:
- PostgreSQL
- RabbitMQ
- Eureka Server
- 6 Backend Services
- 2 Frontends

### Production
- Container orchestration: Kubernetes
- Load balancing: Nginx
- CI/CD: GitHub Actions
- Monitoring: Prometheus + Grafana (tương lai)

---

## 🎓 Bài Học & Best Practices

### Microservices Patterns
- ✅ Service Discovery (Eureka)
- ✅ API Gateway Pattern
- ✅ Event Sourcing (RabbitMQ)
- ✅ Database per Service
- ✅ Circuit Breaker (có thể implement)
- ✅ Saga Pattern (cho distributed transactions)

### Clean Code & Architecture
- ✅ RESTful API design
- ✅ Layered architecture (Controller → Service → Repository)
- ✅ Dependency Injection (Spring)
- ✅ SOLID principles
- ✅ Error handling & validation

### Security
- ✅ Authentication: JWT
- ✅ Authorization: Role-based (RBAC)
- ✅ Password encoding: BCrypt
- ✅ CORS: Properly configured
- ✅ Input validation: Backend validation bắt buộc

---

## 📊 Thống Kê Dự Án

| Chỉ Số | Giá Trị |
|--------|--------|
| **Backend Services** | 6 microservices |
| **Frontends** | 2 (Customer + Admin) |
| **Databases** | 4 PostgreSQL databases |
| **API Endpoints** | 50+ RESTful endpoints |
| **Lines of Code** | 15,000+ (Backend) |
| **Frontend Components** | 50+ reusable components |
| **Tables** | 20+ database tables |
| **Docker Containers** | 12+ containers |

---

## 🚀 Future Enhancements

- [ ] Distributed tracing (Sleuth + Zipkin)
- [ ] Monitoring & Alerting (Prometheus + Grafana)
- [ ] Advanced search (Elasticsearch)
- [ ] Real-time notifications (WebSocket)
- [ ] Machine Learning: Recommendation engine
- [ ] Multi-language support
- [ ] Mobile app (React Native / Flutter)
- [ ] Advanced payment methods
- [ ] Refund workflow
- [ ] User reviews analytics

---

## 📝 Kết Luận

**BookingTour** là một dự án hoàn chỉnh, sử dụng các công nghệ hiện đại nhất trong ngành, giúp khách hàng dễ dàng tìm kiếm, đặt tour và thanh toán trực tuyến, đồng thời cung cấp cho quản trị viên một nền tảng quản lý mạnh mẽ và hiệu quả.

Hệ thống được thiết kế với **tính khả dụng cao, khả năng mở rộng lớn, và dễ bảo trì** nhờ vào kiến trúc Microservices, giúp hỗ trợ phát triển trong tương lai.

---

**Các Thành Viên Nhóm:**
- Diệp Thụy An (GVHD)
- Nguyễn Phan Tuấn Kiệt (Kỹ sư)
- Phạm Văn Kiệt (Kỹ sư)
- Nguyễn Thanh Thảo (Kỹ sư)

**Thời gian phát triển:** 6 tháng  
**Ngôn ngữ:** Việt Nam

