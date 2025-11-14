"# BookingTour - Phân Tích Tổng Quan Codebase

## 🏗️ Tổng Quan Kiến Trúc

**BookingTour** là hệ thống quản lý tour du lịch Việt Nam được xây dựng theo kiến trúc **Microservices** với:
- **Java 17** + **Spring Boot 3.3.3** + **Spring Cloud 2023.0.3**
- **PostgreSQL 15** làm cơ sở dữ liệu chính
- **RabbitMQ 3** cho message broker
- **Netflix Eureka** cho Service Discovery
- **Spring Cloud Gateway** làm API Gateway
- **React 18** cho Frontend (Client + Admin)

---

## 🚀 Microservices Architecture

### 1. **Eureka Server** (Port 8761)
- **Vai trò**: Service Discovery & Registry
- **Cấu trúc**: Spring Boot application đơn giản
- **Health check**: `/actuator/health`

### 2. **API Gateway** (Port 8080)
- **Vai trò**: Single entry point, routing, load balancing
- **Dependencies**: Spring Cloud Gateway, Eureka Client
- **Routes**: Định tuyến đến các service khác
- **Logging**: Full debug logging enabled

### 3. **User Service** (Port 8081)
- **Database**: PostgreSQL `userdb`
- **Core功能**:
  - Authentication & Authorization (JWT)
  - User Management CRUD
  - OAuth2 integration (GitHub, Google)
- **Key Controllers**:
  - `AuthController`: `/auth/*` (login, register, OAuth)
  - `UserController`: `/users/*` (CRUD operations)
- **Security**: Spring Security + JWT (jjwt 0.12.3)
- **OAuth2**: GitHub và Google OAuth integration

### 4. **Tour Service** (Port 8082)
- **Database**: PostgreSQL partagert với user-service
- **Core功能**:
  - Tour Management (CRUD)
  - Schedule Management
  - Image Management (Cloudinary integration)
  - Province/Region Management
  - Discount Management
  - Departure Management
  - **Review & Rating System** (NEW)
- **Key Controllers**:
  - `TourController`: `/tours/*` với pagination, filtering
  - `ScheduleController`: Tour itineraries
  - `DepartureController`: Tour departure dates & seats
  - `ImageController`: Tour photos
  - `DiscountController`: Promotions
  - `ProvinceController`, `RegionController`: Location hierarchy
  - **`ReviewController`**: `/reviews/*` - Review CRUD & moderation (NEW)
- **Messaging**: RabbitMQ cho seat reservation events
- **External Integration**:
  - Cloudinary cho image storage
  - **User Service client** cho fetching user info in reviews (NEW)
- **Service Discovery**: Uses @LoadBalanced RestTemplate to communicate with user-service

### 5. **Booking Service** (Port 8083)
- **Database**: PostgreSQL `bookingdb` riêng
- **Core功能**:
  - Booking management (PENDING → CONFIRMED/CANCELLED)
  - Guest information management
  - Seat reservation via messaging
- **Key Controllers**:
  - `BookingController`: `/bookings/*` với pagination & filtering
- **Messaging**:
  - Publishes `reservation.request` events
  - Listens for `payment.completed` events
- **Status Flow**: PENDING → CONFIRMED/FAILED
- **Features**: Event deduplication, audit logging

### 6. **Payment Service** (Port 8084)
- **Database**: PostgreSQL `paymentdb` riêng
- **Core功能**:
  - Payment processing
  - MoMo wallet integration
  - Multiple payment methods support
- **Key Controllers**:
  - `PaymentController`: Payment operations
  - `MoMoCallbackController`: MoMo webhook handling
- **Payment Gateway**: MoMo integration với:
  - Order creation
  - Callback handling
  - Transaction status tracking
- **Features**: Mock/Simulation mode cho testing

---

## 🗄️ Database Schema

### Shared Database `tour_management`
**Tables**:
- `users` & `user_verification` - Quản lý user
- `regions` & `provinces` - Location hierarchy
- `tours` - Tour information với slug support
- `tour_schedules` - Itineraries
- `tour_images` - Photos với primary image flag
- `departures` - Tour dates & availability
- `tour_discounts` - Promotions
- `tour_logs` - Audit trail
- **`tour_reviews`** - Review & rating system (NEW)
  - Stores user reviews với rating (1-5 stars)
  - Status workflow: PENDING → APPROVED/REJECTED
  - Badges for categorization (e.g., "Luxury", "Family")
  - Guest info cached (name & avatar) from user-service

### Booking Database `bookingdb`
**Tables**:
- `bookings` - Booking records với status tracking
- `booking_guests` - Detailed guest information
- `booking_logs` - Booking audit trail

### Payment Database `paymentdb`
**Tables**:
- `payments` - Payment transactions với MoMo fields
- `payment_methods` - Saved payment methods
- `payment_logs` - Payment audit trail
- `refunds` - Refund management

---

## ⭐ Review & Rating System (NEW)

### Architecture
- **Backend**: Tour Service handles all review operations
- **Database**: `tour_reviews` table in shared `tour_management` database
- **User Integration**: RestTemplate with @LoadBalanced to fetch user info from user-service
- **Moderation**: Admin approval workflow (PENDING → APPROVED/REJECTED)

### API Endpoints (via `/api/reviews/*`)
**Public Endpoints**:
- `GET /reviews/approved` - Get all approved reviews
- `GET /reviews/approved/tour/{tourId}` - Get approved reviews for a tour
- `GET /reviews/summary/{tourId}` - Get rating summary & distribution

**Authenticated User Endpoints**:
- `POST /reviews/tour/{tourId}` - Create review (requires X-User-Id header)
- `GET /reviews/my-reviews` - Get user's own reviews
- `PUT /reviews/{reviewId}` - Update own review (resets to PENDING)
- `DELETE /reviews/{reviewId}` - Delete own review

**Admin Endpoints**:
- `GET /reviews/admin` - Get all reviews with filters (status, tourId, minRating)
- `PATCH /reviews/admin/{reviewId}/status` - Approve/Reject review
- `DELETE /reviews/admin/{reviewId}` - Delete any review

### Review Workflow
1. **User submits review** → Status: PENDING, fetches user info from user-service
2. **Admin reviews** → Can APPROVE or REJECT
3. **Approved reviews** → Displayed on tour detail page & reviews page
4. **User updates review** → Status resets to PENDING (requires re-moderation)

### Frontend Integration
**Client Frontend**:
- Tour Detail page: Display approved reviews with rating summary
- Reviews page: Browse all approved reviews with filters
- My Reviews page: User's review management (CRUD)
- Review Form: Create/edit reviews with star rating, title, comment, badges

**Admin Frontend**:
- Reviews page: Review moderation table with filters
- Dashboard: Review statistics card (total, pending, average rating)
- Actions: Approve, Reject, Delete reviews with confirmation

### Key Features
- Star rating (1-5 with 0.5 increments)
- Badge categorization (e.g., "Luxury", "Family", "Adventure")
- Guest info caching (fullName, avatar) from user-service
- Fallback handling if user-service unavailable
- Review statistics & rating distribution
- Filter by status, tour, rating, badges

---

## 💬 Messaging Architecture (RabbitMQ)

### Event Flow: Booking → Payment
1. **Booking Request**: `POST /api/bookings/bookings`
2. **Booking Service**: Creates booking (PENDING) + publishes `reservation.request`
3. **Tour Service**: Processes seat reservation + publishes `reservation.success/fail`
4. **Booking Service**: Updates booking status + publishes `payment.charge`
5. **Payment Service**: Processes payment + publishes `payment.completed/failed`
6. **Booking Service**: Finalizes booking to CONFIRMED/FAILED

### Key Events:
- `reservation.request`
- `reservation.success/fail`
- `payment.charge`
- `payment.completed/failed`

---

## 🌐 Frontend Applications

### Client Frontend (Port 3000)
- **Tech Stack**: React 18 + Vite + TailwindCSS
- **Dependencies**:
  - `react-router-dom` - Routing
  - `react-hook-form` - Form handling
  - `framer-motion` - Animations
  - `lucide-react` - Icons
  - `react-datepicker` - Date handling
- **Structure**:
  - `components/auth/` - OAuth login (GitHub, Google)
  - `components/booking/` - Booking flow, timeline, forms
  - `components/home/` - Hero, filters, search
  - `components/common/` - Reusable UI components
  - **`components/reviews/`** - Review display, form, filters (NEW)
- **Pages**:
  - `/tours/:id` - Tour detail with reviews
  - `/reviews` - Browse all approved reviews
  - **`/my-reviews`** - User's review management (NEW)

### Admin Frontend (Port 5174)
- **Tech Stack**: React 18 + Vite + TailwindCSS
- **Dependencies**: Similar to client but thêm `recharts` cho admin dashboard
- **Status**: ✅ **NOW INTEGRATED** (Dashboard, Tours, Departures, Bookings, Reviews, Users)
- **Pages**:
  - `/` - Dashboard with stats (revenue, bookings, users, reviews)
  - `/tours` - Tour management
  - `/departures` - Departure management
  - `/bookings` - Booking management
  - **`/reviews`** - Review moderation (NEW)
  - `/users` - User management

---

## 🔧 Configuration & Deployment

### Docker Compose Setup
**Services**:
- 3x PostgreSQL databases (port 5432, 5433, 5434)
- RabbitMQ Management (15672)
- 6x Microservices
- 2x Frontend applications

### Environment Variables
**OAuth Configuration**:
- GitHub Client ID/Secret
- Google Client ID/Secret
- Redirect URIs cho OAuth callbacks

**Database Configuration**:
- Multi-database setup cho isolation
- Health checks cho service dependencies

### Build & Deploy
```bash
# Build all services
./build-all.sh

# Start with Docker Compose
docker-compose up --build -d

# View logs
docker-compose logs -f
```

---

## 🛠️ Development Status

### ✅ Implemented Features
- [x] Service Discovery (Eureka)
- [x] API Gateway với routing
- [x] User Service với JWT Authentication
- [x] OAuth2 (GitHub, Google) integration
- [x] Tour Service CRUD operations
- [x] Image upload với Cloudinary
- [x] Booking Service (log-only mode)
- [x] Payment Service với MoMo integration
- [x] RabbitMQ messaging cho async communication
- [x] Docker Compose deployment
- [x] Client Frontend với booking flow
- [x] Database schemas cho all services
- [x] **Review & Rating System** (NEW)
  - [x] Backend API in tour-service
  - [x] User service integration for guest info
  - [x] Client frontend review pages
  - [x] Admin review moderation interface
  - [x] Dashboard integration with review stats
- [x] **Frontend Admin integration** (COMPLETE)
  - [x] Dashboard with comprehensive stats
  - [x] Tour, Departure, Booking management
  - [x] Review moderation system
  - [x] User management interface

### 🚧 In Progress
- [ ] JWT Filter cho protected endpoints
- [ ] Role-based authorization (ADMIN/USER)
- [ ] Idempotency checks cho message consumers

### 📋 Planned
- [ ] Refund flow implementation
- [ ] Distributed tracing (Sleuth + Zipkin)
- [x] Circuit Breaker (Resilience4j)
- [ ] Centralized logging (ELK stack)
- [ ] API Documentation (Swagger/OpenAPI)
- [ ] Comprehensive testing (Unit + Integration)

---

## 🔍 Key Technical Insights

### Microservices Communication
- **Synchronous**: REST API thông qua Gateway
- **Asynchronous**: RabbitMQ cho critical business flows
- **Service Discovery**: Eureka cho dynamic service registration

### Data Management
- **Database per Service** pattern for Booking & Payment services
- **Shared Database** cho User & Tour services (logical separation)
- **Event-driven consistency** across services

### Authentication Flow
1. **Local Auth**: JWT tokens generated by User Service
2. **OAuth2**: GitHub/Google integration với automatic user creation
3. **Token Management**: Stateless JWT với proper validation

### Resilience Patterns
- **Health Checks**: Cho all services
- **Service Dependencies**: Docker health checks với proper startup order
- **Event Deduplication**: Prevent duplicate processing
- **Mock/Simulation**: Payment service configurable failure modes

---

## 📍 Next Steps for Development

1. **Enhance Security**
   - Add JWT filters to all protected endpoints
   - Implement role-based access control (ADMIN/USER)
   - Secure review endpoints with proper authorization

2. **Improve Reliability**
   - Add circuit breakers for user-service calls in tour-service
   - Implement comprehensive error handling
   - Add retry logic for inter-service communication

3. **Operations**
   - Centralized logging với ELK stack
   - Distributed tracing for microservices debugging
   - Performance monitoring and alerting

4. **Testing & Documentation**
   - Comprehensive unit/integration tests for review system
   - API documentation with Swagger/OpenAPI
   - End-to-end testing automation
   - Performance testing for review queries

5. **Enhancements**
   - Review analytics dashboard
   - Email notifications for review status changes
   - Review helpful/unhelpful voting system
   - Image attachments in reviews

---

*Updated: November 2025 - Added comprehensive Review & Rating System*"