# 📋 BookingTour - MoMo Payment Integration Plan

**Date:** October 26, 2025  
**Version:** 1.0  
**Status:** 🔵 Planning Phase  
**Target:** Production-ready MoMo payment integration

---

## 📊 Executive Summary

Transform BookingTour payment system from **mock-only mode** to **production-ready MoMo integration**.

```
Current State:  Mock payments only
Target State:   Real MoMo gateway integration
Timeline:       ~2-3 weeks (17 hours core dev)
Risk Level:     Low (using official MoMo library)
```

---

## ✅ Phase Completion Status

### Phase 1: Database Foundation (COMPLETED ✅)
```
✅ bookingdb schema created
✅ paymentdb schema created
✅ Booking + BookingGuest entities
✅ Payment entity
✅ All repositories with query methods
✅ Docker setup with health checks
```

### Phase 2: MoMo Documentation (COMPLETED ✅)
```
✅ Official MoMo docs researched
✅ Signature generation (HMAC SHA256) understood
✅ IPN webhook flow documented
✅ Result codes mapped
✅ Idempotency pattern explained
✅ 1000+ line integration guide created
```

### Phase 3: Reference Implementation (COMPLETED ✅)
```
✅ Demo project cloned: lnguyen99/test-momopayment
✅ Credentials extracted from demo
✅ Code patterns identified
✅ Java library usage understood
✅ Implementation examples available
```

---

## 🎯 Project Credentials (For Testing)

**MoMo Test Account #1 (AllInOne):**
```
partnerCode     : MOMOIQA420180417
Environment     : Dev/Sandbox
Type            : AllInOne gateway
```

**MoMo Test Account #2 (POS):**
```
partnerCode     : MOMOLRJZ20181206
accessKey       : mTCKt9W3eU1m39TW
secretKey       : KqBEecvaJf1nULnhPF5htpG3AMtDIOlD
Environment     : Dev/Sandbox
Type            : POS/Non-AllInOne
```

**Usage:**
- All credentials are from official GitHub demo project
- Safe for testing in sandbox environment
- Never commit to production without real credentials

---

## 📈 Implementation Roadmap

### PHASE 3.1: Backend Configuration (2-3 hours)

#### Task 3.1.1: Update pom.xml Dependencies
```xml
<!-- Add MoMo payment library -->
<dependency>
    <groupId>io.github.lnguyen99</groupId>
    <artifactId>momopayment</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>

<!-- Add repository for snapshot -->
<repository>
    <id>ossrh</id>
    <url>https://oss.sonatype.org/content/repositories/snapshots</url>
</repository>
```

#### Task 3.1.2: Create Configuration Classes
```
Files to create:
  ├── payment-service/src/main/java/.../MoMoConfig.java
  ├── payment-service/src/main/java/.../MoMoProperties.java
  └── payment-service/src/main/resources/momo-config.yml
```

**MoMoConfig.java:**
- Load credentials from environment variables
- Initialize MoMo environment (dev/prod)
- Create PartnerInfo bean

**MoMoProperties.java:**
```java
@ConfigurationProperties(prefix = "momo")
public class MoMoProperties {
    private String partnerCode;
    private String accessKey;
    private String secretKey;
    private String environment; // dev or prod
    private String callbackUrl;
    private String redirectUrl;
}
```

**application-docker.yml:**
```yaml
momo:
  partnerCode: ${MOMO_PARTNER_CODE}
  accessKey: ${MOMO_ACCESS_KEY}
  secretKey: ${MOMO_SECRET_KEY}
  environment: dev
  callbackUrl: http://api-gateway:8080/api/payments/momo-webhook
  redirectUrl: http://localhost:3000/payment-result
```

#### Task 3.1.3: Update Database Schema
```sql
-- Add MoMo-specific columns to payments table
ALTER TABLE payments ADD COLUMN momo_order_id VARCHAR(255);
ALTER TABLE payments ADD COLUMN momo_request_id VARCHAR(255) UNIQUE;
ALTER TABLE payments ADD COLUMN momo_trans_id BIGINT;
ALTER TABLE payments ADD COLUMN momo_payment_method VARCHAR(100);
ALTER TABLE payments ADD COLUMN momo_response_data JSONB;

-- Update SQL migration script
sql-scripts/init-payment-db.sql (add new columns)
```

**Timeline:** 1-2 hours

---

### PHASE 3.2: Core Gateway Implementation (4-5 hours)

#### Task 3.2.1: Create Gateway Interface
```java
// PaymentGateway.java (multi-gateway support pattern)
public interface PaymentGateway {
    CreateOrderResponse createOrder(CreateOrderRequest request);
    void handleCallback(CallbackRequest callback);
    QueryOrderResponse queryOrder(String orderId);
    RefundResponse refund(RefundRequest request);
}
```

#### Task 3.2.2: Create MoMo Gateway Implementation
```
Files to create:
  ├── payment-service/src/main/java/.../gateway/MoMoPaymentGateway.java
  ├── payment-service/src/main/java/.../gateway/MoMoSignatureGenerator.java
  ├── payment-service/src/main/java/.../gateway/MoMoConstants.java
  ├── payment-service/src/main/java/.../gateway/dto/MoMoCreateOrderRequest.java
  ├── payment-service/src/main/java/.../gateway/dto/MoMoCreateOrderResponse.java
  └── payment-service/src/main/java/.../gateway/dto/MoMoCallbackRequest.java
```

**MoMoSignatureGenerator.java:**
- HMAC SHA256 signature generation
- Alphabetical parameter sorting
- Both request signing + callback verification

**MoMoPaymentGateway.java:**
- Implement PaymentGateway interface
- Call MoMo API: `/v2/gateway/api/create`
- Parse response
- Error handling with result codes
- Idempotency using requestId

**MoMoConstants.java:**
```java
public class MoMoConstants {
    // Endpoints
    public static final String TEST_ENDPOINT = "https://test-payment.momo.vn";
    public static final String PROD_ENDPOINT = "https://api.momo.vn";
    public static final String CREATE_ORDER_PATH = "/v2/gateway/api/create";
    
    // Request types
    public static final String REQUEST_TYPE = "captureWallet";
    
    // Result codes
    public static final int SUCCESS = 0;
    public static final int PENDING = 1001;
    public static final int PROCESSING = 1002;
    public static final int INVALID_SIGNATURE = -5;
    public static final int DUPLICATE = -11;
}
```

**Timeline:** 2-3 hours

---

### PHASE 3.3: Webhook Handler (2-3 hours)

#### Task 3.3.1: Create Callback Controller
```
Files to create:
  ├── payment-service/src/main/java/.../controller/MoMoCallbackController.java
  └── payment-service/src/main/java/.../dto/MoMoCallbackResponse.java
```

**MoMoCallbackController.java:**
```java
@RestController
@RequestMapping("/api/payments")
public class MoMoCallbackController {
    
    @PostMapping("/momo-webhook")
    public ResponseEntity<?> handleMoMoCallback(@RequestBody MoMoCallbackRequest request) {
        // 1. Verify signature
        if (!verifySignature(request)) {
            return ResponseEntity.status(401).build();
        }
        
        // 2. Find payment
        Payment payment = paymentRepository.findByMoMoOrderId(request.getOrderId())
            .orElseThrow(() -> new PaymentNotFoundException());
        
        // 3. Check result code
        if (request.getResultCode() == 0) {
            handlePaymentSuccess(payment, request);
        } else {
            handlePaymentFailed(payment, request);
        }
        
        // 4. Return 200 OK (VERY IMPORTANT)
        return ResponseEntity.ok(new MoMoAckResponse(0, "Success"));
    }
    
    private void handlePaymentSuccess(Payment payment, MoMoCallbackRequest request) {
        // Update payment
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setMoMoTransactionId(request.getTransId());
        payment.setTransactionDate(new Date(request.getResponseTime()));
        paymentRepository.save(payment);
        
        // Update booking
        Booking booking = bookingRepository.findById(payment.getBookingId())
            .orElseThrow();
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);
        
        // Send confirmation email
        emailService.sendBookingConfirmation(booking);
    }
    
    private void handlePaymentFailed(Payment payment, MoMoCallbackRequest request) {
        payment.setStatus(PaymentStatus.FAILED);
        payment.setErrorMessage(request.getMessage());
        paymentRepository.save(payment);
        
        Booking booking = bookingRepository.findById(payment.getBookingId())
            .orElseThrow();
        booking.setStatus(BookingStatus.FAILED);
        bookingRepository.save(booking);
    }
}
```

**Timeline:** 1-1.5 hours

---

### PHASE 3.4: Service Integration (2-3 hours)

#### Task 3.4.1: Update PaymentService
```java
@Service
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final MoMoPaymentGateway moMoGateway;
    private final PaymentCommandPublisher publisher;
    
    @Transactional
    public CreateOrderResponse createMoMoOrder(CreateOrderRequest request) {
        // 1. Create payment record
        Payment payment = new Payment();
        payment.setBookingId(request.getBookingId());
        payment.setAmount(request.getAmount());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setMoMoOrderId(generateOrderId());
        payment.setMoMoRequestId(generateRequestId());
        Payment savedPayment = paymentRepository.save(payment);
        
        // 2. Call MoMo gateway
        MoMoCreateOrderRequest moMoRequest = buildMoMoRequest(savedPayment, request);
        CreateOrderResponse response = moMoGateway.createOrder(moMoRequest);
        
        // 3. Update payment with MoMo response
        savedPayment.setMoMoResponseData(response.getResponseData());
        paymentRepository.save(savedPayment);
        
        // 4. Return order URL to frontend
        return response;
    }
    
    private String generateOrderId() {
        return "BT-" + System.currentTimeMillis();
    }
    
    private String generateRequestId() {
        return System.currentTimeMillis() + "_" + UUID.randomUUID()
            .toString().substring(0, 8);
    }
}
```

**Timeline:** 1.5-2 hours

---

### PHASE 3.5: Frontend Integration (2-3 hours)

#### Task 3.5.1: Create Payment Component
```
Files to create:
  ├── frontend/src/components/payment/MoMoPaymentButton.tsx
  ├── frontend/src/pages/PaymentResultPage.tsx
  └── frontend/src/services/paymentService.ts
```

**MoMoPaymentButton.tsx:**
```typescript
export const MoMoPaymentButton: React.FC<Props> = ({ bookingId, amount }) => {
  const handlePayment = async () => {
    try {
      // 1. Call backend to create MoMo order
      const response = await fetch('/api/payments/create-momo-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, amount })
      });
      
      const data = await response.json();
      
      // 2. Redirect to MoMo payment page
      if (data.payUrl) {
        window.location.href = data.payUrl;
      }
    } catch (error) {
      console.error('Payment error:', error);
      showErrorMessage('Payment failed');
    }
  };
  
  return (
    <button onClick={handlePayment} className="momo-pay-btn">
      💳 Pay with MoMo
    </button>
  );
};
```

**PaymentResultPage.tsx:**
- Parse query parameters
- Verify signature (optional)
- Show success/error message
- Redirect to dashboard

**Timeline:** 1.5-2 hours

---

### PHASE 3.6: Testing (4-5 hours)

#### Task 3.6.1: Sandbox Testing
```
Test Scenarios:
  ✅ Successful payment (resultCode=0)
  ✅ Failed payment (resultCode=-1)
  ✅ User cancelled (resultCode=-2)
  ✅ Duplicate detection (resultCode=-11)
  ✅ Invalid signature (resultCode=-5)
  ✅ Timeout handling
  ✅ Network error recovery
  ✅ IPN webhook delivery
  ✅ Database state consistency
  ✅ Email notifications
```

#### Task 3.6.2: Integration Tests
```java
@SpringBootTest
public class MoMoPaymentIntegrationTest {
    
    @Test
    public void testFullPaymentFlow() {
        // 1. Create booking
        // 2. Call create order endpoint
        // 3. Verify MoMo response
        // 4. Simulate webhook callback
        // 5. Verify payment status updated
        // 6. Verify booking status updated
    }
    
    @Test
    public void testDuplicatePaymentDetection() {
        // Test idempotency with same requestId
    }
    
    @Test
    public void testSignatureVerification() {
        // Test invalid signature rejection
    }
}
```

#### Task 3.6.3: Manual Testing Checklist
```
MoMo Test App Setup:
  [ ] Download MoMo Test app
  [ ] Login with test account
  [ ] Configure test environment
  
Test Payment Flow:
  [ ] Start booking process
  [ ] Select MoMo payment
  [ ] Verify order details on MoMo page
  [ ] Complete payment successfully
  [ ] Verify redirect to result page
  [ ] Verify booking confirmed
  [ ] Verify payment in database
  
Error Scenarios:
  [ ] Cancel payment mid-flow
  [ ] Payment timeout
  [ ] Network error during callback
  [ ] Duplicate payment attempts
  
Admin Verification:
  [ ] Check payment logs
  [ ] Verify signatures in logs
  [ ] Check IPN delivery log
  [ ] Verify email sent
```

**Timeline:** 2-3 hours manual + 2 hours auto-tests

---

## 📦 Deliverables

### Code Files
```
payment-service/
├── src/main/java/com/example/payment/
│   ├── config/
│   │   ├── MoMoConfig.java
│   │   └── MoMoProperties.java
│   ├── gateway/
│   │   ├── PaymentGateway.java (interface)
│   │   ├── MoMoPaymentGateway.java
│   │   ├── MoMoSignatureGenerator.java
│   │   ├── MoMoConstants.java
│   │   └── dto/
│   │       ├── MoMoCreateOrderRequest.java
│   │       ├── MoMoCreateOrderResponse.java
│   │       └── MoMoCallbackRequest.java
│   ├── controller/
│   │   ├── PaymentController.java (updated)
│   │   └── MoMoCallbackController.java (new)
│   ├── service/
│   │   └── PaymentService.java (updated)
│   └── model/
│       ├── Payment.java (updated)
│       └── PaymentLog.java (new)
├── src/main/resources/
│   ├── application.yml (updated)
│   └── application-docker.yml (updated)

frontend/
├── src/components/payment/
│   └── MoMoPaymentButton.tsx (new)
├── src/pages/
│   └── PaymentResultPage.tsx (new)
└── src/services/
    └── paymentService.ts (updated)

database/
├── sql-scripts/
│   └── init-payment-db.sql (updated)
```

### Configuration Files
```
environment variables needed:
  MOMO_PARTNER_CODE=MOMOLRJZ20181206
  MOMO_ACCESS_KEY=mTCKt9W3eU1m39TW
  MOMO_SECRET_KEY=KqBEecvaJf1nULnhPF5htpG3AMtDIOlD
  MOMO_ENVIRONMENT=dev
```

### Documentation
```
✅ PAYMENT_INTEGRATION_PLAN.md (this file)
✅ MOMO_PAYMENT_INTEGRATION.md (reference guide)
✅ Code comments & JavaDoc
✅ API endpoint documentation
✅ Testing guide
```

---

## 🎯 Success Criteria

```
✅ Backend
  [ ] MoMo gateway implementation complete
  [ ] Webhook handler receives & processes callbacks
  [ ] Signature verification working
  [ ] Payment status updates correctly
  [ ] Booking confirmation automatic
  
✅ Frontend
  [ ] Payment button redirects to MoMo
  [ ] Result page shows correct status
  [ ] Error messages display properly
  [ ] Responsive on mobile
  
✅ Database
  [ ] Payment records saved correctly
  [ ] Booking status updated after payment
  [ ] Logs contain all transaction details
  [ ] No duplicate payments
  
✅ Integration
  [ ] Full flow works end-to-end
  [ ] Multiple payment methods tested
  [ ] Error scenarios handled gracefully
  [ ] Performance acceptable (< 2s response time)
  
✅ Production Ready
  [ ] All credentials managed via env vars
  [ ] Error logging comprehensive
  [ ] Monitoring alerts set up
  [ ] Documentation complete
```

---

## ⏰ Timeline Estimate

| Phase | Task | Hours | Status |
|-------|------|-------|--------|
| 3.1 | Backend Config | 2-3 | ⏳ Not Started |
| 3.2 | Gateway Implementation | 4-5 | ⏳ Not Started |
| 3.3 | Webhook Handler | 2-3 | ⏳ Not Started |
| 3.4 | Service Integration | 2-3 | ⏳ Not Started |
| 3.5 | Frontend | 2-3 | ⏳ Not Started |
| 3.6 | Testing | 4-5 | ⏳ Not Started |
| **Total** | | **17-22 hours** | |

**Development Schedule:**
```
Week 1:
  Mon-Tue: Phases 3.1 + 3.2 (Backend config & gateway)
  Wed-Thu: Phase 3.3 + 3.4 (Webhook & service)
  Fri: Phase 3.5 (Frontend)

Week 2:
  Mon-Tue: Phase 3.6 (Testing)
  Wed: Final integration & UAT
  Thu-Fri: Bug fixes & production prep
```

---

## 🚀 Deployment Strategy

### Sandbox (Dev Environment)
```
1. Deploy with test credentials
2. Run full testing suite
3. Monitor logs for 24 hours
```

### Staging
```
1. Get production credentials from MoMo
2. Update environment variables
3. Run UAT
4. Monitor for errors
```

### Production
```
1. Final credential verification
2. Enable production monitoring
3. Setup alerts
4. Document troubleshooting guide
5. Go live
```

---

## 🔒 Security Checklist

```
✅ Credentials
  [ ] All credentials in environment variables
  [ ] No hardcoded secrets
  [ ] Rotate test credentials after go-live
  
✅ API Communication
  [ ] HTTPS only (enforce in production)
  [ ] Request signing (HMAC SHA256)
  [ ] Callback signature verification
  [ ] Rate limiting on webhook endpoint
  
✅ Data Protection
  [ ] Payment info encrypted at rest
  [ ] Logs don't contain sensitive data
  [ ] Database access restricted
  [ ] Audit trail maintained
  
✅ Error Handling
  [ ] No sensitive info in error messages
  [ ] Proper exception handling
  [ ] Graceful degradation
```

---

## 📞 Support & Resources

### MoMo Resources
- **Official Docs:** https://developers.momo.vn/
- **Support Email:** merchant.care@momo.vn
- **Hotline:** 1900 636 652

### GitHub Reference
- **Demo Project:** https://github.com/lnguyen99/test-momopayment
- **MoMo Library:** io.github.lnguyen99:momopayment:1.0-SNAPSHOT

### Internal Resources
- **Integration Guide:** MOMO_PAYMENT_INTEGRATION.md
- **Database Schema:** sql-scripts/init-payment-db.sql
- **Test Credentials:** This document

---

## 📝 Decision Log

### Decision 1: Use Official MoMo Library vs Custom Implementation
```
✅ Decision: Use official momopayment library
Rationale:
  - Maintained by official source
  - Handles all signature generation
  - RSA encryption built-in
  - Error handling established
  - Less risk of bugs
```

### Decision 2: Multi-Gateway Support Pattern
```
✅ Decision: Implement PaymentGateway interface
Rationale:
  - Future-proof for Zalopay, VNPay, etc.
  - Separation of concerns
  - Easy to swap implementations
  - Testable in isolation
```

### Decision 3: Callback-Driven Updates
```
✅ Decision: IPN webhook for payment confirmation
Rationale:
  - Industry standard (most reliable)
  - Automatic status updates
  - No polling needed
  - Real-time notifications
```

---

## ✅ Approval & Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| Tech Lead | - | - | ⏳ Pending |
| Product Owner | - | - | ⏳ Pending |
| QA Lead | - | - | ⏳ Pending |

---

## 📌 Next Steps

1. **This Week:**
   - [ ] Review this plan
   - [ ] Get approval to proceed
   - [ ] Setup development environment
   - [ ] Create feature branch

2. **Next Week:**
   - [ ] Begin Phase 3.1 (Config)
   - [ ] Daily standups
   - [ ] Weekly progress review

3. **Post-Launch:**
   - [ ] Monitor production closely
   - [ ] Collect metrics
   - [ ] Plan Phase 4 (Advanced features)

---

**Document Owner:** Development Team  
**Last Updated:** October 26, 2025  
**Status:** Ready for Review & Approval

For questions or clarifications, refer to MOMO_PAYMENT_INTEGRATION.md or contact the development team.
