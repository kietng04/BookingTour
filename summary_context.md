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
- **Key Controllers**:
  - `TourController`: `/tours/*` với pagination, filtering
  - `ScheduleController`: Tour itineraries
  - `DepartureController`: Tour departure dates & seats
  - `ImageController`: Tour photos
  - `DiscountController`: Promotions
  - `ProvinceController`, `RegionController`: Location hierarchy
- **Messaging**: RabbitMQ cho seat reservation events
- **External Integration**: Cloudinary cho image storage

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

### Admin Frontend (Port 5174) - CHƯA INTEGRATE
- **Tech Stack**: React 18 + Vite + TailwindCSS
- **Dependencies**: Similar to client but thêm `recharts` cho admin dashboard
- **Status**: ❌ CHƯA ĐƯỢC INTEGRATE VÀO SYSTEM

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

### 🚧 In Progress
- [ ] Frontend Admin integration
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

1. **Complete Admin Frontend Integration**
   - Connect admin dashboard to backend APIs
   - Implement management features for tours, bookings, users

2. **Enhance Security**
   - Add JWT filters to all protected endpoints
   - Implement role-based access control

3. **Improve Reliability**
   - Add circuit breakers for external service calls
   - Implement comprehensive error handling

4. **Operations**
   - Centralized logging với ELK stack
   - Distributed tracing for microservices debugging
   - Performance monitoring and alerting

5. **Testing & Documentation**
   - Comprehensive unit/integration tests
   - API documentation with Swagger
   - End-to-end testing automation

---

*Updated: November 2025 - Initial comprehensive codebase analysis*"