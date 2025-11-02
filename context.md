## Booking Flow Context — 2025-11-01

### 1. Environment Snapshot
- **Stack**: Full docker-compose bundle (Eureka, API Gateway, User, Tour, Booking, Payment services, Postgres instances `postgres-db`, `booking-db`, `payment-db`, RabbitMQ, customer frontend on `:3000`, admin frontend on `:5174`).
- **MoMo dev credentials**: `partnerCode=MOMOBKUN20180529`, `accessKey=klm05TvNBzhg7h7j`, `secretKey=at67q…`. Redirect target pinned to `http://localhost:3000/payment-result`.
- **Key ports**: API Gateway `8080`, Booking `8083`, Payment `8084`, Eureka `8761`, RabbitMQ `5672/15672`.

### 2. Code & Config Changes This Session
| Area | Change | Files / Notes |
|------|--------|---------------|
| Payment redirect | Force frontend redirect to port 3000 | `payment-service/src/main/resources/application.yml` & `application-docker.yml` |
| Concurrency-safe payment creation | Reworked `PaymentService.newPayment` to `INSERT … ON CONFLICT DO NOTHING` and reuse existing row | `payment-service/src/main/java/com/example/payment/service/PaymentService.java:170` |
| Session cleanup | Multiple image rebuilds (`docker-compose build payment-service`) and restarts (`docker-compose up -d payment-service`, restart gateway) | Keep in mind for future |
| Manual DB hygiene | Deleted failed booking/payment rows, reset tour departures between tests | See section 5 |
| Context doc | Created this `context.md` for future sessions | root |

### 3. Booking Attempts Timeline
| Booking ID | Tour (departure) | Amount | Result | Root Cause / Notes |
|------------|------------------|--------|--------|--------------------|
| 21 | Hà Nội - Hạ Long 3N2Đ (dep 21) | 7.780.000 ₫ | CANCELLED | Early automation; payment failure (MoMo not confirmed) |
| 30–37 | Various (Hà Giang, Tây Nguyên, Phan Thiết, etc.) | 20.000 ₫ (test) | CANCELLED | Payment-service duplicate key / session errors before fixes. Some cleaned from DB |
| **38** | Đà Nẵng - Hội An 4N3Đ (dep 22) | 20.000 ₫ | **CONFIRMED (manual)** | MoMo redirect OK but no callback; manually completed payment & booking |

> MoMo sandbox returned user to `payment-result?resultCode=0`, but no IPN callback was observed (signature verification rejects manual attempts). We manually marked success for testing.

### 4. Manual Database Operations
- Removed stale rows:
  - `DELETE FROM payments WHERE booking_id IN (34,35,36);`
  - `DELETE FROM bookings WHERE booking_id IN (34,35,36);`
- Reset seats when rolling back tests:
  - `UPDATE departures SET remaining_slots = total_slots WHERE departure_id IN (26,32,34);`
- Manual completion for booking 38:
  - `UPDATE payments SET status='COMPLETED', transaction_id='560001', momo_trans_id=560001, transaction_date=NOW(), notes='Manual completion' WHERE booking_id=38;`
  - `UPDATE bookings SET status='CONFIRMED', updated_at=NOW() WHERE booking_id=38;`
  - `UPDATE departures SET remaining_slots = remaining_slots - 2 WHERE departure_id=22;`

### 5. Current State (Post-Manual Completion)
- **Bookings**
  - `38`: `CONFIRMED`, user `43`, tour `Đà Nẵng - Hội An`, `num_seats=2`, `total_amount=20000`.
  - Historical entries `30–37`: either deleted or remain `CANCELLED` (safe to ignore).
- **Payments**
  - `payment_id 58` (booking 38): `COMPLETED`, `transaction_id=560001`, note “Manual completion”.
  - Older test payments (`payment_id 40–56`): `PROCESSING` for cancelled bookings (no longer active).
- **Tours / Departures**
  - Departure `22`: `total_slots=24`, `remaining_slots=8` (reflects booking 38).
  - Other departures reset to full availability except `departure_id=24` (legacy data: `remaining_slots=6`).

### 6. Outstanding Issues / Follow-ups
- **MoMo callback verification**: Payment-service still enforces signature check; sandbox redirect alone is insufficient. For automated tests, consider:
  1. Disabling signature verification in dev profile, or
  2. Implementing a helper to generate valid HMAC signatures using MoMo secret.
- **Legacy rows**: `payments` table still holds PROCESSING entries for cancelled bookings (IDs 29–37). Optional cleanup if they interfere with reporting.
- **Frontend UX**: `payment-result` page shows note “Manual completion” sourced from payment record; harmless but may be confusing.

### 7. Useful Commands / Queries
```
# Booking & payment audit
docker exec booking-db psql -U postgres -d bookingdb \
  -c "SELECT booking_id, tour_id, status, created_at, updated_at FROM bookings ORDER BY booking_id DESC LIMIT 10;"

docker exec payment-db psql -U postgres -d paymentdb \
  -c "SELECT payment_id, booking_id, status, transaction_id, updated_at FROM payments ORDER BY payment_id DESC LIMIT 10;"

# Departure availability
docker exec postgres-db psql -U postgres -d tourdb \
  -c "SELECT departure_id, tour_id, total_slots, remaining_slots FROM departures WHERE tour_id IN (1,2,3,4,5,7,8);"

# Service health
curl -s http://localhost:8084/actuator/health
curl -s http://localhost:8080/actuator/health
```

### 8. Quick Reminders for Next Session
- When retesting payments, expect `resultCode=0` on redirect without IPN; plan manual completion or adjust signature handling.
- Running `docker-compose up --build -d payment-service` is sufficient after code changes; gateway restart only needed when changing routes/config.
- Credentials/session data for the scripted account: `username=autobot1762004312203`, password `Test@1234`.
- This context file should be updated after each major test cycle to keep historical trace.
