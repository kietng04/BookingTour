# 📱 BookingTour Frontend - MoMo Payment Integration Plan

**Date:** October 26, 2025  
**Version:** 1.0  
**Status:** 🔵 Planning Phase  
**Focus:** Frontend Phase 3.5 + Phase 3.6

---

## 📋 **Current Status**

### ✅ **Backend Complete** (Phase 3.1-3.4)
```
✅ 24 Java files implemented
✅ MoMo gateway configured
✅ IPN webhook handler ready
✅ Payment database schema
✅ API endpoints ready:
   POST /api/payments/create-momo-order
   POST /api/payments/momo-webhook
```

### ⏳ **Frontend Tasks** (Phase 3.5)
```
Task 1: Create MoMoPaymentButton component
Task 2: Create PaymentResultPage component
Task 3: Create payment service integration
Task 4: Update BookingPage with payment flow
```

---

## 🚀 **PHASE 3.5: Frontend Integration**

### **Task 3.5.1: Create Payment Service Integration**

**File:** `frontend/src/services/paymentService.ts`

```typescript
// Create order with backend
export async function createMoMoOrder(bookingId: number, amount: number) {
  const response = await fetch('/api/payments/create-momo-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      bookingId, 
      amount 
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create MoMo order: ${response.statusText}`);
  }
  
  return await response.json();
}

// Get payment status
export async function getPaymentStatus(bookingId: number) {
  const response = await fetch(`/api/payments/booking/${bookingId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch payment status');
  }
  return await response.json();
}

// Get booking details
export async function getBookingStatus(bookingId: number) {
  const response = await fetch(`/api/bookings/${bookingId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch booking status');
  }
  return await response.json();
}
```

**Purpose:**
- Calls backend to create MoMo order
- Gets payment status
- Gets booking confirmation

**Timeline:** 1 hour

---

### **Task 3.5.2: Create MoMoPaymentButton Component**

**File:** `frontend/src/components/payment/MoMoPaymentButton.tsx`

```typescript
import React, { useState } from 'react';
import { createMoMoOrder } from '../../services/paymentService';

interface MoMoPaymentButtonProps {
  bookingId: number;
  amount: number;
  tourName: string;
  onLoading?: (loading: boolean) => void;
}

export const MoMoPaymentButton: React.FC<MoMoPaymentButtonProps> = ({
  bookingId,
  amount,
  tourName,
  onLoading
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      
      if (onLoading) onLoading(true);

      // 1. Call backend to create MoMo order
      const response = await createMoMoOrder(bookingId, amount);

      if (!response.payUrl) {
        throw new Error('No payment URL received from server');
      }

      // 2. Redirect to MoMo payment page
      console.log('Redirecting to MoMo:', response.payUrl);
      window.location.href = response.payUrl;
      
      // Note: User leaves website here, onLoading cleanup not needed
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setIsProcessing(false);
      
      if (onLoading) onLoading(false);
      
      console.error('Payment error:', err);
    }
  };

  return (
    <div className="momo-payment-section">
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}
      
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className={`momo-pay-btn ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isProcessing ? (
          <>
            <span className="inline-block mr-2">⏳</span>
            Processing payment...
          </>
        ) : (
          <>
            <span className="inline-block mr-2">💳</span>
            Pay {amount.toLocaleString('vi-VN')} VNĐ with MoMo
          </>
        )}
      </button>

      <p className="text-sm text-gray-500 mt-2">
        ✓ Secure payment via MoMo Gateway
      </p>
    </div>
  );
};
```

**Features:**
- ✅ Calls backend to create order
- ✅ Redirects to MoMo payment page
- ✅ Error handling
- ✅ Loading state
- ✅ Amount formatting (Vietnamese)

**Timeline:** 1.5 hours

---

### **Task 3.5.3: Create PaymentResultPage Component**

**File:** `frontend/src/pages/PaymentResultPage.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getBookingStatus } from '../services/paymentService';

export const PaymentResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<'success' | 'failed' | 'loading' | 'verifying'>('loading');
  const [booking, setBooking] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setStatus('verifying');
        
        // Get URL params from MoMo redirect
        const momoStatus = searchParams.get('status');
        const bookingIdParam = searchParams.get('bookingId') || sessionStorage.getItem('currentBookingId');

        if (!bookingIdParam) {
          setStatus('failed');
          setError('Booking ID not found');
          return;
        }

        // Wait a bit for backend to process webhook
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verify booking status from backend
        const bookingData = await getBookingStatus(parseInt(bookingIdParam));
        setBooking(bookingData);

        if (bookingData.status === 'CONFIRMED') {
          setStatus('success');
          setMessage(`✅ Thanh toán thành công! Booking #${bookingData.bookingId} được xác nhận.`);
        } else if (bookingData.status === 'FAILED') {
          setStatus('failed');
          setMessage('❌ Thanh toán thất bại. Vui lòng thử lại.');
        } else {
          setStatus('failed');
          setMessage(`⏳ Trạng thái: ${bookingData.status}. Vui lòng kiểm tra lại.`);
        }

      } catch (err) {
        setStatus('failed');
        setError(err instanceof Error ? err.message : 'Verification failed');
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          {status === 'loading' || status === 'verifying' ? (
            <>
              <div className="inline-block animate-spin mb-4">
                <span className="text-4xl">⏳</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                {status === 'verifying' ? 'Verifying Payment...' : 'Processing...'}
              </h1>
            </>
          ) : status === 'success' ? (
            <>
              <div className="mb-4 text-5xl animate-bounce">✅</div>
              <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
            </>
          ) : (
            <>
              <div className="mb-4 text-5xl">❌</div>
              <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
            </>
          )}
        </div>

        {/* Message */}
        {message && (
          <p className="text-center text-gray-700 mb-6 text-lg">
            {message}
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Booking Details (if success) */}
        {status === 'success' && booking && (
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <h2 className="font-bold text-green-800 mb-3">Booking Details</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Booking ID:</span> {booking.bookingId}</p>
              <p><span className="font-semibold">Tour:</span> {booking.tourName || 'N/A'}</p>
              <p><span className="font-semibold">Total:</span> {booking.totalAmount?.toLocaleString('vi-VN')} VNĐ</p>
              <p><span className="font-semibold">Status:</span> <span className="text-green-600">CONFIRMED ✓</span></p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/bookings')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
          >
            View Booking
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition"
          >
            Home
          </button>
        </div>

        {/* Support Info */}
        <p className="text-center text-gray-500 text-xs mt-4">
          If you have questions, contact support@bookingtour.com
        </p>
      </div>
    </div>
  );
};
```

**Features:**
- ✅ Displays loading state
- ✅ Verifies payment with backend (2s delay for webhook)
- ✅ Shows success or failure
- ✅ Displays booking details
- ✅ Navigation buttons

**Timeline:** 1.5 hours

---

### **Task 3.5.4: Update BookingPage to Include Payment**

**File:** `frontend/src/pages/BookingPage.tsx` (Update)

```typescript
// Add to imports
import { MoMoPaymentButton } from '../components/payment/MoMoPaymentButton';

// In booking summary section, after booking details:
<div className="mt-6 border-t pt-6">
  <h3 className="text-lg font-bold mb-4">💳 Payment</h3>
  
  {!bookingConfirmed ? (
    <MoMoPaymentButton
      bookingId={booking.id}
      amount={booking.totalAmount}
      tourName={booking.tourName}
      onLoading={setIsPaymentProcessing}
    />
  ) : (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
      ✓ Payment Completed
    </div>
  )}
</div>
```

**Timeline:** 30 minutes

---

### **Task 3.5.5: Setup Payment Result Route**

**File:** `frontend/src/App.tsx` (Update)

```typescript
import PaymentResultPage from './pages/PaymentResultPage';

// Add to Routes:
<Route path="/payment-result" element={<PaymentResultPage />} />
```

**Timeline:** 15 minutes

---

## 🧪 **PHASE 3.6: Testing**

### **Task 3.6.1: Manual Testing Checklist**

```
□ Setup
  □ Backend running on 8080
  □ Frontend running on 3000
  □ Database ready
  
□ Create Booking Flow
  □ Navigate to booking page
  □ Fill booking details
  □ See "Pay with MoMo" button
  
□ Payment Button
  □ Click payment button
  □ Should redirect to MoMo payment page
  □ URL should contain payUrl
  
□ Success Payment
  □ Complete payment on MoMo
  □ Should redirect to /payment-result
  □ Show success message
  □ Show booking details
  □ Button "View Booking" works
  
□ Failed Payment
  □ Cancel payment on MoMo
  □ Should show error message
  □ Can retry payment
  
□ Error Scenarios
  □ Network error → Show message
  □ Invalid bookingId → Show error
  □ Backend timeout → Show spinner
  
□ Database Verification
  □ Payment record created
  □ Booking status = CONFIRMED
  □ Email sent (if configured)
```

**Timeline:** 2 hours

---

### **Task 3.6.2: Integration Tests**

**File:** `frontend/src/__tests__/payment.integration.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MoMoPaymentButton } from '../components/payment/MoMoPaymentButton';
import { PaymentResultPage } from '../pages/PaymentResultPage';

describe('MoMo Payment Integration', () => {
  
  test('MoMoPaymentButton renders with correct amount', () => {
    render(
      <BrowserRouter>
        <MoMoPaymentButton 
          bookingId={1} 
          amount={500000} 
          tourName="Ha Giang"
        />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/500,000 VNĐ/)).toBeInTheDocument();
  });

  test('MoMoPaymentButton calls backend on click', async () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ payUrl: 'https://test-payment.momo.vn/...' })
      })
    );
    global.fetch = mockFetch;

    render(
      <BrowserRouter>
        <MoMoPaymentButton 
          bookingId={1} 
          amount={500000} 
          tourName="Ha Giang"
        />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Pay.*VNĐ/));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/payments/create-momo-order',
        expect.any(Object)
      );
    });
  });

  test('PaymentResultPage shows success message', async () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          bookingId: 1,
          status: 'CONFIRMED',
          tourName: 'Ha Giang',
          totalAmount: 500000
        })
      })
    );
    global.fetch = mockFetch;

    render(
      <BrowserRouter>
        <PaymentResultPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Payment Successful/)).toBeInTheDocument();
    });
  });
});
```

**Timeline:** 1.5 hours

---

### **Task 3.6.3: End-to-End Flow Test**

```
Manual E2E Steps:
1. Start backend: docker-compose up
2. Start frontend: npm start
3. Open http://localhost:3000
4. Navigate to booking page
5. Fill booking form
6. Click "Pay with MoMo"
7. Redirect to MoMo test page ✓
8. Choose payment method (e.g., QR scan)
9. Confirm payment
10. Redirect to /payment-result ✓
11. Verify booking status = CONFIRMED ✓
12. Check database for payment record ✓
```

**Timeline:** 1 hour

---

## 📦 **Deliverables**

### Files to Create:
```
frontend/src/
├── services/
│   └── paymentService.ts (NEW)
├── components/payment/
│   └── MoMoPaymentButton.tsx (NEW)
├── pages/
│   └── PaymentResultPage.tsx (NEW)
└── __tests__/
    └── payment.integration.test.tsx (NEW)
```

### Files to Update:
```
frontend/src/
├── App.tsx (add route)
├── pages/BookingPage.tsx (add payment button)
└── styles/ (add payment styles if needed)
```

---

## ⏰ **Timeline Estimate**

| Task | Hours | Status |
|------|-------|--------|
| 3.5.1 | 1 | ⏳ |
| 3.5.2 | 1.5 | ⏳ |
| 3.5.3 | 1.5 | ⏳ |
| 3.5.4 | 0.5 | ⏳ |
| 3.5.5 | 0.25 | ⏳ |
| **Subtotal** | **4.75 hours** | |
| 3.6.1 | 2 | ⏳ |
| 3.6.2 | 1.5 | ⏳ |
| 3.6.3 | 1 | ⏳ |
| **Subtotal** | **4.5 hours** | |
| **TOTAL** | **9.25 hours** | |

---

## 🎯 **Success Criteria**

```
✅ Frontend
  [ ] MoMoPaymentButton renders correctly
  [ ] Amount formatted in Vietnamese
  [ ] Redirects to MoMo on click
  [ ] Error handling works
  
✅ Result Page
  [ ] Shows loading state
  [ ] Verifies with backend after 2s
  [ ] Shows success message
  [ ] Shows booking details
  [ ] Navigation works
  
✅ Integration
  [ ] Full flow: Booking → Payment → Confirmation
  [ ] Database updated after payment
  [ ] Email sent (if configured)
  [ ] Mobile responsive
  
✅ Error Handling
  [ ] Network errors caught
  [ ] Invalid bookingId handled
  [ ] Timeout handled gracefully
  [ ] User can retry
```

---

## 🚀 **Next Steps**

1. **Immediate:**
   - Create paymentService.ts
   - Create MoMoPaymentButton.tsx
   - Create PaymentResultPage.tsx

2. **Integration:**
   - Update App.tsx routes
   - Update BookingPage.tsx

3. **Testing:**
   - Manual testing checklist
   - Integration tests
   - E2E testing

4. **Production:**
   - Build & deploy
   - Monitor payment flow
   - Error logging

---

**Status:** Ready for Implementation  
**Backend:** ✅ Complete (Phase 3.1-3.4)  
**Frontend:** ⏳ Ready to Start (Phase 3.5-3.6)
