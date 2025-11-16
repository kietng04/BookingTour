# 📚 Câu Hỏi Bảo Vệ Đồ Án - BookingTour

**Hệ thống**: BookingTour - Quản lý Tour Du Lịch Việt Nam  
**Kiến trúc**: Microservices  
**Tech Stack**: Java 17, Spring Boot 3.3.3, React 18, PostgreSQL 15, RabbitMQ 3  
**Ngày cập nhật**: November 2025

---

## 📖 Mục Lục

1. [Tổng Quan & Kiến Trúc](#phần-1-tổng-quan--kiến-trúc)
2. [Backend Services](#phần-2-backend-services)
3. [Frontend](#phần-3-frontend)
4. [Database](#phần-4-database)
5. [Message Broker](#phần-5-message-broker-rabbitmq)
6. [Deployment & DevOps](#phần-6-deployment--devops)
7. [Testing](#phần-7-testing)
8. [Security](#phần-8-security)
9. [Performance & Scalability](#phần-9-performance--scalability)
10. [Challenges & Solutions](#phần-10-challenges--solutions)

---

# Phần 1: Tổng Quan & Kiến Trúc

## Q1: Giới thiệu tổng quan về đồ án của em?

**Trả lời ngắn:**  
BookingTour là hệ thống quản lý tour du lịch Việt Nam được xây dựng theo kiến trúc Microservices. Hệ thống cho phép khách hàng tìm kiếm, đặt tour, thanh toán online và đánh giá tour. Admin có thể quản lý tour, departure, booking và review thông qua admin panel.

**Chi tiết:**

**Chức năng chính:**
- **Khách hàng**: Tìm kiếm tour, xem chi tiết, đặt tour, thanh toán MoMo, đánh giá & review
- **Admin**: Quản lý tour, departure, booking, payment, user, review moderation
- **Hệ thống**: Authentication (JWT + OAuth2), Event-driven booking flow, Real-time seat management

**Kiến trúc:**
```
Client (React) ──┐
                 ├──> API Gateway (8080) ──┐
Admin (React) ───┘                         │
                                           ├──> Eureka Server (8761)
                                           │
                    ┌──────────────────────┴─────────────────────┐
                    │                                             │
              User Service (8081)                          Tour Service (8082)
                    │                                             │
              Booking Service (8083) <──── RabbitMQ ────> Payment Service (8084)
                    │                                             │
              PostgreSQL (3 DBs)                          Cloudinary API
```

**Tech Stack:**
- Backend: Java 17, Spring Boot 3.3.3, Spring Cloud 2023.0.3
- Frontend: React 18, Vite, TailwindCSS
- Database: PostgreSQL 15
- Message Broker: RabbitMQ 3
- Service Discovery: Netflix Eureka
- Deployment: Docker & Docker Compose

**Files tham khảo:**
- `README.md` - Tổng quan project
- `summary_context.md` - Phân tích chi tiết
- `docker-compose.yml` - Service orchestration

---

## Q2: Tại sao em chọn kiến trúc Microservices cho project này?

**Trả lời ngắn:**  
Em chọn Microservices vì project có nhiều domain khác nhau (User, Tour, Booking, Payment) cần độc lập về mặt deployment và scaling. Mỗi service có thể phát triển, test và deploy riêng biệt.

**Chi tiết:**

**Lý do chọn Microservices:**

1. **Tách biệt concerns (Separation of Concerns)**
   - User authentication/authorization là domain riêng
   - Tour management có logic phức tạp (schedule, images, reviews)
   - Booking flow cần xử lý state machine
   - Payment integration với bên thứ 3 (MoMo)

2. **Technology flexibility**
   - Có thể dùng tech stack khác nhau cho mỗi service nếu cần
   - Ví dụ: Payment service có thể chuyển sang Node.js nếu cần xử lý async tốt hơn

3. **Independent Scalability**
   - Tour Service cần scale nhiều (nhiều người xem tour)
   - Payment Service cần scale ít hơn (ít giao dịch hơn)
   - Có thể scale từng service riêng thay vì scale toàn bộ monolith

4. **Fault Isolation**
   - Lỗi ở Payment Service không làm crash Tour Service
   - User vẫn có thể xem tour khi Payment Service down

5. **Team Organization**
   - Nhiều team có thể làm việc song song
   - Mỗi team chịu trách nhiệm cho một service

**Implementation trong project:**
```
BookingTour/
├── eureka-server/          # Service Discovery (Port 8761)
├── api-gateway/            # Single entry point (Port 8080)
├── user-service/           # Authentication & Users (Port 8081)
├── tour-service/           # Tours, Departures, Reviews (Port 8082)
├── booking-service/        # Bookings & Dashboard (Port 8083)
├── payment-service/        # Payments & MoMo (Port 8084)
├── frontend/               # Client UI (Port 3000)
└── frontend-admin/         # Admin UI (Port 5174)
```

**Trade-offs:**
- **Pros**: Scalability, fault isolation, technology flexibility
- **Cons**: Complexity tăng, distributed transactions phức tạp, testing khó hơn

**Giải pháp cho trade-offs:**
- Dùng Service Discovery (Eureka) để services tự động tìm nhau
- Dùng API Gateway để có single entry point
- Dùng Event-driven architecture (RabbitMQ) cho distributed transactions
- Dùng Docker Compose để dễ dàng chạy toàn bộ hệ thống

**Files tham khảo:**
- `docker-compose.yml` - Service orchestration
- `eureka-server/` - Service registry
- `api-gateway/src/main/resources/application.yml` - Routing config

---

## Q3: Giải thích về Service Discovery và vai trò của Eureka Server?

**Trả lời ngắn:**  
Eureka Server là Service Registry cho phép các microservices tự động đăng ký và tìm kiếm nhau. Khi một service khởi động, nó đăng ký với Eureka. Các service khác có thể query Eureka để tìm địa chỉ của service cần gọi.

**Chi tiết:**

**Vấn đề cần giải quyết:**
- Trong Microservices, services có thể chạy trên nhiều instances khác nhau
- Địa chỉ IP và port có thể thay đổi khi deploy
- Cần cơ chế để services tự động tìm nhau mà không hardcode địa chỉ

**Cách hoạt động của Eureka:**

```
1. Service Startup:
   User Service (8081) ──register──> Eureka Server (8761)
   Tour Service (8082) ──register──> Eureka Server (8761)
   
2. Service Discovery:
   Booking Service cần gọi Tour Service
   Booking Service ──query──> Eureka Server
   Eureka Server ──return──> "tour-service: localhost:8082"
   Booking Service ──call──> Tour Service (8082)
```

**Implementation trong project:**

**Eureka Server Configuration:**
```yaml
# eureka-server/src/main/resources/application.yml
server:
  port: 8761

eureka:
  client:
    register-with-eureka: false  # Không tự đăng ký chính nó
    fetch-registry: false         # Không fetch registry
```

**Service Registration (ví dụ User Service):**
```yaml
# user-service/src/main/resources/application.yml
spring:
  application:
    name: user-service

eureka:
  client:
    service-url:
      defaultZone: http://eureka-server:8761/eureka/
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: true
```

**Service Discovery trong code:**
```java
// Tour Service gọi User Service để lấy thông tin user
@Configuration
public class RestTemplateConfig {
    @Bean
    @LoadBalanced  // Enable service discovery
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

// Sử dụng
@Autowired
private RestTemplate restTemplate;

// Gọi bằng service name thay vì hardcode URL
String url = "http://user-service/users/" + userId;
UserDTO user = restTemplate.getForObject(url, UserDTO.class);
```

**Health Check & Heartbeat:**
- Mỗi service gửi heartbeat đến Eureka mỗi 30 giây
- Nếu không nhận heartbeat trong 90 giây, Eureka xóa service khỏi registry
- Health check endpoint: `http://localhost:8761/actuator/health`

**Benefits:**
- **Dynamic discovery**: Services tự động tìm nhau
- **Load balancing**: Eureka biết tất cả instances của một service
- **Fault tolerance**: Nếu một instance down, Eureka route đến instance khác
- **No hardcoded URLs**: Dùng service name thay vì IP:port

**Eureka Dashboard:**
- URL: `http://localhost:8761`
- Hiển thị tất cả registered services
- Status của từng service (UP/DOWN)
- Số lượng instances của mỗi service

**Files tham khảo:**
- `eureka-server/src/main/java/com/example/eureka/EurekaServerApplication.java`
- `user-service/src/main/resources/application.yml` - Client config
- `docker-compose.yml` - Eureka service definition (lines 67-80)

---

## Q4: API Gateway có vai trò gì và tại sao cần nó?

**Trả lời ngắn:**  
API Gateway là single entry point cho tất cả requests từ client. Nó routing requests đến đúng service, xử lý CORS, load balancing và có thể thêm authentication/authorization ở một chỗ duy nhất.

**Chi tiết:**

**Vấn đề khi không có API Gateway:**
- Client phải biết địa chỉ của tất cả services (user-service:8081, tour-service:8082, ...)
- CORS phải config ở mỗi service
- Authentication logic phải duplicate ở mỗi service
- Khó thay đổi internal service architecture

**Vai trò của API Gateway:**

1. **Single Entry Point**
   - Client chỉ cần biết một địa chỉ: `http://localhost:8080`
   - Gateway routing đến đúng service

2. **Request Routing**
   ```
   GET /api/tours      → tour-service:8082/tours
   GET /api/users      → user-service:8081/users
   POST /api/bookings  → booking-service:8083/bookings
   POST /api/payments  → payment-service:8084/payments
   ```

3. **CORS Handling**
   - Config CORS một lần ở Gateway
   - Tất cả services đều được protect

4. **Load Balancing**
   - Nếu có nhiều instances của một service, Gateway tự động load balance

5. **Protocol Translation**
   - Có thể convert HTTP → gRPC nếu cần

**Implementation trong project:**

**Routing Configuration:**
```yaml
# api-gateway/src/main/resources/application.yml
spring:
  cloud:
    gateway:
      routes:
        # User Service routes
        - id: user-auth
          uri: lb://user-service
          predicates:
            - Path=/api/users/auth/**
          filters:
            - StripPrefix=2  # /api/users/auth/** → /auth/**
        
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1  # /api/users/** → /users/**
        
        # Tour Service routes
        - id: tour-service
          uri: lb://tour-service
          predicates:
            - Path=/api/tours/**
          filters:
            - StripPrefix=1
        
        # Booking Service routes
        - id: booking-service
          uri: lb://booking-service
          predicates:
            - Path=/api/bookings/**
          filters:
            - StripPrefix=1
        
        # Payment Service routes
        - id: payment-service
          uri: lb://payment-service
          predicates:
            - Path=/api/payments/**
          filters:
            - StripPrefix=1
```

**CORS Configuration:**
```yaml
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins:
              - "http://localhost:3000"      # Client frontend
              - "http://localhost:5174"      # Admin frontend
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - PATCH
              - OPTIONS
            allowedHeaders:
              - "*"
            allowCredentials: true
```

**Load Balancing với Eureka:**
```yaml
spring:
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true
          lower-case-service-id: true
```

- `lb://user-service` = Load-balanced call đến user-service
- Gateway query Eureka để lấy tất cả instances của user-service
- Tự động round-robin giữa các instances

**Request Flow:**
```
1. Client: GET http://localhost:8080/api/tours/1
   ↓
2. API Gateway:
   - Match route: /api/tours/** → tour-service
   - Query Eureka: Tìm tour-service instances
   - Strip prefix: /api/tours/1 → /tours/1
   - Forward: http://tour-service:8082/tours/1
   ↓
3. Tour Service: Process request
   ↓
4. API Gateway: Return response to client
```

**Benefits:**
- **Simplified client**: Client chỉ cần biết một URL
- **Centralized concerns**: CORS, auth, logging ở một chỗ
- **Flexibility**: Có thể thay đổi internal services mà không ảnh hưởng client
- **Security**: Hide internal service topology

**Health Check:**
```bash
curl http://localhost:8080/actuator/health
curl http://localhost:8080/actuator/gateway/routes  # Xem tất cả routes
```

**Files tham khảo:**
- `api-gateway/src/main/resources/application.yml` - Full routing config
- `api-gateway/src/main/java/com/example/gateway/ApiGatewayApplication.java`
- `docker-compose.yml` - Gateway service (lines 82-104)

---

## Q5: Giải thích về communication giữa các services (REST vs Message Queue)?

**Trả lời ngắn:**  
Project sử dụng 2 loại communication: **Synchronous REST** cho queries (GET data) và **Asynchronous Message Queue (RabbitMQ)** cho business transactions (Booking → Payment flow).

**Chi tiết:**

**1. Synchronous Communication (REST API)**

**Khi nào dùng:**
- Cần response ngay lập tức
- Query data (GET requests)
- Simple CRUD operations
- Client cần biết kết quả ngay

**Ví dụ trong project:**

**Tour Service gọi User Service:**
```java
// Tour Service cần lấy thông tin user để hiển thị trong review
@Service
public class ReviewServiceImpl {
    @Autowired
    @LoadBalanced
    private RestTemplate restTemplate;
    
    public ReviewDTO createReview(CreateReviewRequest request) {
        // Gọi User Service để lấy thông tin user
        String url = "http://user-service/users/" + request.getUserId();
        UserDTO user = restTemplate.getForObject(url, UserDTO.class);
        
        // Lưu review với thông tin user
        review.setGuestName(user.getFullName());
        review.setGuestAvatar(user.getAvatar());
        return reviewRepository.save(review);
    }
}
```

**API Gateway routing:**
```
Client → API Gateway → Service
   ↓         ↓            ↓
Request   Route      Process
   ↓         ↓            ↓
Response ← Gateway ← Response
```

**Pros:**
- Simple, dễ hiểu
- Response ngay lập tức
- Dễ debug

**Cons:**
- Tight coupling giữa services
- Nếu service down, request fail ngay
- Không phù hợp cho long-running operations

---

**2. Asynchronous Communication (RabbitMQ)**

**Khi nào dùng:**
- Business transactions phức tạp
- Không cần response ngay
- Cần decouple services
- Long-running operations

**Ví dụ: Booking → Payment Flow**

```
1. User tạo booking
   ↓
2. Booking Service:
   - Tạo booking (status: PENDING)
   - Publish event: "reservation.request"
   ↓
3. Tour Service:
   - Listen event "reservation.request"
   - Reserve seats
   - Publish event: "reservation.success"
   ↓
4. Booking Service:
   - Listen event "reservation.success"
   - Publish event: "payment.charge"
   ↓
5. Payment Service:
   - Listen event "payment.charge"
   - Process payment (MoMo)
   - Publish event: "payment.completed"
   ↓
6. Booking Service:
   - Listen event "payment.completed"
   - Update booking status: CONFIRMED
```

**RabbitMQ Configuration:**

**Booking Service (Publisher):**
```java
@Service
public class BookingService {
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    public BookingDTO createBooking(CreateBookingRequest request) {
        // 1. Tạo booking
        Booking booking = new Booking();
        booking.setStatus(BookingStatus.PENDING);
        bookingRepository.save(booking);
        
        // 2. Publish event để reserve seats
        ReservationRequest event = new ReservationRequest();
        event.setBookingId(booking.getId());
        event.setDepartureId(request.getDepartureId());
        event.setSeats(request.getSeats());
        
        rabbitTemplate.convertAndSend(
            "reservation.exchange",
            "reservation.request",
            event
        );
        
        return booking;
    }
}
```

**Tour Service (Consumer):**
```java
@Service
public class ReservationListener {
    @RabbitListener(queues = "reservation.request.queue")
    public void handleReservationRequest(ReservationRequest request) {
        try {
            // Reserve seats
            Departure departure = departureRepository.findById(request.getDepartureId());
            departure.setRemainingSlots(departure.getRemainingSlots() - request.getSeats());
            departureRepository.save(departure);
            
            // Publish success event
            ReservationResponse response = new ReservationResponse();
            response.setBookingId(request.getBookingId());
            response.setSuccess(true);
            
            rabbitTemplate.convertAndSend(
                "reservation.exchange",
                "reservation.success",
                response
            );
        } catch (Exception e) {
            // Publish failure event
            response.setSuccess(false);
            rabbitTemplate.convertAndSend(
                "reservation.exchange",
                "reservation.failure",
                response
            );
        }
    }
}
```

**RabbitMQ Exchanges & Queues:**
```
reservation.exchange (topic)
├── reservation.request.queue
├── reservation.success.queue
└── reservation.failure.queue

payment.exchange (topic)
├── payment.charge.queue
├── payment.completed.queue
└── payment.failed.queue
```

**Benefits của Async:**
- **Decoupling**: Services không cần biết nhau
- **Resilience**: Nếu Payment Service down, message vẫn được queue
- **Scalability**: Có thể add nhiều consumers để xử lý nhanh hơn
- **Retry logic**: Có thể retry failed messages

**Trade-offs:**
- **Complexity**: Phức tạp hơn REST
- **Eventual consistency**: Data không consistent ngay lập tức
- **Debugging**: Khó debug hơn vì async

**So sánh:**

| Aspect | REST (Sync) | RabbitMQ (Async) |
|--------|-------------|------------------|
| Response time | Immediate | Eventual |
| Coupling | Tight | Loose |
| Failure handling | Fail fast | Retry & queue |
| Use case | Queries | Transactions |
| Complexity | Simple | Complex |

**Files tham khảo:**
- `booking-service/src/main/java/com/example/booking/messaging/` - RabbitMQ config
- `tour-service/src/main/java/com/example/tour/messaging/` - Listeners
- `docker-compose.yml` - RabbitMQ service (lines 138-153)

---

## Q6: Database per Service pattern - Tại sao mỗi service có database riêng?

**Trả lời ngắn:**  
Database per Service là pattern trong Microservices để đảm bảo mỗi service hoàn toàn độc lập. Mỗi service quản lý data của riêng nó, không service nào truy cập trực tiếp vào database của service khác.

**Chi tiết:**

**Database Architecture trong project:**

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  User Service   │     │  Tour Service   │     │ Booking Service │
│    (8081)       │     │    (8082)       │     │    (8083)       │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         ↓                       ↓                       ↓
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ PostgreSQL      │     │ PostgreSQL      │     │ PostgreSQL      │
│ tour_management │     │ tour_management │     │   bookingdb     │
│ (Port 5432)     │     │ (Port 5432)     │     │ (Port 5433)     │
│                 │     │                 │     │                 │
│ Tables:         │     │ Tables:         │     │ Tables:         │
│ - users         │     │ - tours         │     │ - bookings      │
│ - user_verif... │     │ - departures    │     │ - booking_guests│
└─────────────────┘     │ - tour_schedules│     │ - booking_logs  │
                        │ - tour_images   │     └─────────────────┘
                        │ - tour_reviews  │
                        │ - regions       │     ┌─────────────────┐
                        │ - provinces     │     │ Payment Service │
                        └─────────────────┘     │    (8084)       │
                                                └────────┬────────┘
                                                         │
                                                         ↓
                                                ┌─────────────────┐
                                                │ PostgreSQL      │
                                                │   paymentdb     │
                                                │ (Port 5434)     │
                                                │                 │
                                                │ Tables:         │
                                                │ - payments      │
                                                │ - payment_methods│
                                                │ - payment_logs  │
                                                │ - refunds       │
                                                └─────────────────┘
```

**Lý do áp dụng pattern này:**

**1. Service Independence (Độc lập hoàn toàn)**
- Mỗi service có thể deploy, scale, update riêng
- Không lo ảnh hưởng đến database của service khác
- Có thể thay đổi schema mà không cần coordinate với team khác

**2. Technology Flexibility**
- Mỗi service có thể chọn database phù hợp
- Ví dụ: Payment Service có thể dùng MongoDB nếu cần
- Tour Service có thể dùng PostgreSQL cho relational data

**3. Fault Isolation**
- Nếu database của Booking Service down, User Service vẫn hoạt động
- Lỗi ở một database không lan sang database khác

**4. Scalability**
- Scale database của Tour Service (nhiều read) riêng
- Scale database của Payment Service (nhiều write) riêng
- Không cần scale toàn bộ database

**Implementation trong project:**

**Docker Compose - 3 PostgreSQL instances:**
```yaml
# docker-compose.yml
services:
  # Database 1: User & Tour data
  postgres-db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: tour_management
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./sql-scripts/init-databases.sql:/docker-entrypoint-initdb.d/1-init-databases.sql
  
  # Database 2: Booking data
  booking-db:
    image: postgres:15-alpine
    ports:
      - "5433:5432"
    environment:
      POSTGRES_DB: bookingdb
    volumes:
      - booking_data:/var/lib/postgresql/data
      - ./sql-scripts/init-booking-db.sql:/docker-entrypoint-initdb.d/init-booking-db.sql
  
  # Database 3: Payment data
  payment-db:
    image: postgres:15-alpine
    ports:
      - "5434:5432"
    environment:
      POSTGRES_DB: paymentdb
    volumes:
      - payment_data:/var/lib/postgresql/data
      - ./sql-scripts/init-payment-db.sql:/docker-entrypoint-initdb.d/init-payment-db.sql
```

**Service Configuration:**

**Booking Service:**
```yaml
# booking-service/src/main/resources/application.yml
spring:
  datasource:
    url: jdbc:postgresql://booking-db:5432/bookingdb
    username: postgres
    password: postgres
```

**Payment Service:**
```yaml
# payment-service/src/main/resources/application.yml
spring:
  datasource:
    url: jdbc:postgresql://payment-db:5432/paymentdb
    username: postgres
    password: postgres
```

**Challenges & Solutions:**

**Challenge 1: Data Consistency**
- **Vấn đề**: Làm sao đảm bảo data consistent khi có distributed transactions?
- **Giải pháp**: Event-driven architecture với RabbitMQ
  ```
  Booking created (PENDING) → Reserve seats → Payment → Booking CONFIRMED
  ```
- **Pattern**: Saga pattern với eventual consistency

**Challenge 2: Joins across databases**
- **Vấn đề**: Không thể JOIN giữa `bookings` table và `tours` table
- **Giải pháp**: 
  - API Composition: Gọi nhiều services và merge data ở application layer
  - Data Duplication: Lưu một số thông tin cần thiết trong mỗi service

**Challenge 3: Reporting**
- **Vấn đề**: Làm dashboard cần data từ nhiều databases
- **Giải pháp**: 
  - CQRS pattern: Có read-only database riêng cho reporting
  - API Aggregation: Dashboard service gọi nhiều services và aggregate

**Trade-off: Shared Database cho User & Tour Service**

Trong project, User Service và Tour Service share database `tour_management`:
```
tour_management/
├── users (User Service)
├── user_verification (User Service)
├── tours (Tour Service)
├── departures (Tour Service)
├── tour_reviews (Tour Service)
└── ...
```

**Lý do:**
- Tour reviews cần reference đến users
- Giảm complexity cho project học tập
- Vẫn có thể tách riêng trong tương lai

**Best Practice:**
- Mỗi service chỉ access tables của mình
- Không có foreign key giữa tables của 2 services khác nhau
- Nếu cần data từ service khác, gọi qua API

**Files tham khảo:**
- `docker-compose.yml` - Database definitions (lines 4-65)
- `sql-scripts/init-databases.sql` - Shared database schema
- `sql-scripts/init-booking-db.sql` - Booking database schema
- `sql-scripts/init-payment-db.sql` - Payment database schema

---

## Q7: Giải thích về các design patterns được sử dụng trong project?

**Trả lời ngắn:**  
Project sử dụng nhiều design patterns: API Gateway pattern, Service Discovery pattern, Database per Service pattern, Event-driven architecture (Saga pattern), Repository pattern, DTO pattern, và Factory pattern.

**Chi tiết:**

### 1. **API Gateway Pattern**

**Mục đích**: Single entry point cho tất cả client requests

**Implementation:**
```
Client → API Gateway (8080) → [User/Tour/Booking/Payment Services]
```

**Code:**
```yaml
# api-gateway/src/main/resources/application.yml
spring:
  cloud:
    gateway:
      routes:
        - id: tour-service
          uri: lb://tour-service
          predicates:
            - Path=/api/tours/**
```

**Benefits**: Centralized routing, CORS, authentication

---

### 2. **Service Registry Pattern (Eureka)**

**Mục đích**: Services tự động discover nhau

**Implementation:**
```java
@EnableEurekaServer
@SpringBootApplication
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

**Benefits**: Dynamic service discovery, load balancing

---

### 3. **Repository Pattern**

**Mục đích**: Abstraction layer giữa business logic và data access

**Implementation:**
```java
// Repository interface
public interface TourRepository extends JpaRepository<Tour, Long> {
    List<Tour> findByStatus(TourStatus status);
    Page<Tour> findByTourNameContaining(String name, Pageable pageable);
}

// Service sử dụng repository
@Service
public class TourServiceImpl implements TourService {
    @Autowired
    private TourRepository tourRepository;
    
    @Override
    public List<TourDTO> getAllTours() {
        return tourRepository.findAll()
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
}
```

**Benefits**: 
- Tách biệt business logic và data access
- Dễ test (có thể mock repository)
- Dễ thay đổi database

---

### 4. **DTO (Data Transfer Object) Pattern**

**Mục đích**: Transfer data giữa layers, hide internal entity structure

**Implementation:**
```java
// Entity (internal)
@Entity
@Table(name = "tours")
public class Tour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String tourName;
    private BigDecimal price;
    
    @OneToMany(mappedBy = "tour")
    private List<Departure> departures;
    
    // ... many internal fields
}

// DTO (external)
public class TourDTO {
    private Long tourId;
    private String tourName;
    private BigDecimal price;
    private int availableSeats;
    
    // Only expose necessary fields
}

// Conversion
private TourDTO convertToDTO(Tour tour) {
    TourDTO dto = new TourDTO();
    dto.setTourId(tour.getId());
    dto.setTourName(tour.getTourName());
    dto.setPrice(tour.getPrice());
    return dto;
}
```

**Benefits**:
- Hide internal structure
- Reduce data transfer
- Version control (có thể có TourDTOv1, TourDTOv2)

---

### 5. **Saga Pattern (Event-driven)**

**Mục đích**: Manage distributed transactions across services

**Implementation: Booking Flow**
```
Step 1: Create Booking (PENDING)
   ↓ publish: reservation.request
Step 2: Reserve Seats
   ↓ publish: reservation.success
Step 3: Charge Payment
   ↓ publish: payment.completed
Step 4: Confirm Booking (CONFIRMED)
```

**Code:**
```java
// Step 1: Booking Service
@Service
public class BookingService {
    public BookingDTO createBooking(CreateBookingRequest request) {
        // Create booking
        Booking booking = new Booking();
        booking.setStatus(BookingStatus.PENDING);
        bookingRepository.save(booking);
        
        // Publish event
        rabbitTemplate.convertAndSend("reservation.exchange", 
            "reservation.request", 
            new ReservationRequest(booking.getId(), ...));
        
        return convertToDTO(booking);
    }
    
    // Step 4: Listen for payment completion
    @RabbitListener(queues = "payment.completed.queue")
    public void handlePaymentCompleted(PaymentCompletedEvent event) {
        Booking booking = bookingRepository.findById(event.getBookingId());
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);
    }
}
```

**Benefits**:
- Distributed transaction management
- Eventual consistency
- Resilience (retry failed steps)

---

### 6. **Factory Pattern**

**Mục đích**: Create objects without specifying exact class

**Implementation: Payment Method Factory**
```java
public interface PaymentMethod {
    PaymentResponse processPayment(PaymentRequest request);
}

@Component
public class MoMoPaymentMethod implements PaymentMethod {
    @Override
    public PaymentResponse processPayment(PaymentRequest request) {
        // MoMo specific logic
        return momoService.createPayment(request);
    }
}

@Component
public class CreditCardPaymentMethod implements PaymentMethod {
    @Override
    public PaymentResponse processPayment(PaymentRequest request) {
        // Credit card logic
        return creditCardService.charge(request);
    }
}

@Component
public class PaymentMethodFactory {
    @Autowired
    private Map<String, PaymentMethod> paymentMethods;
    
    public PaymentMethod getPaymentMethod(String type) {
        return paymentMethods.get(type + "PaymentMethod");
    }
}

// Usage
@Service
public class PaymentService {
    @Autowired
    private PaymentMethodFactory factory;
    
    public PaymentResponse processPayment(PaymentRequest request) {
        PaymentMethod method = factory.getPaymentMethod(request.getMethod());
        return method.processPayment(request);
    }
}
```

**Benefits**:
- Easy to add new payment methods
- Loose coupling
- Single Responsibility Principle

---

### 7. **Builder Pattern**

**Mục đích**: Construct complex objects step by step

**Implementation:**
```java
@Builder
@Data
public class CreateTourRequest {
    private String tourName;
    private String description;
    private BigDecimal price;
    private int days;
    private int nights;
    private Long provinceId;
    private TourStatus status;
}

// Usage
CreateTourRequest request = CreateTourRequest.builder()
    .tourName("Sapa Adventure")
    .description("Amazing mountain tour")
    .price(new BigDecimal("2500000"))
    .days(3)
    .nights(2)
    .provinceId(1L)
    .status(TourStatus.ACTIVE)
    .build();
```

**Benefits**:
- Readable code
- Immutable objects
- Validation at build time

---

### 8. **Strategy Pattern**

**Mục đích**: Define family of algorithms, encapsulate each one

**Implementation: Review Status Strategy**
```java
public interface ReviewStatusStrategy {
    boolean canTransition(ReviewStatus from, ReviewStatus to);
    void onTransition(Review review);
}

@Component
public class ApproveReviewStrategy implements ReviewStatusStrategy {
    @Override
    public boolean canTransition(ReviewStatus from, ReviewStatus to) {
        return from == ReviewStatus.PENDING && to == ReviewStatus.APPROVED;
    }
    
    @Override
    public void onTransition(Review review) {
        review.setApprovedAt(LocalDateTime.now());
        // Send notification to user
    }
}

@Component
public class RejectReviewStrategy implements ReviewStatusStrategy {
    @Override
    public boolean canTransition(ReviewStatus from, ReviewStatus to) {
        return from == ReviewStatus.PENDING && to == ReviewStatus.REJECTED;
    }
    
    @Override
    public void onTransition(Review review) {
        review.setRejectedAt(LocalDateTime.now());
        // Send notification with reason
    }
}
```

---

### 9. **Observer Pattern (Event Listeners)**

**Mục đích**: Define one-to-many dependency between objects

**Implementation:**
```java
// Event
public class BookingCreatedEvent {
    private Long bookingId;
    private Long userId;
    private BigDecimal amount;
}

// Publisher
@Service
public class BookingService {
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    public BookingDTO createBooking(CreateBookingRequest request) {
        Booking booking = bookingRepository.save(new Booking(...));
        
        // Publish event
        eventPublisher.publishEvent(
            new BookingCreatedEvent(booking.getId(), ...)
        );
        
        return convertToDTO(booking);
    }
}

// Observers
@Component
public class EmailNotificationListener {
    @EventListener
    public void handleBookingCreated(BookingCreatedEvent event) {
        // Send confirmation email
        emailService.sendBookingConfirmation(event.getUserId());
    }
}

@Component
public class AnalyticsListener {
    @EventListener
    public void handleBookingCreated(BookingCreatedEvent event) {
        // Track analytics
        analyticsService.trackBooking(event);
    }
}
```

---

### 10. **Circuit Breaker Pattern** (Planned)

**Mục đích**: Prevent cascading failures

**Implementation (với Resilience4j):**
```java
@Service
public class TourService {
    @Autowired
    private RestTemplate restTemplate;
    
    @CircuitBreaker(name = "userService", fallbackMethod = "getUserFallback")
    public UserDTO getUser(Long userId) {
        return restTemplate.getForObject(
            "http://user-service/users/" + userId, 
            UserDTO.class
        );
    }
    
    // Fallback method
    private UserDTO getUserFallback(Long userId, Exception e) {
        // Return cached data or default user
        return new UserDTO(userId, "Unknown User", null);
    }
}
```

**Status**: Planned for future implementation

---

**Tổng kết các patterns:**

| Pattern | Purpose | Location |
|---------|---------|----------|
| API Gateway | Single entry point | api-gateway/ |
| Service Discovery | Dynamic service location | eureka-server/ |
| Repository | Data access abstraction | All services |
| DTO | Data transfer | All services |
| Saga | Distributed transactions | booking-service, payment-service |
| Factory | Object creation | payment-service |
| Builder | Complex object construction | DTOs |
| Strategy | Algorithm selection | tour-service (reviews) |
| Observer | Event handling | All services |

**Files tham khảo:**
- `tour-service/src/main/java/com/example/tour/repository/` - Repository pattern
- `tour-service/src/main/java/com/example/tour/dto/` - DTO pattern
- `booking-service/src/main/java/com/example/booking/messaging/` - Saga pattern
- `payment-service/src/main/java/com/example/payment/service/` - Factory pattern

---

[Tiếp tục với Phần 2: Backend Services...]


# Phần 2: Backend Services

## 2.1 User Service

### Q8: Giải thích về User Service và các chức năng chính?

**Trả lời ngắn:**  
User Service quản lý authentication, authorization và user management. Service này xử lý đăng ký, đăng nhập (JWT + OAuth2), quản lý user profiles và phân quyền.

**Chi tiết:**

**Chức năng chính:**

1. **Authentication**
   - Local login (username/password + JWT)
   - OAuth2 login (GitHub, Google)
   - Token generation & validation
   - Password encryption

2. **Authorization**
   - Role-based access control (ADMIN, USER)
   - JWT token verification
   - Permission management

3. **User Management**
   - User CRUD operations
   - Profile management
   - Email verification
   - Password reset

**Architecture:**
```
User Service (Port 8081)
├── Controllers
│   ├── AuthController (/auth/*)
│   └── UserController (/users/*)
├── Services
│   ├── AuthService
│   ├── UserService
│   └── OAuth2Service
├── Security
│   ├── JwtTokenProvider
│   ├── JwtAuthenticationFilter
│   └── SecurityConfig
└── Database: tour_management
    ├── users
    └── user_verification
```

**API Endpoints:**

**Authentication:**
```
POST /auth/register
POST /auth/login
POST /auth/refresh-token
POST /auth/logout
GET  /auth/github/callback
GET  /auth/google/callback
```

**User Management:**
```
GET    /users
GET    /users/{id}
POST   /users
PUT    /users/{id}
DELETE /users/{id}
GET    /users/me
PUT    /users/me/password
```

**Implementation:**

**AuthController:**
```java
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
        @Valid @RequestBody RegisterRequest request
    ) {
        UserDTO user = authService.register(request);
        String token = jwtTokenProvider.generateToken(user.getEmail());
        
        return ResponseEntity.ok(new AuthResponse(token, user));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
        @Valid @RequestBody LoginRequest request
    ) {
        UserDTO user = authService.authenticate(
            request.getEmail(), 
            request.getPassword()
        );
        String token = jwtTokenProvider.generateToken(user.getEmail());
        
        return ResponseEntity.ok(new AuthResponse(token, user));
    }
}
```

**JWT Token Generation:**
```java
@Component
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private long jwtExpiration;
    
    public String generateToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        
        return Jwts.builder()
            .setSubject(email)
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }
    
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .getBody();
        
        return claims.getSubject();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

**Password Encryption:**
```java
@Service
public class AuthService {
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private UserRepository userRepository;
    
    public UserDTO register(RegisterRequest request) {
        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        
        // Create user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.USER);
        user.setCreatedAt(LocalDateTime.now());
        
        userRepository.save(user);
        
        return convertToDTO(user);
    }
    
    public UserDTO authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new BadRequestException("Invalid credentials"));
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }
        
        return convertToDTO(user);
    }
}
```

**Security Configuration:**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors()
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests()
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers("/users/**").authenticated()
            .and()
            .addFilterBefore(jwtAuthenticationFilter, 
                UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

**Database Schema:**
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    avatar TEXT,
    role VARCHAR(20) DEFAULT 'USER',
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_verification (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    verification_token VARCHAR(255),
    token_expiry TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE
);
```

**Files tham khảo:**
- `user-service/src/main/java/com/example/user/controller/AuthController.java`
- `user-service/src/main/java/com/example/user/security/JwtTokenProvider.java`
- `user-service/src/main/java/com/example/user/config/SecurityConfig.java`
- `sql-scripts/init-databases.sql` - User tables

---

### Q9: Giải thích về OAuth2 integration (GitHub, Google)?

**Trả lời ngắn:**  
OAuth2 cho phép users đăng nhập bằng tài khoản GitHub hoặc Google mà không cần tạo password mới. User được redirect đến provider, authorize, và system nhận access token để lấy thông tin user.

**Chi tiết:**

**OAuth2 Flow:**
```
1. User clicks "Login with GitHub"
   ↓
2. Frontend redirect đến GitHub OAuth URL
   ↓
3. User authorize trên GitHub
   ↓
4. GitHub redirect về callback URL với code
   ↓
5. Backend exchange code → access token
   ↓
6. Backend dùng access token → get user info
   ↓
7. Backend tạo/update user trong database
   ↓
8. Backend generate JWT token
   ↓
9. Return JWT token cho frontend
```

**Configuration:**

**Environment Variables:**
```yaml
# docker-compose.yml
user-service:
  environment:
    - GITHUB_CLIENT_ID=Ov23liWUSMlVs3MmpqvQ
    - GITHUB_CLIENT_SECRET=180a60169755844be487bb6e56d83c0621211615
    - GITHUB_REDIRECT_URI=http://localhost:3000/auth/callback
    - GOOGLE_CLIENT_ID=647139008177-bn7pulod8unbft0k07c8rde26h8om2no.apps.googleusercontent.com
    - GOOGLE_CLIENT_SECRET=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
    - GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
```

**Backend Implementation:**

**OAuth2 Controller:**
```java
@RestController
@RequestMapping("/auth")
public class OAuth2Controller {
    @Autowired
    private OAuth2Service oauth2Service;
    
    @GetMapping("/github/callback")
    public ResponseEntity<?> githubCallback(@RequestParam String code) {
        try {
            // Exchange code for access token
            String accessToken = oauth2Service.getGitHubAccessToken(code);
            
            // Get user info from GitHub
            GitHubUser githubUser = oauth2Service.getGitHubUser(accessToken);
            
            // Create or update user in database
            UserDTO user = oauth2Service.processOAuth2User(
                githubUser.getEmail(),
                githubUser.getName(),
                githubUser.getAvatarUrl(),
                "GITHUB",
                githubUser.getId()
            );
            
            // Generate JWT token
            String jwtToken = jwtTokenProvider.generateToken(user.getEmail());
            
            // Redirect to frontend with token
            return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create("http://localhost:3000/auth/callback?token=" + jwtToken))
                .build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create("http://localhost:3000/auth/callback?error=oauth_failed"))
                .build();
        }
    }
    
    @GetMapping("/google/callback")
    public ResponseEntity<?> googleCallback(@RequestParam String code) {
        // Similar to GitHub callback
        // ...
    }
}
```

**OAuth2 Service:**
```java
@Service
public class OAuth2Service {
    @Value("${github.client-id}")
    private String githubClientId;
    
    @Value("${github.client-secret}")
    private String githubClientSecret;
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private UserRepository userRepository;
    
    public String getGitHubAccessToken(String code) {
        String url = "https://github.com/login/oauth/access_token";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        
        Map<String, String> body = new HashMap<>();
        body.put("client_id", githubClientId);
        body.put("client_secret", githubClientSecret);
        body.put("code", code);
        
        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
        
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        
        return (String) response.getBody().get("access_token");
    }
    
    public GitHubUser getGitHubUser(String accessToken) {
        String url = "https://api.github.com/user";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        
        HttpEntity<?> request = new HttpEntity<>(headers);
        
        ResponseEntity<GitHubUser> response = restTemplate.exchange(
            url, 
            HttpMethod.GET, 
            request, 
            GitHubUser.class
        );
        
        return response.getBody();
    }
    
    public UserDTO processOAuth2User(
        String email, 
        String fullName, 
        String avatar,
        String provider,
        String providerId
    ) {
        // Check if user exists
        Optional<User> existingUser = userRepository.findByEmail(email);
        
        if (existingUser.isPresent()) {
            // Update existing user
            User user = existingUser.get();
            user.setFullName(fullName);
            user.setAvatar(avatar);
            user.setOauthProvider(provider);
            user.setOauthId(providerId);
            userRepository.save(user);
            return convertToDTO(user);
        } else {
            // Create new user
            User user = new User();
            user.setEmail(email);
            user.setFullName(fullName);
            user.setAvatar(avatar);
            user.setOauthProvider(provider);
            user.setOauthId(providerId);
            user.setRole(UserRole.USER);
            user.setPassword(""); // No password for OAuth users
            userRepository.save(user);
            return convertToDTO(user);
        }
    }
}
```

**Frontend Integration:**

**React OAuth Button:**
```jsx
// frontend/src/components/auth/OAuthButtons.jsx
const OAuthButtons = () => {
  const handleGitHubLogin = () => {
    const clientId = 'Ov23liWUSMlVs3MmpqvQ';
    const redirectUri = 'http://localhost:3000/auth/callback';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
    
    window.location.href = githubAuthUrl;
  };
  
  const handleGoogleLogin = () => {
    const clientId = '647139008177-bn7pulod8unbft0k07c8rde26h8om2no.apps.googleusercontent.com';
    const redirectUri = 'http://localhost:3000/auth/callback';
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;
    
    window.location.href = googleAuthUrl;
  };
  
  return (
    <div className="space-y-3">
      <button onClick={handleGitHubLogin} className="oauth-button">
        <GitHubIcon /> Continue with GitHub
      </button>
      <button onClick={handleGoogleLogin} className="oauth-button">
        <GoogleIcon /> Continue with Google
      </button>
    </div>
  );
};
```

**Callback Handler:**
```jsx
// frontend/src/pages/AuthCallback.jsx
const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    
    if (token) {
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Redirect to home
      navigate('/');
    } else if (error) {
      // Show error message
      toast.error('OAuth login failed');
      navigate('/login');
    }
  }, [searchParams, navigate]);
  
  return <div>Processing login...</div>;
};
```

**Security Considerations:**

1. **HTTPS Required**: OAuth2 requires HTTPS in production
2. **State Parameter**: Should add state parameter to prevent CSRF
3. **Token Storage**: JWT token stored in localStorage (consider httpOnly cookies)
4. **Scope Limitation**: Only request necessary scopes (email, profile)

**Benefits:**
- **Better UX**: Users không cần tạo password mới
- **Security**: Dùng OAuth provider's security
- **Trust**: Users tin tưởng GitHub/Google hơn unknown sites

**Files tham khảo:**
- `user-service/src/main/java/com/example/user/controller/OAuth2Controller.java`
- `user-service/src/main/java/com/example/user/service/OAuth2Service.java`
- `frontend/src/components/auth/OAuthButtons.jsx`
- `docker-compose.yml` - OAuth env vars (lines 114-119)

---

## 2.2 Tour Service

### Q10: Giải thích về Tour Service và các chức năng chính?

**Trả lời ngắn:**  
Tour Service là service lớn nhất, quản lý tours, departures, schedules, images, discounts, reviews và locations (provinces/regions). Service này xử lý tất cả business logic liên quan đến tour du lịch.

**Chi tiết:**

**Chức năng chính:**

1. **Tour Management**
   - CRUD operations cho tours
   - Search & filter tours
   - Tour status management (ACTIVE, INACTIVE)
   - Slug generation cho SEO

2. **Departure Management**
   - Quản lý ngày khởi hành
   - Seat availability tracking
   - Status management (ACTIVE, FULL, END)
   - Duration validation

3. **Schedule Management**
   - Tour itineraries (day by day)
   - Activities & descriptions
   - Time management

4. **Image Management**
   - Upload images to Cloudinary
   - Primary image selection
   - Image ordering

5. **Discount Management**
   - Promotional codes
   - Percentage/fixed discounts
   - Date range validity

6. **Review & Rating System**
   - User reviews & ratings
   - Admin moderation (PENDING → APPROVED/REJECTED)
   - Rating statistics & distribution

7. **Location Management**
   - Regions & Provinces hierarchy
   - Tour location categorization

**Architecture:**
```
Tour Service (Port 8082)
├── Controllers
│   ├── TourController
│   ├── DepartureController
│   ├── ScheduleController
│   ├── ImageController
│   ├── DiscountController
│   ├── ReviewController
│   ├── ProvinceController
│   └── RegionController
├── Services
│   ├── TourService
│   ├── DepartureService
│   ├── ReviewService
│   └── CloudinaryService
├── Messaging
│   └── ReservationListener (RabbitMQ)
└── Database: tour_management
    ├── tours
    ├── departures
    ├── tour_schedules
    ├── tour_images
    ├── tour_discounts
    ├── tour_reviews
    ├── regions
    └── provinces
```

**API Endpoints:**

**Tours:**
```
GET    /tours                    # List all tours (with pagination)
GET    /tours/{id}               # Get tour details
POST   /tours                    # Create tour (Admin)
PUT    /tours/{id}               # Update tour (Admin)
DELETE /tours/{id}               # Delete tour (Admin)
GET    /tours/search             # Search tours
GET    /tours/slug/{slug}        # Get by slug
```

**Departures:**
```
GET    /tours/{tourId}/departures
POST   /tours/{tourId}/departures
PUT    /tours/{tourId}/departures/{id}
DELETE /tours/{tourId}/departures/{id}
```

**Schedules:**
```
GET    /tours/{tourId}/schedules
POST   /tours/{tourId}/schedules
PUT    /tours/{tourId}/schedules/{id}
DELETE /tours/{tourId}/schedules/{id}
```

**Images:**
```
GET    /tours/{tourId}/images
POST   /tours/{tourId}/images
PUT    /tours/{tourId}/images/{id}
DELETE /tours/{tourId}/images/{id}
POST   /upload/image             # Upload to Cloudinary
```

**Reviews:**
```
GET    /reviews/approved
GET    /reviews/approved/tour/{tourId}
GET    /reviews/summary/{tourId}
POST   /reviews/tour/{tourId}
GET    /reviews/my-reviews
PUT    /reviews/{id}
DELETE /reviews/{id}
GET    /reviews/admin            # Admin only
PATCH  /reviews/admin/{id}/status
```

**Implementation:**

**TourController:**
```java
@RestController
@RequestMapping("/tours")
public class TourController {
    @Autowired
    private TourService tourService;
    
    @GetMapping
    public ResponseEntity<Page<TourDTO>> getAllTours(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Long provinceId,
        @RequestParam(required = false) TourStatus status
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TourDTO> tours = tourService.getAllTours(search, provinceId, status, pageable);
        return ResponseEntity.ok(tours);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TourDTO> getTourById(@PathVariable Long id) {
        TourDTO tour = tourService.getTourById(id);
        return ResponseEntity.ok(tour);
    }
    
    @PostMapping
    public ResponseEntity<TourDTO> createTour(
        @Valid @RequestBody CreateTourRequest request
    ) {
        TourDTO tour = tourService.createTour(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(tour);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TourDTO> updateTour(
        @PathVariable Long id,
        @Valid @RequestBody UpdateTourRequest request
    ) {
        TourDTO tour = tourService.updateTour(id, request);
        return ResponseEntity.ok(tour);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {
        tourService.deleteTour(id);
        return ResponseEntity.noContent().build();
    }
}
```

**TourService Implementation:**
```java
@Service
@Transactional
public class TourServiceImpl implements TourService {
    @Autowired
    private TourRepository tourRepository;
    
    @Autowired
    private ProvinceRepository provinceRepository;
    
    @Override
    public Page<TourDTO> getAllTours(
        String search, 
        Long provinceId, 
        TourStatus status,
        Pageable pageable
    ) {
        // Build specification for dynamic filtering
        Specification<Tour> spec = Specification.where(null);
        
        if (search != null && !search.isEmpty()) {
            spec = spec.and((root, query, cb) -> 
                cb.like(cb.lower(root.get("tourName")), "%" + search.toLowerCase() + "%")
            );
        }
        
        if (provinceId != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("province").get("id"), provinceId)
            );
        }
        
        if (status != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("status"), status)
            );
        }
        
        Page<Tour> tours = tourRepository.findAll(spec, pageable);
        return tours.map(this::convertToDTO);
    }
    
    @Override
    public TourDTO createTour(CreateTourRequest request) {
        // Validate province exists
        Province province = provinceRepository.findById(request.getProvinceId())
            .orElseThrow(() -> new NotFoundException("Province not found"));
        
        // Create tour
        Tour tour = new Tour();
        tour.setTourName(request.getTourName());
        tour.setDescription(request.getDescription());
        tour.setPrice(request.getPrice());
        tour.setDays(request.getDays());
        tour.setNights(request.getNights());
        tour.setProvince(province);
        tour.setStatus(TourStatus.ACTIVE);
        tour.setSlug(generateSlug(request.getTourName()));
        tour.setCreatedAt(LocalDateTime.now());
        
        tourRepository.save(tour);
        
        return convertToDTO(tour);
    }
    
    private String generateSlug(String tourName) {
        // Convert to lowercase, replace spaces with hyphens
        String slug = tourName.toLowerCase()
            .replaceAll("[^a-z0-9\\s-]", "")
            .replaceAll("\\s+", "-");
        
        // Check if slug exists, add number if needed
        int counter = 1;
        String originalSlug = slug;
        while (tourRepository.existsBySlug(slug)) {
            slug = originalSlug + "-" + counter++;
        }
        
        return slug;
    }
    
    private TourDTO convertToDTO(Tour tour) {
        TourDTO dto = new TourDTO();
        dto.setTourId(tour.getId());
        dto.setTourName(tour.getTourName());
        dto.setDescription(tour.getDescription());
        dto.setPrice(tour.getPrice());
        dto.setDays(tour.getDays());
        dto.setNights(tour.getNights());
        dto.setProvinceName(tour.getProvince().getProvinceName());
        dto.setStatus(tour.getStatus());
        dto.setSlug(tour.getSlug());
        dto.setCreatedAt(tour.getCreatedAt());
        return dto;
    }
}
```

**Database Schema:**
```sql
CREATE TABLE tours (
    id BIGSERIAL PRIMARY KEY,
    tour_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    days INTEGER NOT NULL,
    nights INTEGER NOT NULL,
    province_id BIGINT REFERENCES provinces(id),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departures (
    id BIGSERIAL PRIMARY KEY,
    tour_id BIGINT REFERENCES tours(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_slots INTEGER NOT NULL,
    remaining_slots INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tour_schedules (
    id BIGSERIAL PRIMARY KEY,
    tour_id BIGINT REFERENCES tours(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    title VARCHAR(255),
    description TEXT,
    activities TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tour_images (
    id BIGSERIAL PRIMARY KEY,
    tour_id BIGINT REFERENCES tours(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Cloudinary Integration:**
```java
@Service
public class CloudinaryService {
    @Autowired
    private Cloudinary cloudinary;
    
    public String uploadImage(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(
            file.getBytes(),
            ObjectUtils.asMap(
                "folder", "bookingtour/tours",
                "resource_type", "image"
            )
        );
        
        return (String) uploadResult.get("secure_url");
    }
    
    public void deleteImage(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}

@Configuration
public class CloudinaryConfig {
    @Value("${cloudinary.cloud-name}")
    private String cloudName;
    
    @Value("${cloudinary.api-key}")
    private String apiKey;
    
    @Value("${cloudinary.api-secret}")
    private String apiSecret;
    
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", cloudName,
            "api_key", apiKey,
            "api_secret", apiSecret
        ));
    }
}
```

**Files tham khảo:**
- `tour-service/src/main/java/com/example/tour/controller/TourController.java`
- `tour-service/src/main/java/com/example/tour/service/impl/TourServiceImpl.java`
- `tour-service/src/main/java/com/example/tour/service/CloudinaryService.java`
- `sql-scripts/init-databases.sql` - Tour tables

---

### Q11: Giải thích về Departure Management và seat reservation?

**Trả lời ngắn:**  
Departure management quản lý các ngày khởi hành của tour với số chỗ available. Khi user đặt tour, system reserve seats thông qua RabbitMQ event, đảm bảo không overbooking.

**Chi tiết:**

**Departure Lifecycle:**
```
1. Admin tạo departure
   - Tour: "Sapa 3N2Đ"
   - Start: 2025-12-01
   - End: 2025-12-03
   - Total slots: 20
   - Remaining slots: 20
   - Status: ACTIVE

2. User đặt 2 chỗ
   - Remaining slots: 18
   - Status: ACTIVE

3. Đặt thêm 18 chỗ
   - Remaining slots: 0
   - Status: FULL (auto-update)

4. Ngày khởi hành qua
   - Status: END (auto-update)
```

**DepartureController:**
```java
@RestController
@RequestMapping("/tours/{tourId}/departures")
public class DepartureController {
    @Autowired
    private DepartureService departureService;
    
    @GetMapping
    public ResponseEntity<List<DepartureDTO>> getDepartures(
        @PathVariable Long tourId,
        @RequestParam(required = false) LocalDate from,
        @RequestParam(required = false) LocalDate to,
        @RequestParam(required = false) String status
    ) {
        List<DepartureDTO> departures = departureService.listDepartures(
            tourId, from, to, status
        );
        return ResponseEntity.ok(departures);
    }
    
    @PostMapping
    public ResponseEntity<DepartureDTO> createDeparture(
        @PathVariable Long tourId,
        @Valid @RequestBody CreateDepartureRequest request
    ) {
        DepartureDTO departure = departureService.addDeparture(tourId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(departure);
    }
    
    @PutMapping("/{departureId}")
    public ResponseEntity<DepartureDTO> updateDeparture(
        @PathVariable Long tourId,
        @PathVariable Long departureId,
        @Valid @RequestBody UpdateDepartureRequest request
    ) {
        DepartureDTO departure = departureService.updateDeparture(
            tourId, departureId, request
        );
        return ResponseEntity.ok(departure);
    }
}
```

**DepartureService - Validation Logic:**
```java
@Service
@Transactional
public class DepartureServiceImpl implements DepartureService {
    @Autowired
    private DepartureRepository departureRepository;
    
    @Autowired
    private TourRepository tourRepository;
    
    @Override
    public DepartureDTO addDeparture(Long tourId, CreateDepartureRequest request) {
        // Validate required fields
        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new BadRequestException("Start date and end date are required");
        }
        
        // Validate dates
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date must be after start date");
        }
        
        // Get tour
        Tour tour = tourRepository.findById(tourId)
            .orElseThrow(() -> new NotFoundException("Tour not found"));
        
        // Validate duration matches tour
        validateDepartureDuration(request.getStartDate(), request.getEndDate(), tour);
        
        // Create departure
        Departure departure = new Departure();
        departure.setTour(tour);
        departure.setStartDate(request.getStartDate());
        departure.setEndDate(request.getEndDate());
        departure.setTotalSlots(request.getTotalSlots());
        departure.setRemainingSlots(request.getTotalSlots());
        departure.setStatus(DepartureStatus.ACTIVE);
        departure.setCreatedAt(LocalDateTime.now());
        
        departureRepository.save(departure);
        
        return convertToDTO(departure);
    }
    
    private void validateDepartureDuration(LocalDate startDate, LocalDate endDate, Tour tour) {
        // Calculate actual days between start and end (inclusive)
        long daysBetween = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        
        // Check if it matches the tour's duration
        if (daysBetween != tour.getDays()) {
            LocalDate expectedEndDate = startDate.plusDays(tour.getDays() - 1);
            throw new BadRequestException(
                String.format(
                    "Departure duration mismatch. Tour is %d days, but departure is %d days. " +
                    "For start date %s, end date should be %s",
                    tour.getDays(), daysBetween, startDate, expectedEndDate
                )
            );
        }
    }
    
    @Override
    public DepartureDTO updateDeparture(
        Long tourId, 
        Long departureId, 
        UpdateDepartureRequest request
    ) {
        Departure departure = getDepartureForTour(tourId, departureId);
        
        // Update dates if provided
        if (request.getStartDate() != null) {
            departure.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            departure.setEndDate(request.getEndDate());
        }
        
        // Validate duration after updating dates
        if (request.getStartDate() != null || request.getEndDate() != null) {
            validateDepartureDuration(
                departure.getStartDate(), 
                departure.getEndDate(), 
                departure.getTour()
            );
        }
        
        // Update total slots if provided
        if (request.getTotalSlots() != null) {
            int reserved = departure.getTotalSlots() - departure.getRemainingSlots();
            if (request.getTotalSlots() < reserved) {
                throw new BadRequestException(
                    "Total slots cannot be smaller than already reserved seats (" + reserved + ")"
                );
            }
            departure.setTotalSlots(request.getTotalSlots());
            departure.setRemainingSlots(request.getTotalSlots() - reserved);
        }
        
        // Update status
        refreshStatus(departure);
        
        departureRepository.save(departure);
        
        return convertToDTO(departure);
    }
    
    private void refreshStatus(Departure departure) {
        DepartureStatus newStatus = calculateStatus(departure);
        departure.setStatus(newStatus);
    }
    
    private DepartureStatus calculateStatus(Departure departure) {
        LocalDate today = LocalDate.now();
        
        // If end date has passed
        if (departure.getEndDate().isBefore(today)) {
            return DepartureStatus.END;
        }
        
        // If no remaining slots
        if (departure.getRemainingSlots() <= 0) {
            return DepartureStatus.FULL;
        }
        
        // Otherwise active
        return DepartureStatus.ACTIVE;
    }
}
```

**Seat Reservation via RabbitMQ:**

**ReservationListener:**
```java
@Component
public class ReservationListener {
    @Autowired
    private DepartureRepository departureRepository;
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    @RabbitListener(queues = "reservation.request.queue")
    public void handleReservationRequest(ReservationRequest request) {
        log.info("Received reservation request: {}", request);
        
        try {
            // Find departure
            Departure departure = departureRepository.findById(request.getDepartureId())
                .orElseThrow(() -> new NotFoundException("Departure not found"));
            
            // Check if enough seats available
            if (departure.getRemainingSlots() < request.getSeats()) {
                // Publish failure event
                ReservationResponse response = new ReservationResponse();
                response.setBookingId(request.getBookingId());
                response.setSuccess(false);
                response.setMessage("Not enough seats available");
                
                rabbitTemplate.convertAndSend(
                    "reservation.exchange",
                    "reservation.failure",
                    response
                );
                return;
            }
            
            // Reserve seats
            departure.setRemainingSlots(departure.getRemainingSlots() - request.getSeats());
            
            // Update status if needed
            if (departure.getRemainingSlots() == 0) {
                departure.setStatus(DepartureStatus.FULL);
            }
            
            departureRepository.save(departure);
            
            // Publish success event
            ReservationResponse response = new ReservationResponse();
            response.setBookingId(request.getBookingId());
            response.setSuccess(true);
            response.setMessage("Seats reserved successfully");
            
            rabbitTemplate.convertAndSend(
                "reservation.exchange",
                "reservation.success",
                response
            );
            
            log.info("Seats reserved successfully for booking {}", request.getBookingId());
            
        } catch (Exception e) {
            log.error("Error processing reservation request", e);
            
            // Publish failure event
            ReservationResponse response = new ReservationResponse();
            response.setBookingId(request.getBookingId());
            response.setSuccess(false);
            response.setMessage("Error: " + e.getMessage());
            
            rabbitTemplate.convertAndSend(
                "reservation.exchange",
                "reservation.failure",
                response
            );
        }
    }
}
```

**RabbitMQ Configuration:**
```java
@Configuration
public class RabbitMQConfig {
    @Bean
    public TopicExchange reservationExchange() {
        return new TopicExchange("reservation.exchange");
    }
    
    @Bean
    public Queue reservationRequestQueue() {
        return new Queue("reservation.request.queue", true);
    }
    
    @Bean
    public Queue reservationSuccessQueue() {
        return new Queue("reservation.success.queue", true);
    }
    
    @Bean
    public Queue reservationFailureQueue() {
        return new Queue("reservation.failure.queue", true);
    }
    
    @Bean
    public Binding reservationRequestBinding() {
        return BindingBuilder
            .bind(reservationRequestQueue())
            .to(reservationExchange())
            .with("reservation.request");
    }
    
    @Bean
    public Binding reservationSuccessBinding() {
        return BindingBuilder
            .bind(reservationSuccessQueue())
            .to(reservationExchange())
            .with("reservation.success");
    }
    
    @Bean
    public Binding reservationFailureBinding() {
        return BindingBuilder
            .bind(reservationFailureQueue())
            .to(reservationExchange())
            .with("reservation.failure");
    }
}
```

**Concurrency Handling:**

**Problem**: 2 users cùng đặt chỗ cuối cùng cùng lúc

**Solution**: Database transaction + optimistic locking

```java
@Entity
@Table(name = "departures")
public class Departure {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // ... other fields
    
    @Version
    private Long version;  // Optimistic locking
    
    private Integer remainingSlots;
}

// When updating
@Transactional(isolation = Isolation.SERIALIZABLE)
public void reserveSeats(Long departureId, int seats) {
    Departure departure = departureRepository.findById(departureId)
        .orElseThrow(() -> new NotFoundException("Departure not found"));
    
    if (departure.getRemainingSlots() < seats) {
        throw new BadRequestException("Not enough seats");
    }
    
    departure.setRemainingSlots(departure.getRemainingSlots() - seats);
    departureRepository.save(departure);
    
    // If version changed, OptimisticLockException will be thrown
}
```

**Files tham khảo:**
- `tour-service/src/main/java/com/example/tour/controller/DepartureController.java`
- `tour-service/src/main/java/com/example/tour/service/impl/DepartureServiceImpl.java`
- `tour-service/src/main/java/com/example/tour/messaging/ReservationListener.java`
- `tour-service/src/main/java/com/example/tour/config/RabbitMQConfig.java`

---

[Tiếp tục với Q12-Q20 về Booking Service, Payment Service, Review System...]


# Phần 3-10: Frontend, Database, RabbitMQ, Deployment, Testing, Security, Performance, Challenges

---

# Phần 3: Frontend

## Q20: Giải thích về Frontend architecture (Client + Admin)?

**Trả lời ngắn:**  
Project có 2 frontend applications: Client frontend (port 3000) cho end-users và Admin frontend (port 5174) cho quản trị viên. Cả 2 đều dùng React 18 + Vite + TailwindCSS, gọi API thông qua API Gateway.

**Chi tiết:**

**Client Frontend (Port 3000):**
```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/          # OAuth buttons, login forms
│   │   ├── booking/       # Booking flow, timeline
│   │   ├── home/          # Hero, filters, search
│   │   ├── reviews/       # Review display, form
│   │   └── common/        # Reusable UI components
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── TourDetail.jsx
│   │   ├── BookingPage.jsx
│   │   ├── MyBookings.jsx
│   │   └── MyReviews.jsx
│   ├── services/
│   │   └── api.ts         # API client
│   └── context/
│       └── AuthContext.tsx
```

**Admin Frontend (Port 5174):**
```
frontend-admin/
├── src/
│   ├── components/
│   │   ├── common/        # Table, Card, Button, etc.
│   │   ├── tours/         # Tour management
│   │   ├── departures/    # Departure management
│   │   ├── bookings/      # Booking management
│   │   └── reviews/       # Review moderation
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Tours/
│   │   ├── Departures/
│   │   ├── Bookings/
│   │   ├── Reviews/
│   │   └── Users/
│   ├── services/
│   │   └── api.js
│   └── context/
│       └── AuthContext.jsx
```

**Tech Stack:**
- React 18
- Vite (build tool)
- TailwindCSS (styling)
- React Router DOM (routing)
- React Hook Form (form handling)
- Framer Motion (animations)
- Lucide React (icons)

**API Integration:**
```javascript
// frontend-admin/src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const getAdminHeaders = () => {
  const token = localStorage.getItem('bt-admin-token');
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  } : {
    'Content-Type': 'application/json',
  };
};

async function fetchAdminAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAdminHeaders(),
    ...options,
  };
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

export const toursAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/tours${query ? `?${query}` : ''}`);
  },
  getById: (tourId) => fetchAPI(`/tours/${tourId}`),
  create: (tourData) => fetchAPI('/tours', {
    method: 'POST',
    body: JSON.stringify(tourData),
  }),
  update: (tourId, tourData) => fetchAPI(`/tours/${tourId}`, {
    method: 'PUT',
    body: JSON.stringify(tourData),
  }),
  delete: (tourId) => fetchAPI(`/tours/${tourId}`, {
    method: 'DELETE',
  }),
};
```

**Key Features:**

1. **Authentication**
   - JWT token storage in localStorage
   - Auto-redirect on 401
   - OAuth2 integration

2. **State Management**
   - React Context for auth
   - Local state with useState
   - Form state with React Hook Form

3. **Routing**
   - Protected routes
   - Dynamic routing
   - Nested routes

4. **UI/UX**
   - Responsive design
   - Loading states
   - Error handling
   - Toast notifications

**Files tham khảo:**
- `frontend/src/` - Client frontend
- `frontend-admin/src/` - Admin frontend
- `frontend/package.json` - Dependencies
- `frontend-admin/package.json` - Dependencies

---

# Phần 4: Database

## Q25: Giải thích về database schema và relationships?

**Trả lời ngắn:**  
Project sử dụng 3 PostgreSQL databases: `tour_management` (shared by User & Tour services), `bookingdb` (Booking service), và `paymentdb` (Payment service). Schema được thiết kế với proper relationships, indexes và constraints.

**Chi tiết:**

**Database 1: tour_management**

**Users & Authentication:**
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    avatar TEXT,
    role VARCHAR(20) DEFAULT 'USER',
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_oauth ON users(oauth_provider, oauth_id);

CREATE TABLE user_verification (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    verification_token VARCHAR(255),
    token_expiry TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE
);
```

**Location Hierarchy:**
```sql
CREATE TABLE regions (
    id BIGSERIAL PRIMARY KEY,
    region_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE provinces (
    id BIGSERIAL PRIMARY KEY,
    province_name VARCHAR(100) NOT NULL,
    region_id BIGINT REFERENCES regions(id),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_provinces_region ON provinces(region_id);
```

**Tours & Related:**
```sql
CREATE TABLE tours (
    id BIGSERIAL PRIMARY KEY,
    tour_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    days INTEGER NOT NULL,
    nights INTEGER NOT NULL,
    province_id BIGINT REFERENCES provinces(id),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tours_province ON tours(province_id);
CREATE INDEX idx_tours_status ON tours(status);
CREATE INDEX idx_tours_slug ON tours(slug);

CREATE TABLE departures (
    id BIGSERIAL PRIMARY KEY,
    tour_id BIGINT REFERENCES tours(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_slots INTEGER NOT NULL,
    remaining_slots INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_slots CHECK (remaining_slots >= 0 AND remaining_slots <= total_slots)
);

CREATE INDEX idx_departures_tour ON departures(tour_id);
CREATE INDEX idx_departures_dates ON departures(start_date, end_date);
CREATE INDEX idx_departures_status ON departures(status);

CREATE TABLE tour_schedules (
    id BIGSERIAL PRIMARY KEY,
    tour_id BIGINT REFERENCES tours(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    title VARCHAR(255),
    description TEXT,
    activities TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_day_number CHECK (day_number > 0)
);

CREATE INDEX idx_schedules_tour ON tour_schedules(tour_id);

CREATE TABLE tour_images (
    id BIGSERIAL PRIMARY KEY,
    tour_id BIGINT REFERENCES tours(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_images_tour ON tour_images(tour_id);

CREATE TABLE tour_discounts (
    id BIGSERIAL PRIMARY KEY,
    tour_id BIGINT REFERENCES tours(id) ON DELETE CASCADE,
    discount_code VARCHAR(50) UNIQUE,
    discount_type VARCHAR(20) NOT NULL, -- PERCENTAGE, FIXED
    discount_value DECIMAL(10,2) NOT NULL,
    valid_from DATE,
    valid_to DATE,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_discounts_code ON tour_discounts(discount_code);

CREATE TABLE tour_reviews (
    id BIGSERIAL PRIMARY KEY,
    tour_id BIGINT REFERENCES tours(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    guest_name VARCHAR(255),
    guest_avatar TEXT,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    badges TEXT[], -- Array of badges
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_tour ON tour_reviews(tour_id);
CREATE INDEX idx_reviews_user ON tour_reviews(user_id);
CREATE INDEX idx_reviews_status ON tour_reviews(status);
```

**Database 2: bookingdb**
```sql
CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    tour_id BIGINT NOT NULL,
    departure_id BIGINT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    seats INTEGER NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, CONFIRMED, CANCELLED, FAILED
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_departure ON bookings(departure_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(booking_date);

CREATE TABLE booking_guests (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT REFERENCES bookings(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    id_number VARCHAR(50),
    date_of_birth DATE,
    guest_type VARCHAR(20), -- ADULT, CHILD
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_guests_booking ON booking_guests(booking_id);

CREATE TABLE booking_logs (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT REFERENCES bookings(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_logs_booking ON booking_logs(booking_id);
```

**Database 3: paymentdb**
```sql
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED, REFUNDED
    transaction_id VARCHAR(255),
    momo_order_id VARCHAR(255),
    momo_request_id VARCHAR(255),
    payment_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);

CREATE TABLE payment_methods (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    method_type VARCHAR(50) NOT NULL,
    card_last_four VARCHAR(4),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_methods_user ON payment_methods(user_id);

CREATE TABLE refunds (
    id BIGSERIAL PRIMARY KEY,
    payment_id BIGINT REFERENCES payments(id),
    amount DECIMAL(15,2) NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refunds_payment ON refunds(payment_id);
```

**Key Design Decisions:**

1. **Indexes**: Thêm indexes cho foreign keys và columns thường query
2. **Constraints**: CHECK constraints để validate data
3. **Cascading**: ON DELETE CASCADE cho child records
4. **Timestamps**: created_at và updated_at cho audit trail
5. **Enums**: Dùng VARCHAR cho status (dễ extend hơn ENUM type)

**Files tham khảo:**
- `sql-scripts/init-databases.sql` - tour_management schema
- `sql-scripts/init-booking-db.sql` - bookingdb schema
- `sql-scripts/init-payment-db.sql` - paymentdb schema

---

# Phần 5: Message Broker (RabbitMQ)

## Q30: Giải thích về RabbitMQ và event-driven architecture?

**Trả lời ngắn:**  
RabbitMQ là message broker cho phép services giao tiếp async. Trong project, RabbitMQ được dùng cho booking flow: Booking Service publish events, Tour Service reserve seats, Payment Service xử lý payment, tất cả thông qua message queues.

**Chi tiết:**

**Event Flow: Booking → Payment**
```
1. User tạo booking
   ↓
2. Booking Service:
   - Tạo booking (PENDING)
   - Publish: "reservation.request" → reservation.exchange
   ↓
3. Tour Service:
   - Listen: "reservation.request"
   - Reserve seats
   - Publish: "reservation.success" → reservation.exchange
   ↓
4. Booking Service:
   - Listen: "reservation.success"
   - Publish: "payment.charge" → payment.exchange
   ↓
5. Payment Service:
   - Listen: "payment.charge"
   - Process payment (MoMo API)
   - Publish: "payment.completed" → payment.exchange
   ↓
6. Booking Service:
   - Listen: "payment.completed"
   - Update booking: CONFIRMED
```

**RabbitMQ Architecture:**
```
Exchanges (Topic):
├── reservation.exchange
│   ├── reservation.request.queue
│   ├── reservation.success.queue
│   └── reservation.failure.queue
│
└── payment.exchange
    ├── payment.charge.queue
    ├── payment.completed.queue
    └── payment.failed.queue
```

**Configuration:**
```yaml
# docker-compose.yml
rabbitmq:
  image: rabbitmq:3-management-alpine
  ports:
    - "5672:5672"      # AMQP port
    - "15672:15672"    # Management UI
  environment:
    - RABBITMQ_DEFAULT_USER=guest
    - RABBITMQ_DEFAULT_PASS=guest
```

**Spring Boot Configuration:**
```java
@Configuration
public class RabbitMQConfig {
    // Exchanges
    @Bean
    public TopicExchange reservationExchange() {
        return new TopicExchange("reservation.exchange");
    }
    
    @Bean
    public TopicExchange paymentExchange() {
        return new TopicExchange("payment.exchange");
    }
    
    // Queues
    @Bean
    public Queue reservationRequestQueue() {
        return new Queue("reservation.request.queue", true); // durable
    }
    
    @Bean
    public Queue reservationSuccessQueue() {
        return new Queue("reservation.success.queue", true);
    }
    
    @Bean
    public Queue paymentChargeQueue() {
        return new Queue("payment.charge.queue", true);
    }
    
    @Bean
    public Queue paymentCompletedQueue() {
        return new Queue("payment.completed.queue", true);
    }
    
    // Bindings
    @Bean
    public Binding reservationRequestBinding() {
        return BindingBuilder
            .bind(reservationRequestQueue())
            .to(reservationExchange())
            .with("reservation.request");
    }
    
    @Bean
    public Binding reservationSuccessBinding() {
        return BindingBuilder
            .bind(reservationSuccessQueue())
            .to(reservationExchange())
            .with("reservation.success");
    }
    
    // Message converter
    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
    
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}
```

**Publisher (Booking Service):**
```java
@Service
public class BookingService {
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    public BookingDTO createBooking(CreateBookingRequest request) {
        // Create booking
        Booking booking = new Booking();
        booking.setStatus(BookingStatus.PENDING);
        bookingRepository.save(booking);
        
        // Publish reservation request event
        ReservationRequest event = new ReservationRequest();
        event.setBookingId(booking.getId());
        event.setDepartureId(request.getDepartureId());
        event.setSeats(request.getSeats());
        event.setTimestamp(LocalDateTime.now());
        
        rabbitTemplate.convertAndSend(
            "reservation.exchange",
            "reservation.request",
            event
        );
        
        log.info("Published reservation request for booking {}", booking.getId());
        
        return convertToDTO(booking);
    }
}
```

**Consumer (Tour Service):**
```java
@Component
public class ReservationListener {
    @Autowired
    private DepartureRepository departureRepository;
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    @RabbitListener(queues = "reservation.request.queue")
    public void handleReservationRequest(ReservationRequest request) {
        log.info("Received reservation request: {}", request);
        
        try {
            // Reserve seats
            Departure departure = departureRepository.findById(request.getDepartureId())
                .orElseThrow(() -> new NotFoundException("Departure not found"));
            
            if (departure.getRemainingSlots() < request.getSeats()) {
                throw new BadRequestException("Not enough seats");
            }
            
            departure.setRemainingSlots(departure.getRemainingSlots() - request.getSeats());
            departureRepository.save(departure);
            
            // Publish success event
            ReservationResponse response = new ReservationResponse();
            response.setBookingId(request.getBookingId());
            response.setSuccess(true);
            response.setTimestamp(LocalDateTime.now());
            
            rabbitTemplate.convertAndSend(
                "reservation.exchange",
                "reservation.success",
                response
            );
            
            log.info("Seats reserved successfully");
            
        } catch (Exception e) {
            log.error("Error reserving seats", e);
            
            // Publish failure event
            ReservationResponse response = new ReservationResponse();
            response.setBookingId(request.getBookingId());
            response.setSuccess(false);
            response.setMessage(e.getMessage());
            
            rabbitTemplate.convertAndSend(
                "reservation.exchange",
                "reservation.failure",
                response
            );
        }
    }
}
```

**Error Handling:**

1. **Retry Logic**:
```java
@Bean
public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
    ConnectionFactory connectionFactory
) {
    SimpleRabbitListenerContainerFactory factory = 
        new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(connectionFactory);
    factory.setMessageConverter(messageConverter());
    factory.setDefaultRequeueRejected(false); // Don't requeue on error
    factory.setAdviceChain(
        RetryInterceptorBuilder.stateless()
            .maxAttempts(3)
            .backOffOptions(1000, 2.0, 10000) // Initial, multiplier, max
            .build()
    );
    return factory;
}
```

2. **Dead Letter Queue**:
```java
@Bean
public Queue reservationDLQ() {
    return new Queue("reservation.request.dlq");
}

@Bean
public Queue reservationRequestQueue() {
    Map<String, Object> args = new HashMap<>();
    args.put("x-dead-letter-exchange", "");
    args.put("x-dead-letter-routing-key", "reservation.request.dlq");
    return new Queue("reservation.request.queue", true, false, false, args);
}
```

**Benefits:**
- **Async processing**: Không block user request
- **Decoupling**: Services không cần biết nhau
- **Reliability**: Messages được persist, không mất khi service down
- **Scalability**: Có thể add nhiều consumers

**Monitoring:**
- RabbitMQ Management UI: `http://localhost:15672`
- Username/Password: guest/guest
- Xem queues, exchanges, messages, connections

**Files tham khảo:**
- `booking-service/src/main/java/com/example/booking/config/RabbitMQConfig.java`
- `tour-service/src/main/java/com/example/tour/messaging/ReservationListener.java`
- `payment-service/src/main/java/com/example/payment/messaging/PaymentListener.java`

---

# Phần 6: Deployment & DevOps

## Q35: Giải thích về Docker và deployment strategy?

**Trả lời ngắn:**  
Project sử dụng Docker để containerize tất cả services và Docker Compose để orchestrate. Mỗi service có Dockerfile riêng, tất cả được define trong docker-compose.yml với proper dependencies và health checks.

**Chi tiết:**

**Docker Architecture:**
```
Docker Compose
├── 3x PostgreSQL containers
├── 1x RabbitMQ container
├── 1x Eureka Server container
├── 1x API Gateway container
├── 4x Microservice containers
│   ├── User Service
│   ├── Tour Service
│   ├── Booking Service
│   └── Payment Service
└── 2x Frontend containers
    ├── Client Frontend
    └── Admin Frontend
```

**Dockerfile Example (Spring Boot Service):**
```dockerfile
# tour-service/Dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/tour-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Dockerfile Example (React Frontend):**
```dockerfile
# frontend-admin/Dockerfile
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 5174
CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose Configuration:**
```yaml
version: '3.8'

services:
  # Database services
  postgres-db:
    image: postgres:15-alpine
    container_name: postgres-db
    environment:
      POSTGRES_DB: tour_management
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./sql-scripts/init-databases.sql:/docker-entrypoint-initdb.d/1-init-databases.sql
    networks:
      - microservices-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
  
  # Service Discovery
  eureka-server:
    build: ./eureka-server
    container_name: eureka-server
    ports:
      - "8761:8761"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
    networks:
      - microservices-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8761/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 5
  
  # API Gateway
  api-gateway:
    build: ./api-gateway
    container_name: api-gateway
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://eureka-server:8761/eureka/
    depends_on:
      eureka-server:
        condition: service_healthy
    networks:
      - microservices-network
  
  # Microservices
  user-service:
    build: ./user-service
    container_name: user-service
    ports:
      - "8081:8081"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://eureka-server:8761/eureka/
    depends_on:
      eureka-server:
        condition: service_healthy
      postgres-db:
        condition: service_healthy
    networks:
      - microservices-network

networks:
  microservices-network:
    driver: bridge

volumes:
  postgres_data:
  booking_data:
  payment_data:
```

**Deployment Commands:**

**Build all services:**
```bash
# Build Spring Boot services
cd user-service && mvn clean package -DskipTests
cd tour-service && mvn clean package -DskipTests
cd booking-service && mvn clean package -DskipTests
cd payment-service && mvn clean package -DskipTests
cd api-gateway && mvn clean package -DskipTests
cd eureka-server && mvn clean package -DskipTests

# Build frontend
cd frontend && npm run build
cd frontend-admin && npm run build
```

**Start all containers:**
```bash
docker-compose up --build -d
```

**View logs:**
```bash
docker-compose logs -f
docker-compose logs -f user-service
docker-compose logs -f tour-service
```

**Stop all containers:**
```bash
docker-compose down
docker-compose down -v  # Also remove volumes
```

**Health Checks:**
- Eureka: `http://localhost:8761/actuator/health`
- API Gateway: `http://localhost:8080/actuator/health`
- User Service: `http://localhost:8081/actuator/health`
- Tour Service: `http://localhost:8082/actuator/health`

**Environment Configuration:**

**Development (application.yml):**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/tour_management
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

**Docker (application-docker.yml):**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://postgres-db:5432/tour_management
eureka:
  client:
    service-url:
      defaultZone: http://eureka-server:8761/eureka/
```

**Benefits:**
- **Consistency**: Same environment dev → prod
- **Isolation**: Each service in own container
- **Scalability**: Easy to scale services
- **Portability**: Run anywhere Docker runs

**Files tham khảo:**
- `docker-compose.yml` - Full orchestration
- `*/Dockerfile` - Service dockerfiles
- `*/src/main/resources/application-docker.yml` - Docker configs

---

# Phần 7: Testing

## Q40: Giải thích về testing strategy?

**Trả lời ngắn:**  
Project có 3 levels of testing: Unit tests (JUnit), Integration tests (Spring Boot Test), và E2E tests (Playwright). Postman collection được dùng cho API testing.

**Chi tiết:**

**1. Unit Testing (JUnit 5)**
```java
@SpringBootTest
class TourServiceTest {
    @Mock
    private TourRepository tourRepository;
    
    @Mock
    private ProvinceRepository provinceRepository;
    
    @InjectMocks
    private TourServiceImpl tourService;
    
    @Test
    void createTour_Success() {
        // Arrange
        Province province = new Province();
        province.setId(1L);
        
        when(provinceRepository.findById(1L)).thenReturn(Optional.of(province));
        when(tourRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        
        CreateTourRequest request = new CreateTourRequest();
        request.setTourName("Sapa Tour");
        request.setProvinceId(1L);
        
        // Act
        TourDTO result = tourService.createTour(request);
        
        // Assert
        assertNotNull(result);
        assertEquals("Sapa Tour", result.getTourName());
        verify(tourRepository, times(1)).save(any());
    }
    
    @Test
    void createTour_ProvinceNotFound_ThrowsException() {
        // Arrange
        when(provinceRepository.findById(1L)).thenReturn(Optional.empty());
        
        CreateTourRequest request = new CreateTourRequest();
        request.setProvinceId(1L);
        
        // Act & Assert
        assertThrows(NotFoundException.class, () -> {
            tourService.createTour(request);
        });
    }
}
```

**2. Integration Testing**
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase
class TourControllerIntegrationTest {
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Autowired
    private TourRepository tourRepository;
    
    @BeforeEach
    void setUp() {
        tourRepository.deleteAll();
    }
    
    @Test
    void getAllTours_ReturnsPageOfTours() {
        // Arrange
        Tour tour1 = new Tour();
        tour1.setTourName("Sapa Tour");
        tourRepository.save(tour1);
        
        Tour tour2 = new Tour();
        tour2.setTourName("Halong Bay Tour");
        tourRepository.save(tour2);
        
        // Act
        ResponseEntity<Page<TourDTO>> response = restTemplate.exchange(
            "/tours?page=0&size=10",
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<Page<TourDTO>>() {}
        );
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().getTotalElements());
    }
}
```

**3. E2E Testing (Playwright)**
```typescript
// frontend-admin/tests/tours.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Tours', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('http://localhost:5174/auth/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:5174/');
  });
  
  test('should create new tour', async ({ page }) => {
    // Navigate to tours
    await page.goto('http://localhost:5174/tours');
    
    // Click create button
    await page.click('text=Create Tour');
    
    // Fill form
    await page.fill('input[name="tourName"]', 'Test Tour');
    await page.fill('textarea[name="description"]', 'Test description');
    await page.fill('input[name="price"]', '2500000');
    await page.fill('input[name="days"]', '3');
    await page.fill('input[name="nights"]', '2');
    await page.selectOption('select[name="provinceId"]', '1');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify success
    await expect(page.locator('text=Tour created successfully')).toBeVisible();
    await expect(page).toHaveURL(/\/tours$/);
  });
  
  test('should edit existing tour', async ({ page }) => {
    // ... test edit functionality
  });
  
  test('should delete tour', async ({ page }) => {
    // ... test delete functionality
  });
});
```

**4. API Testing (Postman)**
```json
{
  "info": {
    "name": "BookingTour API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Tours",
      "item": [
        {
          "name": "Get All Tours",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "http://localhost:8080/api/tours?page=0&size=10",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8080",
              "path": ["api", "tours"],
              "query": [
                {"key": "page", "value": "0"},
                {"key": "size", "value": "10"}
              ]
            }
          }
        },
        {
          "name": "Create Tour",
          "request": {
            "method": "POST",
            "header": [
              {"key": "Content-Type", "value": "application/json"}
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"tourName\": \"Sapa Adventure\",\n  \"description\": \"Amazing tour\",\n  \"price\": 2500000,\n  \"days\": 3,\n  \"nights\": 2,\n  \"provinceId\": 1\n}"
            },
            "url": {
              "raw": "http://localhost:8080/api/tours",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8080",
              "path": ["api", "tours"]
            }
          }
        }
      ]
    }
  ]
}
```

**Test Coverage:**
- Unit tests: ~70% coverage
- Integration tests: Critical paths
- E2E tests: User flows
- API tests: All endpoints

**Running Tests:**
```bash
# Unit + Integration tests
mvn test

# E2E tests
cd frontend-admin
npx playwright test

# Specific test
npx playwright test tours.spec.ts

# With UI
npx playwright test --ui
```

**Files tham khảo:**
- `*/src/test/java/` - Unit & integration tests
- `frontend-admin/tests/` - E2E tests
- `BookingTour.postman_collection.json` - API tests
- `frontend-admin/playwright.config.ts` - Playwright config

---

# Phần 8: Security

## Q45: Giải thích về security implementation?

**Trả lời ngắn:**  
Security được implement với JWT authentication, password encryption (BCrypt), OAuth2 integration, CORS configuration, input validation và SQL injection prevention.

**Chi tiết:**

**1. JWT Authentication**
```java
@Component
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private long jwtExpiration; // 24 hours
    
    public String generateToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        
        return Jwts.builder()
            .setSubject(email)
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.error("JWT token expired");
            return false;
        } catch (JwtException e) {
            log.error("Invalid JWT token");
            return false;
        }
    }
}
```

**2. Password Encryption**
```java
@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // Strength 12
    }
}

@Service
public class AuthService {
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public void register(RegisterRequest request) {
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(hashedPassword);
        // ...
    }
    
    public boolean authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new BadRequestException("Invalid credentials"));
        
        return passwordEncoder.matches(password, user.getPassword());
    }
}
```

**3. CORS Configuration**
```yaml
# api-gateway/src/main/resources/application.yml
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins:
              - "http://localhost:3000"
              - "http://localhost:5174"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - PATCH
              - OPTIONS
            allowedHeaders:
              - "*"
            allowCredentials: true
            maxAge: 3600
```

**4. Input Validation**
```java
public class CreateTourRequest {
    @NotBlank(message = "Tour name is required")
    @Size(min = 3, max = 255, message = "Tour name must be between 3 and 255 characters")
    private String tourName;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;
    
    @NotNull(message = "Days is required")
    @Min(value = 1, message = "Days must be at least 1")
    @Max(value = 30, message = "Days cannot exceed 30")
    private Integer days;
    
    @Email(message = "Invalid email format")
    private String contactEmail;
    
    @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone must be 10-11 digits")
    private String phone;
}

@RestController
public class TourController {
    @PostMapping("/tours")
    public ResponseEntity<TourDTO> createTour(
        @Valid @RequestBody CreateTourRequest request
    ) {
        // @Valid triggers validation
        // If validation fails, returns 400 with error details
        return ResponseEntity.ok(tourService.createTour(request));
    }
}
```

**5. SQL Injection Prevention**
```java
// BAD - Vulnerable to SQL injection
String query = "SELECT * FROM tours WHERE tour_name = '" + tourName + "'";

// GOOD - Using JPA/Hibernate (parameterized queries)
@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
    List<Tour> findByTourNameContaining(String tourName); // Safe
    
    @Query("SELECT t FROM Tour t WHERE t.tourName LIKE %:name%")
    List<Tour> searchByName(@Param("name") String name); // Safe
}
```

**6. XSS Prevention**
```javascript
// Frontend - Escape user input
import DOMPurify from 'dompurify';

const sanitizedDescription = DOMPurify.sanitize(userInput);

// React automatically escapes JSX
<div>{userInput}</div> // Safe

// Dangerous HTML
<div dangerouslySetInnerHTML={{__html: sanitizedDescription}} />
```

**7. HTTPS (Production)**
```yaml
# application-prod.yml
server:
  port: 8443
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: ${SSL_KEY_STORE_PASSWORD}
    key-store-type: PKCS12
```

**8. Rate Limiting (Planned)**
```java
@Configuration
public class RateLimitConfig {
    @Bean
    public RateLimiter rateLimiter() {
        return RateLimiter.create(100); // 100 requests per second
    }
}
```

**Security Checklist:**
- ✅ JWT authentication
- ✅ Password hashing (BCrypt)
- ✅ OAuth2 integration
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS prevention
- ⏳ HTTPS (production)
- ⏳ Rate limiting
- ⏳ API key management

---

# Phần 9: Performance & Scalability

## Q50: Làm thế nào để scale hệ thống khi có nhiều users?

**Trả lời ngắn:**  
Hệ thống có thể scale horizontally bằng cách thêm instances của từng service. Eureka tự động load balance, RabbitMQ hỗ trợ multiple consumers, và database có thể scale với read replicas.

**Chi tiết:**

**1. Horizontal Scaling**
```yaml
# docker-compose-scaled.yml
services:
  tour-service:
    build: ./tour-service
    deploy:
      replicas: 3  # 3 instances
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://eureka-server:8761/eureka/
```

**2. Load Balancing**
```
Client → API Gateway → Eureka (Service Discovery)
                         ↓
                    [tour-service-1]
                    [tour-service-2]  ← Round-robin
                    [tour-service-3]
```

**3. Database Optimization**

**Indexes:**
```sql
-- Frequently queried columns
CREATE INDEX idx_tours_province ON tours(province_id);
CREATE INDEX idx_tours_status ON tours(status);
CREATE INDEX idx_departures_dates ON departures(start_date, end_date);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
```

**Query Optimization:**
```java
// BAD - N+1 query problem
List<Tour> tours = tourRepository.findAll();
for (Tour tour : tours) {
    tour.getDepartures().size(); // Lazy loading, N queries
}

// GOOD - Fetch join
@Query("SELECT t FROM Tour t LEFT JOIN FETCH t.departures WHERE t.status = :status")
List<Tour> findToursWithDepartures(@Param("status") TourStatus status);
```

**4. Caching (Planned)**
```java
@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("tours", "departures");
    }
}

@Service
public class TourService {
    @Cacheable(value = "tours", key = "#tourId")
    public TourDTO getTourById(Long tourId) {
        // Cache result for 1 hour
        return tourRepository.findById(tourId)
            .map(this::convertToDTO)
            .orElseThrow(() -> new NotFoundException("Tour not found"));
    }
    
    @CacheEvict(value = "tours", key = "#tourId")
    public void updateTour(Long tourId, UpdateTourRequest request) {
        // Invalidate cache on update
        // ...
    }
}
```

**5. Async Processing**
```java
@Configuration
@EnableAsync
public class AsyncConfig {
    @Bean
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10);
        executor.setMaxPoolSize(20);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }
}

@Service
public class EmailService {
    @Async
    public void sendBookingConfirmation(Long bookingId) {
        // Send email asynchronously
        // Doesn't block main thread
    }
}
```

**6. Database Connection Pooling**
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
```

**7. Monitoring & Metrics**
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
```

**Performance Targets:**
- API response time: < 200ms (p95)
- Database query time: < 50ms
- Page load time: < 2s
- Concurrent users: 1000+

---

# Phần 10: Challenges & Solutions

## Q55: Những thách thức lớn nhất em gặp phải và cách giải quyết?

**Trả lời ngắn:**  
Các thách thức chính: Distributed transactions, service communication, data consistency, debugging microservices, và OAuth2 integration. Giải quyết bằng event-driven architecture, proper logging, và testing strategies.

**Chi tiết:**

**Challenge 1: Distributed Transactions**

**Problem**: Làm sao đảm bảo booking, seat reservation và payment đều thành công hoặc đều rollback?

**Solution**: Saga pattern với RabbitMQ
```
1. Create booking (PENDING)
2. Reserve seats → Success? Continue : Rollback booking
3. Charge payment → Success? Confirm : Release seats + Cancel booking
```

**Implementation**:
- Event-driven architecture
- Compensating transactions
- Idempotency keys

---

**Challenge 2: Service Discovery**

**Problem**: Services cần tìm nhau mà không hardcode địa chỉ

**Solution**: Netflix Eureka
- Services register on startup
- Services query Eureka to find others
- Load balancing built-in

---

**Challenge 3: CORS Issues**

**Problem**: Frontend không thể gọi API từ different origin

**Solution**: CORS config ở API Gateway
```yaml
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: ["http://localhost:3000", "http://localhost:5174"]
            allowedMethods: [GET, POST, PUT, DELETE, OPTIONS]
            allowCredentials: true
```

---

**Challenge 4: Debugging Microservices**

**Problem**: Khó trace request qua nhiều services

**Solution**:
- Centralized logging
- Correlation IDs
- ELK stack (planned)

```java
@Component
public class CorrelationIdFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
        String correlationId = UUID.randomUUID().toString();
        MDC.put("correlationId", correlationId);
        chain.doFilter(request, response);
        MDC.clear();
    }
}
```

---

**Challenge 5: OAuth2 Redirect**

**Problem**: OAuth callback phải redirect về frontend với token

**Solution**: Backend redirect với token in URL
```java
@GetMapping("/auth/github/callback")
public ResponseEntity<?> githubCallback(@RequestParam String code) {
    String jwtToken = oauth2Service.processGitHubAuth(code);
    return ResponseEntity.status(HttpStatus.FOUND)
        .location(URI.create("http://localhost:3000/auth/callback?token=" + jwtToken))
        .build();
}
```

---

**Challenge 6: Database Migration**

**Problem**: Thay đổi schema khi có data

**Solution**: Flyway/Liquibase (planned)
```sql
-- V1__initial_schema.sql
CREATE TABLE tours (...);

-- V2__add_slug_column.sql
ALTER TABLE tours ADD COLUMN slug VARCHAR(255);
UPDATE tours SET slug = LOWER(REPLACE(tour_name, ' ', '-'));
```

---

**Challenge 7: Testing Microservices**

**Problem**: Khó test integration giữa services

**Solution**:
- Unit tests với mocks
- Integration tests với TestContainers
- E2E tests với Playwright
- Contract testing (planned)

---

**Lessons Learned:**

1. **Start Simple**: Bắt đầu với monolith, sau đó split thành microservices
2. **Logging is Critical**: Invest time in proper logging early
3. **Test Early**: Write tests từ đầu, không phải sau
4. **Documentation**: Document architecture decisions
5. **Monitoring**: Set up monitoring before production

---

## Q56: Nếu làm lại, em sẽ thay đổi gì?

**Trả lời ngắn:**  
Sẽ implement API Gateway authentication filter, thêm distributed tracing, dùng Kubernetes thay vì Docker Compose, và implement caching từ đầu.

**Chi tiết:**

**1. API Gateway Authentication**
```java
// Implement JWT filter ở Gateway
@Component
public class JwtAuthenticationFilter implements GlobalFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String token = extractToken(exchange.getRequest());
        if (token != null && jwtTokenProvider.validateToken(token)) {
            return chain.filter(exchange);
        }
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }
}
```

**2. Distributed Tracing**
```xml
<!-- Add Sleuth + Zipkin -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-sleuth</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-sleuth-zipkin</artifactId>
</dependency>
```

**3. Kubernetes Deployment**
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tour-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: tour-service
  template:
    metadata:
      labels:
        app: tour-service
    spec:
      containers:
      - name: tour-service
        image: bookingtour/tour-service:latest
        ports:
        - containerPort: 8082
```

**4. Redis Caching**
```java
@Configuration
@EnableCaching
public class RedisConfig {
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory("localhost", 6379);
    }
    
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofHours(1))
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                    new GenericJackson2JsonRedisSerializer()
                )
            );
        
        return RedisCacheManager.builder(factory)
            .cacheDefaults(config)
            .build();
    }
}
```

**5. Circuit Breaker**
```java
@Service
public class TourService {
    @CircuitBreaker(name = "userService", fallbackMethod = "getUserFallback")
    @Retry(name = "userService", fallbackMethod = "getUserFallback")
    public UserDTO getUser(Long userId) {
        return restTemplate.getForObject(
            "http://user-service/users/" + userId,
            UserDTO.class
        );
    }
    
    private UserDTO getUserFallback(Long userId, Exception e) {
        return new UserDTO(userId, "Unknown User", null);
    }
}
```

**Future Improvements:**
- ✅ Microservices architecture
- ✅ Docker containerization
- ✅ Event-driven with RabbitMQ
- ⏳ API Gateway authentication
- ⏳ Distributed tracing (Sleuth + Zipkin)
- ⏳ Redis caching
- ⏳ Circuit breaker (Resilience4j)
- ⏳ Kubernetes deployment
- ⏳ ELK stack logging
- ⏳ Prometheus + Grafana monitoring

---

# Tổng Kết

**Điểm Mạnh của Project:**
1. ✅ Kiến trúc Microservices đầy đủ
2. ✅ Service Discovery & API Gateway
3. ✅ Event-driven architecture
4. ✅ OAuth2 integration
5. ✅ Docker deployment
6. ✅ Review & Rating system
7. ✅ Admin panel hoàn chỉnh
8. ✅ MoMo payment integration

**Điểm Cần Cải Thiện:**
1. ⏳ API Gateway authentication filter
2. ⏳ Distributed tracing
3. ⏳ Caching layer
4. ⏳ Circuit breaker
5. ⏳ Comprehensive testing
6. ⏳ Production monitoring
7. ⏳ Kubernetes deployment

**Kết Luận:**
Project BookingTour là một hệ thống Microservices hoàn chỉnh với đầy đủ các components cần thiết. Mặc dù còn một số điểm cần cải thiện, nhưng project đã demonstrate được hiểu biết về kiến trúc phân tán, event-driven systems, và modern development practices.

---

**Files Tham Khảo Tổng Hợp:**
- `README.md` - Project overview
- `summary_context.md` - Detailed analysis
- `docker-compose.yml` - Deployment config
- `sql-scripts/` - Database schemas
- `*/src/main/java/` - Backend code
- `frontend*/src/` - Frontend code
- `BookingTour.postman_collection.json` - API tests

---

**Prepared for**: Thesis Defense  
**Date**: November 2025  
**Status**: Ready for Presentation ✅

