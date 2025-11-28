# 📋 Giải Thích Chi Tiết: Hệ Thống Quản Lí Booking

## 🎯 Tổng Quan

**Booking Service** là service riêng biệt quản lý tất cả các đơn đặt tour. Kiến trúc:

```
Frontend (React)
    ↓
API Gateway (8080)
    ↓
Booking Service (8083)
    ├─ Controller
    ├─ Service
    ├─ Repository
    ├─ Database (bookingdb)
    └─ RabbitMQ (Messaging)
```

---

## 📦 1. DATA MODEL - Booking.java

### Entity Booking

```java
@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                    // Booking ID (auto-increment)
    
    @Column(name = "user_id")
    private Long userId;                // Foreign key: User who booked
    
    @Column(name = "tour_id")
    private Long tourId;                // Foreign key: Tour booked
    
    @Column(name = "departure_id")
    private Long departureId;           // Foreign key: Specific departure date
    
    @Column(name = "num_seats")
    private Integer numSeats;           // Number of seats (guests)
    
    @Column(name = "total_amount")
    private BigDecimal totalAmount;     // Total price (VND)
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private BookingStatus status;       // PENDING, CONFIRMED, CANCELLED, FAILED
    
    @Column(name = "notes")
    private String notes;               // Additional notes
    
    @Column(name = "payment_override")
    private String paymentOverride;     // Override for payment testing (SUCCESS, FAIL, MOMO)
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;    // When booking created
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;    // Last update time
}
```

### Booking Status Enum

```java
public enum BookingStatus {
    PENDING,        // 🟡 Just created, awaiting seat reservation & payment
    CONFIRMED,      // 🟢 Paid successfully, seats reserved
    CANCELLED,      // ❌ User cancelled
    FAILED          // ⚠️ Payment failed
}
```

### Lifecycle

```
User creates booking
    ↓
PENDING (status = PENDING)
├─ Waiting for seat reservation (Tour Service)
├─ Waiting for payment (Payment Service)
    ↓
✓ Seats reserved + Payment successful
    ↓
CONFIRMED (status = CONFIRMED)
├─ Email sent to user
├─ Tour updated (slot decremented)
    ↓
[Tour day arrives]
    ↓
COMPLETED (tour finished)

OR

CANCELLED (status = CANCELLED)
├─ User clicked Cancel
├─ Payment refunded
├─ Seats released
```

---

## 🎮 2. CONTROLLER - BookingController.java

### A. Tạo Booking (POST /bookings)

```java
@PostMapping
public ResponseEntity<Map<String, Object>> createBooking(@RequestBody BookingRequest request) {
    // 1. Validate request (userId, tourId, departureId, seats, amount)
    Booking booking = bookingService.createBooking(request);
    
    // 2. Publish event: Request to reserve seats in Tour Service
    bookingEventPublisher.publishReservationRequest(
        booking.getId(),
        request.getTourId(),
        booking.getDepartureId(),
        booking.getNumSeats(),
        booking.getUserId(),
        booking.getPaymentOverride()
    );
    
    // 3. Return response with bookingId
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

**Request Body:**
```json
{
    "userId": 1,
    "tourId": 10,
    "departureId": 55,
    "seats": 2,
    "totalAmount": 5000000,
    "paymentOverride": "MOMO"  // Optional: for testing
}
```

**Response:**
```json
{
    "bookingId": 123,
    "status": "PENDING",
    "message": "Booking created, processing seat reservation",
    "userId": 1,
    "tourId": 10,
    "departureId": 55,
    "seats": 2,
    "totalAmount": 5000000,
    "bookingDate": "2024-11-20T10:30:45"
}
```

**Flow:**
```
1. Controller validate input
2. Service create booking (PENDING)
3. Save to database
4. Publish RabbitMQ event "reservation.request"
5. Tour Service receive event
   ├─ Reserve seats
   ├─ Update departure.remainingSlots
   └─ Publish response "seat.reserved" or "seat.failed"
6. Payment Service starts payment
```

### B. Lấy Booking (GET /bookings/{id})

```java
@GetMapping("/{id}")
public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
    Booking booking = bookingService.getBookingById(id);
    return ResponseEntity.ok(booking);
}
```

**Response:**
```json
{
    "id": 123,
    "userId": 1,
    "tourId": 10,
    "departureId": 55,
    "numSeats": 2,
    "totalAmount": 5000000,
    "status": "CONFIRMED",
    "createdAt": "2024-11-20T10:30:45",
    "updatedAt": "2024-11-20T10:35:20"
}
```

### C. Lấy Bookings của User (GET /bookings/user/{userId})

```java
@GetMapping("/user/{userId}")
public ResponseEntity<Page<Booking>> getUserBookings(
        @PathVariable Long userId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    
    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
    Page<Booking> bookings = bookingService.getUserBookings(userId, pageable);
    return ResponseEntity.ok(bookings);
}
```

**Query:**
```
GET /bookings/user/1?page=0&size=10
```

**Response:**
```json
{
    "content": [
        {
            "id": 123,
            "status": "CONFIRMED",
            "tourId": 10,
            "totalAmount": 5000000,
            "createdAt": "2024-11-20T10:30:45"
        },
        ...
    ],
    "totalElements": 5,
    "totalPages": 1,
    "currentPage": 0
}
```

### D. Lấy Tất Cả Bookings với Filter (GET /bookings)

```java
@GetMapping
public ResponseEntity<Page<Booking>> getAllBookings(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) Long tourId,
        @RequestParam(required = false) Long departureId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    
    // Filter by departureId / tourId / status
    Page<Booking> bookings;
    
    if (departureId != null) {
        bookings = bookingService.getBookingsByDepartureId(departureId, pageable);
    } else if (tourId != null) {
        bookings = bookingService.getBookingsByTourId(tourId, pageable);
    } else if (status != null) {
        BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
        bookings = bookingService.getBookingsByStatus(bookingStatus, pageable);
    } else {
        bookings = bookingService.getAllBookings(pageable);
    }
    
    return ResponseEntity.ok(bookings);
}
```

**Queries:**
```
GET /bookings?status=PENDING              # All pending bookings
GET /bookings?tourId=10                   # All bookings for tour 10
GET /bookings?departureId=55              # All bookings for departure 55
GET /bookings?status=CONFIRMED&page=0&size=5
```

### E. Hủy Booking (DELETE /bookings/{id})

```java
@DeleteMapping("/{id}")
public ResponseEntity<Map<String, Object>> cancelBooking(@PathVariable Long id) {
    // 1. Get booking
    Booking booking = bookingService.getBookingById(id);
    
    // 2. Cancel booking (PENDING → CANCELLED)
    Booking cancelledBooking = bookingService.cancelBooking(id);
    
    // 3. Publish event: Release seats
    bookingEventPublisher.publishReservationCancel(
        booking.getId(),
        booking.getTourId(),
        booking.getDepartureId(),
        booking.getNumSeats(),
        booking.getUserId()
    );
    
    // 4. Return response
    return ResponseEntity.ok(response);
}
```

**Flow:**
```
1. Mark booking as CANCELLED
2. Publish "reservation.cancel" event
3. Tour Service release seats
4. Payment Service handle refund
5. Email Service send cancellation email
```

---

## ⚙️ 3. SERVICE - BookingServiceImpl.java

### A. Create Booking

```java
@Override
public Booking createBooking(BookingRequest request) {
    // 1. Validate input
    validateBookingRequest(request);
    
    // 2. Create Booking object
    Booking booking = Booking.builder()
            .userId(request.getUserId())           // User ID
            .tourId(request.getTourId())           // Tour ID
            .departureId(request.getDepartureId()) // Departure ID
            .numSeats(request.getSeats())          // Number of seats
            .totalAmount(BigDecimal.valueOf(request.getTotalAmount()))
            .status(BookingStatus.PENDING)         // 🟡 Initial status
            .paymentOverride(normalizePaymentOverride(request.getPaymentOverride()))
            .build();
    
    // 3. Save to database
    Booking savedBooking = bookingRepository.save(booking);
    
    log.info("Created booking {} for user {}", savedBooking.getId(), request.getUserId());
    return savedBooking;
}
```

**Validation:**
```java
private void validateBookingRequest(BookingRequest request) {
    // Check userId not null
    if (request.getUserId() == null) 
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId required");
    
    // Check departureId not null
    if (request.getDepartureId() == null)
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "departureId required");
    
    // Check tourId not null
    if (request.getTourId() == null)
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "tourId required");
    
    // Check seats > 0
    if (request.getSeats() == null || request.getSeats() <= 0)
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "seats > 0");
    
    // Check totalAmount > 0
    if (request.getTotalAmount() == null || request.getTotalAmount() <= 0)
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "totalAmount > 0");
    
    // Check paymentOverride valid (SUCCESS, FAIL, MOMO)
    if (request.getPaymentOverride() != null) {
        String normalized = normalizePaymentOverride(request.getPaymentOverride());
        if (normalized == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "paymentOverride must be SUCCESS, FAIL, MOMO");
    }
}
```

### B. Confirm Booking (PENDING → CONFIRMED)

```java
@Override
public Booking confirmBooking(Long bookingId) {
    // 1. Get booking
    Booking booking = getBookingById(bookingId);
    
    // 2. Check status is PENDING
    if (booking.getStatus() != BookingStatus.PENDING) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Only PENDING bookings can be confirmed");
    }
    
    // 3. Update status to CONFIRMED
    booking.setStatus(BookingStatus.CONFIRMED);
    Booking confirmedBooking = bookingRepository.save(booking);
    
    // 4. Send email notification
    try {
        publishBookingConfirmedEvent(confirmedBooking);
        log.info("Booking {} confirmed and email sent", bookingId);
    } catch (Exception e) {
        log.error("Failed to send email", e);
        // Continue (don't fail if email fails)
    }
    
    return confirmedBooking;
}
```

**When does this get called?**
```
Payment Service successfully processes payment
    ↓
Publish: "payment.completed" event
    ↓
Booking Service receives event
    ↓
Call confirmBooking()
    ↓
booking.status = CONFIRMED ✓
```

### C. Cancel Booking (PENDING/CONFIRMED → CANCELLED)

```java
@Override
public Booking cancelBooking(Long bookingId) {
    // 1. Get booking
    Booking booking = getBookingById(bookingId);
    
    // 2. Check already cancelled
    if (booking.getStatus() == BookingStatus.CANCELLED) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Booking is already cancelled");
    }
    
    // 3. Check can cancel (PENDING or CONFIRMED)
    if (booking.getStatus() != BookingStatus.PENDING && 
        booking.getStatus() != BookingStatus.CONFIRMED) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Cannot cancel booking with status: " + booking.getStatus());
    }
    
    // 4. Update status
    booking.setStatus(BookingStatus.CANCELLED);
    Booking cancelledBooking = bookingRepository.save(booking);
    
    // 5. Cancel payment
    try {
        String cancelUrl = "http://localhost:8084/payments/booking/" + bookingId + "/cancel";
        restTemplate.postForEntity(cancelUrl, null, Void.class);
        log.info("Payment for booking {} cancelled", bookingId);
    } catch (Exception e) {
        log.error("Failed to cancel payment", e);
        // Continue (don't fail if payment cancellation fails)
    }
    
    log.info("Booking {} cancelled", bookingId);
    return cancelledBooking;
}
```

### D. Get Bookings (Various Queries)

```java
// Get by ID
public Booking getBookingById(Long bookingId) {
    return bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Booking not found"));
}

// Get by User ID (with pagination)
public Page<Booking> getUserBookings(Long userId, Pageable pageable) {
    return bookingRepository.findByUserId(userId, pageable);
}

// Get all (with pagination)
public Page<Booking> getAllBookings(Pageable pageable) {
    return bookingRepository.findAll(pageable);
}

// Get by Status
public Page<Booking> getBookingsByStatus(BookingStatus status, Pageable pageable) {
    return bookingRepository.findByStatus(status, pageable);
}

// Get by Departure ID
public Page<Booking> getBookingsByDepartureId(Long departureId, Pageable pageable) {
    List<Booking> bookings = bookingRepository.findByDepartureId(departureId);
    return new PageImpl<>(bookings, pageable, bookings.size());
}

// Get by Tour ID
public Page<Booking> getBookingsByTourId(Long tourId, Pageable pageable) {
    List<Booking> bookings = bookingRepository.findByTourId(tourId);
    return new PageImpl<>(bookings, pageable, bookings.size());
}
```

### E. Fail Booking (PENDING → FAILED)

```java
@Override
public Booking failBooking(Long bookingId) {
    Booking booking = getBookingById(bookingId);
    
    // Cannot fail confirmed booking
    if (booking.getStatus() == BookingStatus.CONFIRMED) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Cannot fail confirmed booking");
    }
    
    // Check already failed
    if (booking.getStatus() == BookingStatus.FAILED) {
        log.warn("Booking {} already FAILED", bookingId);
        return booking;
    }
    
    // Mark as FAILED
    booking.setStatus(BookingStatus.FAILED);
    Booking failedBooking = bookingRepository.save(booking);
    
    log.info("Booking {} marked FAILED due to payment failure", bookingId);
    return failedBooking;
}
```

**When?**
```
Payment Service fails to charge payment
    ↓
Publish: "payment.failed" event
    ↓
Booking Service receives event
    ↓
Call failBooking()
    ↓
booking.status = FAILED ❌
```

### F. Publish Email Notification

```java
private void publishBookingConfirmedEvent(Booking booking) {
    // 1. Fetch user info from User Service
    Map<String, Object> user = fetchUserInfo(booking.getUserId());
    String userEmail = (String) user.getOrDefault("email", "N/A");
    String userName = (String) user.getOrDefault("fullName", "Unknown");
    
    // 2. Fetch tour info from Tour Service
    Map<String, Object> tour = fetchTourInfo(booking.getTourId());
    String tourName = (String) tour.getOrDefault("tourName", "Tour #" + booking.getTourId());
    
    // 3. Fetch departure info
    Map<String, Object> departure = fetchDepartureInfo(booking.getTourId(), booking.getDepartureId());
    LocalDate departureDate = parseDate(departure.get("startDate"));
    
    // 4. Create event
    BookingConfirmedEvent event = new BookingConfirmedEvent(
            booking.getId(),
            booking.getUserId(),
            booking.getTourId(),
            userEmail,
            userName,
            tourName,
            departureDate,
            booking.getNumSeats(),
            booking.getTotalAmount(),
            "MOMO",
            booking.getCreatedAt().format(DATE_TIME_FORMATTER)
    );
    
    // 5. Publish to RabbitMQ
    rabbitTemplate.convertAndSend(
            RabbitMQConfig.EMAIL_EXCHANGE,
            RabbitMQConfig.EMAIL_BOOKING_CONFIRMED_KEY,
            event
    );
    
    log.info("Published booking confirmed event for booking {}", booking.getId());
}
```

---

## 🗄️ 4. DATABASE - bookingdb

### Table Structure

```sql
CREATE TABLE bookings (
    booking_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    tour_id BIGINT NOT NULL,
    departure_id BIGINT NOT NULL,
    num_seats INTEGER NOT NULL,
    total_amount DECIMAL(19, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    payment_override VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_tour_id ON bookings(tour_id);
CREATE INDEX idx_bookings_departure_id ON bookings(departure_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
```

### Example Data

```
booking_id | user_id | tour_id | departure_id | num_seats | total_amount | status      | created_at
-----------|---------|---------|--------------|-----------|--------------|-------------|----------------------
1          | 1       | 10      | 55           | 2         | 5000000      | CONFIRMED   | 2024-11-20 10:30:45
2          | 2       | 12      | 60           | 3         | 7500000      | PENDING     | 2024-11-20 11:45:20
3          | 3       | 10      | 55           | 1         | 2500000      | CANCELLED   | 2024-11-20 12:00:00
```

---

## 📨 5. RabbitMQ MESSAGE FLOW

### A. Booking Creation Flow

```
1️⃣ Frontend: POST /api/bookings
   └─ BookingController.createBooking()

2️⃣ Booking Service creates booking (PENDING)
   └─ bookingRepository.save()

3️⃣ Publish event "reservation.request"
   └─ rabbitTemplate.convertAndSend(
        "tour.events",
        "reservation.request",
        { bookingId, tourId, departureId, numSeats, userId, paymentOverride }
      )

4️⃣ Tour Service receives event
   ├─ Try to reserve seats
   │  ├─ Get departure
   │  ├─ Check remainingSlots >= numSeats
   │  ├─ If YES → decrement remainingSlots
   │  └─ If NO → fail
   └─ Publish response event

5️⃣ If seat reserved success:
   ├─ Tour Service publish "tour.seat.reserved"
   ├─ Booking Service receives "tour.seat.reserved"
   └─ Everything OK, waiting for payment

6️⃣ Payment Service starts payment
   ├─ Create MoMo order
   ├─ Get QR code
   ├─ Return to frontend

7️⃣ User pays (Frontend):
   ├─ Scan QR code
   ├─ Confirm payment in MoMo app

8️⃣ MoMo callback to Payment Service
   ├─ Payment successful
   └─ Publish "payment.completed" event

9️⃣ Booking Service receives "payment.completed"
   ├─ confirmBooking(bookingId)
   ├─ booking.status = CONFIRMED
   ├─ publishBookingConfirmedEvent()
   └─ Email sent to user ✓
```

### B. Booking Cancellation Flow

```
🔴 User clicks "Cancel Booking"

1️⃣ Frontend: DELETE /api/bookings/{bookingId}
   └─ BookingController.cancelBooking()

2️⃣ Booking Service:
   ├─ booking.status = CANCELLED
   ├─ bookingRepository.save()
   └─ publishReservationCancel()

3️⃣ Publish event "reservation.cancel"
   └─ rabbitTemplate.convertAndSend(
        "tour.events",
        "reservation.cancel",
        { bookingId, tourId, departureId, numSeats }
      )

4️⃣ Tour Service receives event:
   ├─ Get departure
   ├─ Increment remainingSlots back
   └─ Publish "tour.seat.released"

5️⃣ Payment Service:
   ├─ Call: POST /payments/booking/{bookingId}/cancel
   ├─ Mark payment as REFUNDED
   ├─ Process refund (MoMo)
   └─ Send refund email

6️⃣ Email Service:
   └─ Send cancellation email to user ✓
```

---

## 🔄 6. COMPLETE BOOKING LIFECYCLE

### State Diagram

```
                        ┌─────────────────┐
                        │    PENDING      │
                        │ (Just created)  │
                        └────────┬────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
          [Seat reserved OK]        [Seat reservation failed]
                    │                         │
                    ▼                         ▼
              [Payment]                   [Stay PENDING]
                    │                    or [FAILED]
          ┌─────────┴──────────┐
          │                    │
    [Payment OK]        [Payment Failed]
          │                    │
          ▼                    ▼
      CONFIRMED            FAILED
    (booking valid)    (payment failed)
          │                    │
      [Complete]          [Refund]
          │                    │
          ▼                    ▼
      COMPLETED           Back to PENDING
                          (can retry payment)
          
   OR [User cancel]
          │
          ▼
      CANCELLED
      (refund issued)
```

### Timeline Example

```
10:30:00 - User submit booking
├─ bookingId: 123
├─ status: PENDING
├─ Publish: "reservation.request"

10:30:05 - Tour Service reserves seats
├─ Remaining slots: 50 → 48
├─ Publish: "tour.seat.reserved"

10:30:10 - Payment Service creates MoMo order
├─ QR code ready
├─ Frontend shows QR to user

10:32:00 - User scans QR and pays
├─ MoMo callback received
├─ Payment successful ✓

10:32:05 - Booking Service confirm booking
├─ status: PENDING → CONFIRMED
├─ Publish: "booking.confirmed"
├─ Email sent to user

10:32:10 - Tour Service completes
├─ Database updated
├─ User sees "Booking Confirmed" in profile
```

---

## 💡 KEY CONCEPTS

### 1. Transactional Consistency

```java
@Service
@Transactional  // Spring handles transactions
public class BookingServiceImpl {
    // All operations in same transaction
    // Rollback if any fail
}
```

### 2. Event-Driven Architecture

```
Services communicate via events, not direct API calls
├─ Loose coupling: Services don't depend on each other
├─ Async: Non-blocking, fast response
├─ Resilient: If service down, events wait in queue
└─ Scalable: Easy to add new consumers
```

### 3. Error Handling

```java
// Validation error (400)
if (request.getSeats() <= 0)
    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid seats");

// Not found error (404)
return bookingRepository.findById(id)
    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found"));

// Business logic error (409)
if (booking.getStatus() == BookingStatus.CONFIRMED)
    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Already confirmed");
```

### 4. Pagination

```java
// Instead of loading all bookings, load page by page
Pageable pageable = PageRequest.of(0, 10);  // Page 0, 10 items
Page<Booking> page = bookingService.getAllBookings(pageable);

// Response
{
    "content": [...10 bookings...],
    "totalElements": 500,
    "totalPages": 50,
    "currentPage": 0,
    "size": 10
}
```

---

## 🎯 WORKFLOW SUMMARY

### Happy Path (Everything OK)

```
1. User → POST /bookings (create booking)
2. Booking saved with PENDING status
3. Event: Reserve seats
4. Seats reserved successfully
5. Payment started
6. User pays via MoMo
7. Payment confirmed
8. Booking status → CONFIRMED
9. Email sent ✓
```

### Error Cases

```
Case 1: Invalid input
├─ Missing userId, tourId, etc.
└─ Return 400 Bad Request

Case 2: Seat reservation fails
├─ Not enough seats available
└─ Booking stays PENDING

Case 3: Payment fails
├─ User doesn't complete payment
├─ Booking stays PENDING
└─ User can retry

Case 4: User cancels
├─ Call DELETE /bookings/{id}
├─ Status → CANCELLED
├─ Refund issued
└─ Seats released
```

---

## 🚀 NEXT LEVEL: ASYNC IMPROVEMENTS

### Current (Synchronous in some parts)
```
POST /bookings
├─ Create booking
├─ Wait for Tour Service response (sync)
└─ Wait for Payment Service response (sync)
→ Could timeout if services slow
```

### Ideal (Fully Async)
```
POST /bookings
├─ Create booking (PENDING)
├─ Publish "booking.created" event
└─ Return immediately (202 Accepted)
    ↓
Frontend polls GET /bookings/{id}
    ├─ status: PENDING → Waiting...
    ├─ status: CONFIRMED → Success!
    └─ status: FAILED → Error
```

This allows:
- ✓ Instant response to user
- ✓ No timeouts
- ✓ Better scalability
- ✓ Retry logic for failures

---

**Đây là cách Booking Service quản lý tất cả bookings!** 🎉



