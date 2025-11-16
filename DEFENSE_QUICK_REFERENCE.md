# 📝 Cheat Sheet - Câu Hỏi Bảo Vệ Đồ Án BookingTour

**Quick Reference Guide cho Bảo Vệ**

---

## 🎯 Câu Hỏi Thường Gặp & Câu Trả Lời Ngắn Gọn

### Kiến Trúc

**Q: Tại sao chọn Microservices?**  
→ Tách biệt concerns (User, Tour, Booking, Payment), scale độc lập, fault isolation, technology flexibility

**Q: Giải thích Service Discovery?**  
→ Eureka Server - services tự đăng ký và tìm nhau, không hardcode địa chỉ, auto load balancing

**Q: API Gateway làm gì?**  
→ Single entry point (port 8080), routing requests, CORS handling, có thể thêm authentication

**Q: Database per Service?**  
→ 3 PostgreSQL: tour_management (User+Tour), bookingdb (Booking), paymentdb (Payment). Độc lập, scale riêng

---

### Backend Services

**Q: User Service chức năng gì?**  
→ Authentication (JWT + OAuth2), User CRUD, Password encryption (BCrypt), Email verification

**Q: OAuth2 flow?**  
→ User click GitHub/Google → Authorize → Callback với code → Exchange token → Get user info → Create/update user → Return JWT

**Q: Tour Service quản lý gì?**  
→ Tours, Departures, Schedules, Images (Cloudinary), Discounts, Reviews, Provinces/Regions

**Q: Departure validation?**  
→ Duration phải khớp tour (3 ngày 2 đêm = start + 2 days), total slots >= reserved slots, dates valid

**Q: Booking flow?**  
→ Create (PENDING) → Reserve seats (RabbitMQ) → Payment (MoMo) → CONFIRMED/FAILED

**Q: Payment integration?**  
→ MoMo wallet API, create order → redirect user → callback → update status

---

### Frontend

**Q: Tech stack frontend?**  
→ React 18 + Vite + TailwindCSS, 2 apps: Client (3000) + Admin (5174)

**Q: Admin features?**  
→ Dashboard, Tour CRUD, Departure management, Booking list, Review moderation, User management

**Q: API integration?**  
→ Fetch API, JWT token in localStorage, Authorization header, error handling với toast

---

### Database

**Q: Main tables?**  
→ users, tours, departures, tour_schedules, tour_images, tour_reviews, bookings, payments

**Q: Relationships?**  
→ tours → departures (1:N), tours → schedules (1:N), tours → reviews (1:N), bookings → guests (1:N)

**Q: Indexes?**  
→ Foreign keys, status columns, date ranges, email, slug

---

### RabbitMQ

**Q: Tại sao dùng RabbitMQ?**  
→ Async communication, decouple services, reliable messaging, retry logic

**Q: Event flow?**  
→ reservation.request → reserve seats → reservation.success → payment.charge → payment.completed

**Q: Exchanges & Queues?**  
→ reservation.exchange + payment.exchange (Topic), mỗi exchange có request/success/failure queues

---

### Deployment

**Q: Docker strategy?**  
→ Mỗi service có Dockerfile, docker-compose.yml orchestrate tất cả, 3 PostgreSQL + RabbitMQ + 6 services + 2 frontends

**Q: Health checks?**  
→ Spring Actuator `/actuator/health`, depends_on với condition: service_healthy

**Q: Start project?**  
→ `docker-compose up --build -d`, xem logs: `docker-compose logs -f`

---

### Testing

**Q: Testing levels?**  
→ Unit (JUnit + Mockito), Integration (Spring Boot Test), E2E (Playwright), API (Postman)

**Q: Test coverage?**  
→ ~70% unit tests, critical paths integration, main flows E2E

---

### Security

**Q: Authentication?**  
→ JWT tokens (HS512, 24h expiry), BCrypt password (strength 12), OAuth2 (GitHub + Google)

**Q: CORS?**  
→ Config ở API Gateway, allow localhost:3000 và 5174, credentials true

**Q: Input validation?**  
→ @Valid + Bean Validation annotations (@NotBlank, @Email, @Min, @Max)

**Q: SQL injection?**  
→ JPA/Hibernate parameterized queries, không concat strings

---

### Performance

**Q: Làm sao scale?**  
→ Horizontal scaling (thêm instances), Eureka load balance, database indexes, caching (planned)

**Q: Optimization?**  
→ Indexes trên foreign keys, fetch joins tránh N+1, connection pooling (HikariCP), async processing

---

### Challenges

**Q: Thách thức lớn nhất?**  
→ Distributed transactions (giải quyết bằng Saga pattern), service discovery (Eureka), CORS (API Gateway config)

**Q: Nếu làm lại?**  
→ API Gateway auth filter, distributed tracing (Sleuth+Zipkin), Redis caching, Circuit breaker, Kubernetes

---

## 🔑 Key Numbers

| Metric | Value |
|--------|-------|
| Services | 6 (Eureka, Gateway, User, Tour, Booking, Payment) |
| Databases | 3 PostgreSQL instances |
| Frontends | 2 (Client + Admin) |
| Ports | 8761, 8080, 8081-8084, 3000, 5174 |
| Tech Stack | Java 17, Spring Boot 3.3.3, React 18, PostgreSQL 15 |
| Message Broker | RabbitMQ 3 |

---

## 📊 Architecture Diagram (Vẽ trên bảng)

```
                    ┌─────────────┐
                    │   Clients   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ API Gateway │ :8080
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐      ┌─────▼─────┐     ┌─────▼─────┐
   │  User   │      │   Tour    │     │  Booking  │
   │ Service │      │  Service  │     │  Service  │
   │  :8081  │      │   :8082   │     │   :8083   │
   └────┬────┘      └─────┬─────┘     └─────┬─────┘
        │                 │                  │
        │                 │         ┌────────┴────────┐
        │                 │         │                 │
   ┌────▼────┐      ┌────▼────┐   ┌▼────────┐  ┌────▼────┐
   │ UserDB  │      │ TourDB  │   │ RabbitMQ│  │ Payment │
   │  :5432  │      │  :5432  │   │:5672    │  │ Service │
   └─────────┘      └─────────┘   └─────────┘  │  :8084  │
                                                └────┬────┘
                                                     │
                                                ┌────▼────┐
                                                │PaymentDB│
                                                │  :5434  │
                                                └─────────┘
```

---

## 💡 Demo Tips

1. **Chuẩn bị trước**: Chạy `docker-compose up -d` trước 10 phút
2. **Kiểm tra**: Mở Eureka Dashboard (8761) - tất cả services UP
3. **Demo flow**: Login → Xem tour → Đặt tour → Thanh toán → Admin xem booking
4. **Backup plan**: Có screenshots/video nếu demo fail
5. **Postman ready**: Import collection để test API nếu cần

---

## 🎤 Câu Hỏi Khó & Cách Trả Lời

**Q: Tại sao không dùng Kubernetes?**  
→ "Project focus vào Microservices architecture fundamentals. Docker Compose đủ cho development và demo. Production sẽ dùng Kubernetes với auto-scaling và self-healing."

**Q: Distributed transaction rollback?**  
→ "Dùng Saga pattern với compensating transactions. Nếu payment fail, publish event để release seats và cancel booking. Eventual consistency thay vì ACID."

**Q: Security của JWT?**  
→ "Token signed với HS512, secret key trong env vars. Expiry 24h. Production sẽ dùng refresh tokens và httpOnly cookies thay vì localStorage."

**Q: Performance với 10,000 users?**  
→ "Horizontal scaling: thêm instances của mỗi service. Eureka auto load balance. Database read replicas. Redis caching. CDN cho static assets."

**Q: Monitoring production?**  
→ "Planned: ELK stack (logs), Prometheus + Grafana (metrics), Sleuth + Zipkin (tracing), Health checks, Alerts."

---

## ✅ Checklist Trước Bảo Vệ

- [ ] Project chạy được: `docker-compose up -d`
- [ ] Tất cả services UP trên Eureka Dashboard
- [ ] Test 1 booking flow end-to-end
- [ ] Chuẩn bị slides với architecture diagram
- [ ] In cheat sheet này ra giấy
- [ ] Backup: Screenshots/video demo
- [ ] Postman collection ready
- [ ] Biết rõ code ở đâu (có thể mở nhanh)
- [ ] Hiểu rõ trade-offs và limitations
- [ ] Chuẩn bị câu trả lời cho "future improvements"

---

**Good Luck! 🍀**

Nhớ: Tự tin, nói chậm rãi, admit nếu không biết nhưng giải thích cách sẽ tìm hiểu.

