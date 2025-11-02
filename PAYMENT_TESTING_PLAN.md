# 🧪 BookingTour - Payment (MoMo) Testing Plan

**Date:** October 26, 2025  
**Version:** 1.0  
**Purpose:** End-to-End Testing with ngrok for IPN Webhook  
**Status:** 🔵 Ready for Implementation

---

## 📋 **Overview**

```
Flow: Frontend → Backend → MoMo → IPN Webhook → Backend → Database → Frontend Result

Key Challenge: MoMo cannot reach localhost, so we use ngrok to expose our backend
```

---

## 🚀 **PHASE 1: Setup & Configuration (Before Testing)**

### **Step 1.1: Install ngrok**

```bash
# Download ngrok from https://ngrok.com/download
# OR use apt/brew:
wsl
sudo apt update
sudo apt install ngrok
# or
brew install ngrok
```

**Timeline:** 10 minutes

---

### **Step 1.2: Start ngrok to Expose API Gateway**

```bash
# Terminal 1: Start ngrok
wsl
ngrok http 8080

# Output should show:
# ngrok                                       (Ctrl+C to quit)
#
# Session Status                online
# Account                       [your-account]
# Version                        3.x.x
# Region                         au (Australia)
# Forwarding                     https://xxxx-xxx-xxx-xxx.au.ngrok.io -> http://localhost:8080
# Forwarding                     http://xxxx-xxx-xxx-xxx.au.ngrok.io -> http://localhost:8080
#
# Connections                    ttl    opn    rt1    rt5    p50    p99
#                                0      0      0.00   0.00   0.00   0.00
```

**Keep this terminal open!** ✅

**Timeline:** 5 minutes

---

### **Step 1.3: Copy ngrok URL**

```
Your public URL: https://xxxx-xxx-xxx-xxx.au.ngrok.io

Example:
https://1234-567-890-123.au.ngrok.io
```

**Save this URL!** 📌

**Timeline:** 1 minute

---

### **Step 1.4: Update Backend Configuration**

**File:** `payment-service/src/main/resources/application.yml` (or docker version)

```yaml
momo:
  partnerCode: MOMOLRJZ20181206
  accessKey: mTCKt9W3eU1m39TW
  secretKey: KqBEecvaJf1nULnhPF5htpG3AMtDIOlD
  environment: dev
  
  # ⚠️ UPDATE THESE with ngrok URL
  callbackUrl: https://xxxx-xxx-xxx-xxx.au.ngrok.io/api/payments/momo/webhook
  redirectUrl: http://localhost:3000/payment-result
  
  partnerName: BookingTour
  storeName: BookingTourStore
  requestType: captureWallet
  orderInfo: BookingTour payment
  lang: vi
```

**Important:** 
- `callbackUrl` = ngrok URL + webhook endpoint
- `redirectUrl` = local frontend (user gets redirected back here after payment)

**Timeline:** 5 minutes

---

### **Step 1.5: Build Backend**

```bash
# Terminal 2: Build backend
cd /mnt/c/Users/Kiet/Desktop/BookingTour
mvn clean package -DskipTests

# Wait for build to complete (~3-5 minutes)
# Look for: "BUILD SUCCESS"
```

**Timeline:** 5 minutes

---

### **Step 1.6: Start Docker Services**

```bash
# Terminal 3: Start all services
cd /mnt/c/Users/Kiet/Desktop/BookingTour
docker-compose up --build

# Wait for services to start:
# ✓ postgres-db ready
# ✓ eureka-server ready
# ✓ api-gateway ready (8080)
# ✓ payment-service ready (8084)
# ✓ tour-service ready (8082)
# ✓ booking-service ready (8083)
# ✓ rabbitmq ready (5672)
```

**Keep this terminal open!** ✅

**Timeline:** 3 minutes

---

### **Step 1.7: Start Frontend**

```bash
# Terminal 4: Start frontend
cd /mnt/c/Users/Kiet/Desktop/BookingTour/frontend
npm install  # if needed
npm run dev

# Output:
# ➜  Local:   http://localhost:5173/
# ➜  Press h to show help
```

**Keep this terminal open!** ✅

**Timeline:** 2 minutes

---

## ✅ **Checklist: Before Testing**

```
□ Terminal 1: ngrok running (showing public URL)
□ Terminal 2: Docker services running (all green)
□ Terminal 3: Frontend running on 5173
□ payment-service/src/main/resources/application.yml updated with ngrok URL
□ Backend rebuilt (mvn clean package)
□ Database ready (postgres running)
□ All 5 services in docker-compose up output
```

**If all ✓, proceed to PHASE 2!** 🚀

---

## 🎯 **PHASE 2: Frontend Payment Flow Test**

### **Step 2.1: Open Browser**

```
URL: http://localhost:5173
```

**Timeline:** 1 minute

---

### **Step 2.2: Navigate to Booking Page**

```
Click: Tours → Select Tour → Book Now

Actions:
1. Select departure date
2. Select number of passengers
3. Fill passenger details
4. Fill contact details
5. Review booking summary
6. See "Pay with MoMo" button ✓
```

**Timeline:** 3 minutes

---

### **Step 2.3: Click "Pay with MoMo" Button**

```
Button: "💳 Pay XXX,XXX VNĐ with MoMo"

Expected:
- Button becomes disabled/loading
- Show spinner icon
- Redirect to MoMo payment page
- See QR code ✓
```

**Timeline:** 1 minute

---

### **Step 2.4: PAUSE - Scan QR Code**

```
🛑 AT THIS POINT:
   ├─ Browser shows MoMo QR code
   ├─ MoMo payment flow displayed
   └─ DO NOT PROCEED YET

✅ Message to send me:
   "Tao quét qr xong rồi"

What I will do:
   └─ Check database for webhook callback
   └─ Verify payment & booking records
   └─ Check logs for IPN processing
```

**Timeline:** ⏳ Waiting for user

---

## 🔍 **PHASE 3: Backend Verification (After QR Scan)**

When user sends: **"Tao quét qr xong rồi"**

I will execute these checks:

### **Check 3.1: Payment Service Logs**

```bash
# Check if webhook was received
docker logs bookingtour-payment-service-1 | grep -i "momo callback"

# Expected output:
# [PAYMENT-SERVICE] Received MoMo callback for orderId=..., resultCode=0
# [PAYMENT-SERVICE] Processing callback...
# [PAYMENT-SERVICE] Payment updated: COMPLETED
```

---

### **Check 3.2: Database - Payment Record**

```bash
# Connect to payment database
docker exec -it bookingtour-payment-db-1 psql -U admin -d paymentdb

# Query:
SELECT * FROM payments ORDER BY created_at DESC LIMIT 1;

# Expected columns:
# ├─ id: [auto-generated]
# ├─ booking_id: [from frontend]
# ├─ amount: [booking total]
# ├─ status: COMPLETED ✓
# ├─ payment_method: MoMo
# ├─ transaction_id: [from MoMo]
# ├─ transaction_date: [from MoMo callback]
# └─ created_at: [timestamp]
```

---

### **Check 3.3: Database - Booking Record**

```bash
# Connect to booking database
docker exec -it bookingtour-booking-db-1 psql -U admin -d bookingdb

# Query:
SELECT * FROM bookings ORDER BY created_at DESC LIMIT 1;

# Expected columns:
# ├─ id: [booking ID]
# ├─ user_id: [user who booked]
# ├─ tour_id: [which tour]
# ├─ departure_id: [which departure]
# ├─ num_seats: [number of seats]
# ├─ total_amount: [total cost]
# ├─ status: CONFIRMED ✓ (changed from PENDING)
# └─ updated_at: [webhook processing time]
```

---

### **Check 3.4: Webhook Request Verification**

```bash
# Check ngrok logs to see if webhook was sent
# In ngrok terminal, look for:
# POST /api/payments/momo/webhook  200  [request details]

# Also check Payment Service for signature verification:
docker logs bookingtour-payment-service-1 | grep -i "signature"

# Expected:
# [PAYMENT-SERVICE] Signature verified successfully ✓
```

---

### **Check 3.5: RabbitMQ Message Verification**

```bash
# Check if booking confirmation message was published
docker logs bookingtour-payment-service-1 | grep -i "rabbitq\|booking.*confirmed"

# Expected:
# [PAYMENT-SERVICE] Publishing booking confirmation to RabbitMQ...
```

---

## 📊 **PHASE 4: Result Page Verification**

After backend checks, user proceeds:

### **Step 4.1: Complete Frontend Flow**

```
After QR scan on MoMo:
1. MoMo shows "Payment Successful" ✓
2. User redirected to /payment-result page
3. Show loading spinner (2 second wait)
4. Backend verification happens
5. Display success message ✓
6. Show booking details:
   ├─ Booking ID
   ├─ Tour name
   ├─ Total amount
   └─ Status: CONFIRMED ✓
7. "View Booking" button works
8. "Home" button works
```

**Timeline:** 1 minute

---

## 🐛 **Error Scenarios to Test**

### **Scenario A: Payment Cancellation**

```
Step:
1. Click "Pay with MoMo"
2. On MoMo page, click "Cancel"
3. Expected: Back to booking page with error message
4. Can retry payment

Check:
- Payment record status = FAILED
- Booking status = PENDING (unchanged)
```

---

### **Scenario B: Network Error During Webhook**

```
Simulate:
1. Stop API Gateway: docker-compose pause api-gateway
2. Complete payment on MoMo
3. MoMo tries to send webhook → fails (no route)
4. Resume API Gateway: docker-compose unpause api-gateway
5. MoMo retries webhook (should succeed)

Check:
- Payment eventual status = COMPLETED
- Booking eventual status = CONFIRMED
- See retry logs in docker logs
```

---

### **Scenario C: Invalid Signature**

```
Simulate by modifying webhook payload (if needed):
1. Send fake webhook to /api/payments/momo/webhook
2. Expected: 400 Bad Request with error

Check:
- Payment record NOT created
- Booking status unchanged
- Log shows "Signature verification failed"
```

---

### **Scenario D: Duplicate Webhook (Idempotency)**

```
Simulate:
1. After successful payment, send same webhook twice
2. Expected: Both return success, but payment updated only once

Check:
- Payment record has correct data (not duplicated)
- Payment log shows "Duplicate callback handled"
```

---

## 📋 **Testing Checklist**

```
SETUP PHASE
□ ngrok installed and running
□ ngrok URL copied
□ application.yml updated with ngrok callback URL
□ Backend rebuilt
□ Docker services started
□ Frontend running on 5173

FRONTEND TEST
□ Navigate to booking page
□ See booking form and summary
□ Click "Pay with MoMo" button
□ Redirected to MoMo payment page
□ QR code displayed ✓

BACKEND VERIFICATION (After QR Scan)
□ Check payment service logs
□ Verify payment record in database (status=COMPLETED)
□ Verify booking record updated (status=CONFIRMED)
□ Check webhook signature verification
□ Check RabbitMQ message published

RESULT PAGE
□ Redirected to /payment-result
□ Show loading spinner
□ Display success message
□ Show booking details
□ "View Booking" button works
□ "Home" button works

ERROR SCENARIOS
□ Test payment cancellation
□ Test network error recovery
□ Test invalid signature rejection
□ Test duplicate webhook handling
```

---

## 📝 **Log Files to Monitor**

```bash
# Terminal dedicated to logs:
docker logs -f bookingtour-payment-service-1

# Look for key events:
[PAYMENT-SERVICE] Received MoMo callback for orderId=...
[PAYMENT-SERVICE] Signature verified successfully
[PAYMENT-SERVICE] Processing callback...
[PAYMENT-SERVICE] Payment updated: COMPLETED
[PAYMENT-SERVICE] Publishing booking confirmation to RabbitMQ
```

---

## 🔗 **URLs Reference**

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | User interface |
| API Gateway | http://localhost:8080 | Backend entry point |
| Payment Service | http://localhost:8084 | Payment processing |
| ngrok Tunnel | https://xxxx.au.ngrok.io | MoMo webhook endpoint |
| Payment Callback | https://xxxx.au.ngrok.io/api/payments/momo/webhook | IPN endpoint |

---

## 🎯 **Success Criteria**

```
✅ COMPLETE SUCCESS when:
   □ Frontend QR code displays
   □ After scan: Payment record created (COMPLETED)
   □ After scan: Booking record updated (CONFIRMED)
   □ Webhook signature verified
   □ Result page shows success
   □ Database queries return correct data
   □ All logs show no errors
```

---

## 🚨 **Troubleshooting**

### **Issue: "No route to MoMo webhook"**
```
Cause: ngrok URL not in callbackUrl config
Fix: Update application.yml and rebuild
```

### **Issue: "Signature verification failed"**
```
Cause: Wrong secretKey or MoMo signing incorrect data
Fix: Double-check MoMo credentials in config
```

### **Issue: "Webhook received but payment not updated"**
```
Cause: Payment service crashed or booking not found
Fix: Check docker logs and database
```

### **Issue: "Can't reach ngrok URL"**
```
Cause: ngrok tunnel expired or stopped
Fix: Restart ngrok and update callbackUrl
```

---

## 📞 **Communication Protocol**

```
USER ACTION → RESPONSE NEEDED

1. User: "Tao quét qr xong rồi"
   Me: Execute all Phase 3 checks
       Report findings from:
       - Payment Service logs
       - Database payment record
       - Database booking record
       - Webhook verification
       - Result page status

2. Me: "Database check:"
   - Payment: [status + details]
   - Booking: [status + details]
   - Logs: [webhook verification]
   
3. If SUCCESS:
   Me: "✅ Testing PASSED! Payment flow working end-to-end!"
   
4. If FAILURE:
   Me: "❌ Issue found: [description]"
       "Fix: [steps to resolve]"
```

---

## ⏰ **Total Testing Time Estimate**

| Phase | Task | Time |
|-------|------|------|
| 1 | Setup & Configuration | 30 min |
| 2 | Frontend Payment Flow | 5 min |
| 3 | Backend Verification | 10 min |
| 4 | Result Page Test | 3 min |
| Bonus | Error Scenarios | 20 min |
| **TOTAL** | **Full E2E Test** | **~70 min** |

---

## 📌 **Next Steps**

1. **After Frontend Implementation:**
   - Create `paymentService.ts`
   - Create `MoMoPaymentButton.tsx`
   - Create `PaymentResultPage.tsx`
   - Update `App.tsx` routes

2. **Before Testing:**
   - Follow PHASE 1 setup steps
   - Have ngrok URL ready
   - Update configuration

3. **During Testing:**
   - Follow PHASE 2 steps
   - Send user signal when QR shows
   - Wait for user: "Tao quét qr xong rồi"

4. **Verification:**
   - Execute PHASE 3 database checks
   - Report findings
   - Document results

---

**Status:** 🟢 Ready for Implementation  
**Backend:** ✅ Complete  
**Frontend:** ⏳ Implementing  
**Testing:** 📋 Plan Ready
