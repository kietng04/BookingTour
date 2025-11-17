# 📸 HƯỚNG DẪN CHUẨN BỊ HÌNH ẢNH CHO BÁO CÁO LATEX

## Tổng quan

Báo cáo cần **3 loại hình ảnh**:
1. **UI Screenshots** (Playwright MCP) - 18 hình
2. **Source Code Screenshots** (Manual) - 9 hình
3. **Diagrams & Architecture** (Manual/Extract) - 4 hình

**Tổng cộng: 31 hình ảnh**

---

## 1. 🖥️ UI SCREENSHOTS (Playwright MCP)

### 1.1. Eureka Dashboard
- **File**: `images/ui/01_eureka_dashboard.png`
- **URL**: http://localhost:8761/
- **Viewport**: 1920x1080
- **Notes**: Hiển thị danh sách services đã register
- **Command**:
```bash
# Start Eureka Server first
docker-compose up eureka-server -d
# Wait for startup, then screenshot
playwright screenshot http://localhost:8761/ --output images/ui/01_eureka_dashboard.png --viewport-size=1920,1080 --wait-until=networkidle
```

### 1.2. Client Frontend - Login
- **File**: `images/ui/02_login.png`
- **URL**: http://localhost:3000/login
- **Viewport**: 1366x768
- **Notes**: Form đăng nhập với OAuth buttons
- **Command**:
```bash
# Start frontend
cd frontend && npm run dev
# Screenshot
playwright screenshot http://localhost:3000/login --output images/ui/02_login.png --viewport-size=1366,768
```

### 1.3. Client Frontend - Register
- **File**: `images/ui/03_register.png`
- **URL**: http://localhost:3000/register
- **Viewport**: 1366x768
- **Notes**: Form đăng ký
- **Command**:
```bash
playwright screenshot http://localhost:3000/register --output images/ui/03_register.png --viewport-size=1366,768
```

### 1.4. Client Frontend - Homepage
- **File**: `images/ui/04_homepage.png`
- **URL**: http://localhost:3000/
- **Viewport**: 1920x1080
- **Notes**: Hero section, featured tours
- **Command**:
```bash
playwright screenshot http://localhost:3000/ --output images/ui/04_homepage.png --viewport-size=1920,1080 --full-page
```

### 1.5. Client Frontend - Tour Explore
- **File**: `images/ui/05_tour_explore.png`
- **URL**: http://localhost:3000/tours
- **Viewport**: 1920x1080
- **Notes**: Tour listing với filters
- **Command**:
```bash
playwright screenshot http://localhost:3000/tours --output images/ui/05_tour_explore.png --viewport-size=1920,1080
```

### 1.6. Client Frontend - Tour Detail
- **File**: `images/ui/06_tour_detail.png`
- **URL**: http://localhost:3000/tours/[first-tour-slug]
- **Viewport**: 1920x1080
- **Notes**: Gallery, itinerary, reviews (cần có data)
- **Command**:
```bash
# Replace [slug] với actual tour slug from database
playwright screenshot http://localhost:3000/tours/ha-long-bay-2-ngay-1-dem --output images/ui/06_tour_detail.png --viewport-size=1920,1080 --full-page
```

### 1.7. Client Frontend - Reviews Page
- **File**: `images/ui/07_reviews.png`
- **URL**: http://localhost:3000/reviews
- **Viewport**: 1920x1080
- **Notes**: Review listing
- **Command**:
```bash
playwright screenshot http://localhost:3000/reviews --output images/ui/07_reviews.png --viewport-size=1920,1080
```

### 1.8. Client Frontend - Booking Page
- **File**: `images/ui/08_booking.png`
- **URL**: http://localhost:3000/booking?tourId=1&departureId=1
- **Viewport**: 1920x1080
- **Notes**: Booking form (cần authentication)
- **Command**:
```bash
# Cần login trước, có thể dùng Playwright script để login rồi navigate
# Hoặc manual screenshot
playwright screenshot http://localhost:3000/booking?tourId=1&departureId=1 --output images/ui/08_booking.png --viewport-size=1920,1080
```

### 1.9. Client Frontend - Payment Success
- **File**: `images/ui/09_payment_success.png`
- **URL**: http://localhost:3000/payment-status?status=success&bookingId=1
- **Viewport**: 1366x768
- **Notes**: Success page (mock data OK)
- **Command**:
```bash
playwright screenshot "http://localhost:3000/payment-status?status=success&bookingId=1" --output images/ui/09_payment_success.png --viewport-size=1366,768
```

### 1.10. Client Frontend - Booking History
- **File**: `images/ui/10_booking_history.png`
- **URL**: http://localhost:3000/booking-history
- **Viewport**: 1920x1080
- **Notes**: Authenticated page
- **Command**:
```bash
playwright screenshot http://localhost:3000/booking-history --output images/ui/10_booking_history.png --viewport-size=1920,1080
```

### 1.11. Client Frontend - My Reviews
- **File**: `images/ui/11_my_reviews.png`
- **URL**: http://localhost:3000/my-reviews
- **Viewport**: 1920x1080
- **Notes**: User's reviews
- **Command**:
```bash
playwright screenshot http://localhost:3000/my-reviews --output images/ui/11_my_reviews.png --viewport-size=1920,1080
```

### 1.12. Admin Frontend - Dashboard
- **File**: `images/ui/12_admin_dashboard.png`
- **URL**: http://localhost:5174/dashboard
- **Viewport**: 1920x1080
- **Notes**: Charts, statistics (cần có booking data)
- **Command**:
```bash
# Start admin frontend
cd frontend-admin && npm run dev
# Screenshot (cần admin login)
playwright screenshot http://localhost:5174/dashboard --output images/ui/12_admin_dashboard.png --viewport-size=1920,1080 --full-page
```

### 1.13. Admin Frontend - Tours List
- **File**: `images/ui/13_admin_tours.png`
- **URL**: http://localhost:5174/tours
- **Viewport**: 1920x1080
- **Notes**: Tour management table
- **Command**:
```bash
playwright screenshot http://localhost:5174/tours --output images/ui/13_admin_tours.png --viewport-size=1920,1080
```

### 1.14. Admin Frontend - Tour Create
- **File**: `images/ui/14_admin_tour_create.png`
- **URL**: http://localhost:5174/tours/create
- **Viewport**: 1920x1080
- **Notes**: Create tour form
- **Command**:
```bash
playwright screenshot http://localhost:5174/tours/create --output images/ui/14_admin_tour_create.png --viewport-size=1920,1080 --full-page
```

### 1.15. Admin Frontend - Departures
- **File**: `images/ui/15_admin_departures.png`
- **URL**: http://localhost:5174/departures
- **Viewport**: 1920x1080
- **Notes**: Departure management
- **Command**:
```bash
playwright screenshot http://localhost:5174/departures --output images/ui/15_admin_departures.png --viewport-size=1920,1080
```

### 1.16. Admin Frontend - Bookings
- **File**: `images/ui/16_admin_bookings.png`
- **URL**: http://localhost:5174/bookings
- **Viewport**: 1920x1080
- **Notes**: Booking management (có bug hiển thị "Tour #X")
- **Command**:
```bash
playwright screenshot http://localhost:5174/bookings --output images/ui/16_admin_bookings.png --viewport-size=1920,1080
```

### 1.17. Admin Frontend - Reviews
- **File**: `images/ui/17_admin_reviews.png`
- **URL**: http://localhost:5174/reviews
- **Viewport**: 1920x1080
- **Notes**: Review moderation table
- **Command**:
```bash
playwright screenshot http://localhost:5174/reviews --output images/ui/17_admin_reviews.png --viewport-size=1920,1080
```

### 1.18. Admin Frontend - Users
- **File**: `images/ui/18_admin_users.png`
- **URL**: http://localhost:5174/users
- **Viewport**: 1920x1080
- **Notes**: User management
- **Command**:
```bash
playwright screenshot http://localhost:5174/users --output images/ui/18_admin_users.png --viewport-size=1920,1080
```

---

## 2. 💻 SOURCE CODE SCREENSHOTS (Manual)

### 2.1. Gateway Routes Configuration
- **File**: `images/code/01_gateway_routes.png`
- **Source**: `api-gateway/src/main/resources/application.yml`
- **Lines**: Routes configuration section (spring.cloud.gateway.routes)
- **Tool**: VS Code / IntelliJ với syntax highlighting
- **Notes**: Hiển thị tất cả routes mapping

### 2.2. User Service Structure
- **File**: `images/code/02_user_service_structure.png`
- **Source**: `user-service/src/main/java/com/bookingtour/user/`
- **Tool**: File explorer tree view trong IDE
- **Notes**: Package structure với controllers, services, models

### 2.3. AuthController
- **File**: `images/code/03_auth_controller.png`
- **Source**: `user-service/.../controller/AuthController.java`
- **Lines**: Class declaration + main endpoints (lines 1-100)
- **Notes**: @RestController, @RequestMapping, login/register endpoints

### 2.4. Tour Service Structure
- **File**: `images/code/04_tour_service_structure.png`
- **Source**: `tour-service/src/main/java/com/bookingtour/tour/`
- **Tool**: File explorer tree
- **Notes**: Package structure

### 2.5. ReviewController
- **File**: `images/code/05_review_controller.png`
- **Source**: `tour-service/.../controller/ReviewController.java`
- **Lines**: Admin moderation endpoints (approve/reject)
- **Notes**: Review workflow logic

### 2.6. Booking Service Structure
- **File**: `images/code/06_booking_service_structure.png`
- **Source**: `booking-service/src/main/java/com/bookingtour/booking/`
- **Tool**: File explorer tree
- **Notes**: Package structure

### 2.7. Payment Service Structure
- **File**: `images/code/07_payment_service_structure.png`
- **Source**: `payment-service/src/main/java/com/bookingtour/payment/`
- **Tool**: File explorer tree
- **Notes**: Package structure

### 2.8. Frontend Structure
- **File**: `images/code/08_frontend_structure.png`
- **Source**: `frontend/src/`
- **Tool**: File explorer tree
- **Notes**: pages/, components/, services/, context/

### 2.9. Admin Frontend Structure
- **File**: `images/code/09_admin_frontend_structure.png`
- **Source**: `frontend-admin/src/`
- **Tool**: File explorer tree
- **Notes**: All directories

---

## 3. 📊 DIAGRAMS & ARCHITECTURE (Manual/Create)

### 3.1. Architecture Diagram
- **File**: `images/diagrams/01_architecture.png`
- **Tool**: draw.io / Lucidchart / PowerPoint
- **Content**:
  - Eureka Server ở trung tâm
  - API Gateway
  - 6 microservices (boxes)
  - 2 frontends
  - PostgreSQL databases (3)
  - RabbitMQ
  - Cloudinary
  - Arrows showing connections
- **Recommendation**: Vẽ lại hoặc export từ tool

### 3.2. Database ERD
- **File**: `images/diagrams/02_database_erd.png`
- **Tool**: MySQL Workbench / DBeaver / dbdiagram.io
- **Content**:
  - Tất cả tables với columns
  - Primary keys
  - Foreign keys relationships
  - 3 databases (userdb/tourdb, bookingdb, paymentdb)
- **Recommendation**: Generate từ database tool

### 3.3. Technology Stack Diagram
- **File**: `images/diagrams/03_tech_stack.png`
- **Tool**: PowerPoint / Canva
- **Content**:
  - Backend stack (Spring Boot, Spring Cloud, PostgreSQL, RabbitMQ)
  - Frontend stack (React, Vite, TailwindCSS)
  - Infrastructure (Docker, Eureka, Cloudinary)
  - Arranged in layers or categories
- **Recommendation**: Infographic style

### 3.4. RabbitMQ Event Flow
- **File**: `images/diagrams/04_rabbitmq_flow.png`
- **Tool**: draw.io / Sequence diagram tool
- **Content**:
  - Booking creation flow
  - Exchanges (booking.events, payment.exchange)
  - Queues
  - Routing keys
  - Services listening/publishing
  - Sequence: Booking → Reserve → Payment → Email
- **Recommendation**: Sequence diagram or flowchart

---

## 📋 CHECKLIST HOÀN THÀNH

### UI Screenshots (18)
- [ ] 01_eureka_dashboard.png
- [ ] 02_login.png
- [ ] 03_register.png
- [ ] 04_homepage.png
- [ ] 05_tour_explore.png
- [ ] 06_tour_detail.png
- [ ] 07_reviews.png
- [ ] 08_booking.png
- [ ] 09_payment_success.png
- [ ] 10_booking_history.png
- [ ] 11_my_reviews.png
- [ ] 12_admin_dashboard.png
- [ ] 13_admin_tours.png
- [ ] 14_admin_tour_create.png
- [ ] 15_admin_departures.png
- [ ] 16_admin_bookings.png
- [ ] 17_admin_reviews.png
- [ ] 18_admin_users.png

### Source Code Screenshots (9)
- [ ] 01_gateway_routes.png
- [ ] 02_user_service_structure.png
- [ ] 03_auth_controller.png
- [ ] 04_tour_service_structure.png
- [ ] 05_review_controller.png
- [ ] 06_booking_service_structure.png
- [ ] 07_payment_service_structure.png
- [ ] 08_frontend_structure.png
- [ ] 09_admin_frontend_structure.png

### Diagrams (4)
- [ ] 01_architecture.png
- [ ] 02_database_erd.png
- [ ] 03_tech_stack.png
- [ ] 04_rabbitmq_flow.png

---

## 🔧 TOOLS RECOMMENDED

### UI Screenshots
- **Playwright MCP** (provided commands above)
- Browser DevTools (F12 → Screenshot)
- Snipping Tool / Snagit

### Code Screenshots
- VS Code với theme sáng
- IntelliJ IDEA
- Carbon (https://carbon.now.sh/) for beautiful code snippets

### Diagrams
- draw.io (https://app.diagrams.net/)
- Lucidchart
- dbdiagram.io (for ERD)
- MySQL Workbench (generate ERD)
- PowerPoint / Google Slides
- Canva

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Viewport Size**: Unified size cho consistency (recommend 1920x1080 cho desktop, 1366x768 cho forms)

2. **Authentication**: Một số pages cần login:
   - Booking page
   - Booking history
   - My reviews
   - All admin pages

   → Cần login manual trước hoặc dùng Playwright script để auto-login

3. **Data Requirements**:
   - Cần seed database với sample data
   - Tours, departures, bookings, reviews, users
   - Chạy SQL scripts trong `sql-scripts/` folder

4. **Service Startup Order**:
   ```bash
   1. docker-compose up postgres rabbitmq
   2. docker-compose up eureka-server
   3. docker-compose up api-gateway user-service tour-service booking-service payment-service
   4. cd frontend && npm run dev
   5. cd frontend-admin && npm run dev
   ```

5. **File Naming**: Đúng convention đã define (01_*, 02_*, etc.)

6. **Image Quality**: PNG format, high quality, clear text

7. **Upload to LaTeX**: Sau khi có đầy đủ hình, copy vào `latex-report/images/` theo đúng subfolder

---

## 🚀 NEXT STEPS

1. ✅ Đọc file hướng dẫn này
2. ⬜ Chuẩn bị environment (start services, seed data)
3. ⬜ Chạy script `playwright_commands.sh` để chụp UI screenshots
4. ⬜ Manual capture code screenshots từ IDE
5. ⬜ Tạo/vẽ diagrams
6. ⬜ Verify tất cả hình đã có trong `images/` folders
7. ⬜ Compile LaTeX để check placeholders
8. ⬜ Upload lên Overleaf (nếu dùng online)

---

**Prepared by**: Claude Code
**Date**: December 2024
**Project**: BookingTour - J2EE Report
