import React, { useState } from 'react';
import { createMoMoOrder } from '../../services/paymentService';
import { formatCurrency } from '../../utils/format';

interface MoMoPaymentButtonProps {
  amount: number;
  tourName: string;
  onCreateBooking: () => Promise<{ bookingId: number }>;
  userId?: number | null;
  onProcessingChange?: (isProcessing: boolean) => void;
  onError?: (message: string) => void;
}

const PAYMENT_SESSION_KEY = 'bookingTour:lastPayment';

type ActivePaymentSession = {
  bookingId: number;
  orderId: string;
  payUrl: string;
  qrCodeUrl?: string;
  deeplink?: string;
  message?: string;
  amount: number;
  createdAt: string;
};

export const MoMoPaymentButton: React.FC<MoMoPaymentButtonProps> = ({
  amount,
  tourName,
  onCreateBooking,
  userId,
  onProcessingChange,
  onError,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handlePayment = async () => {
    try {
      setLocalError(null);
      setIsProcessing(true);
      onProcessingChange?.(true);

      const booking = await onCreateBooking();
      if (!booking?.bookingId) {
        throw new Error('Không thể tạo thông tin đặt chỗ.');
      }

      const normalizedUserId = userId && userId > 0 ? userId : 1;
      const orderInfo = `Thanh toán tour ${tourName}`;
      const extraData = `bookingId=${booking.bookingId}&userId=${normalizedUserId}`;

      const response = await createMoMoOrder({
        bookingId: booking.bookingId,
        amount,
        userId: normalizedUserId,
        orderInfo,
        extraData,
      });

      if (!response.payUrl) {
        throw new Error(response.message || 'Không nhận được đường dẫn thanh toán từ MoMo.');
      }

      sessionStorage.setItem(
        PAYMENT_SESSION_KEY,
        JSON.stringify({
          bookingId: booking.bookingId,
          orderId: response.orderId,
          requestId: response.requestId,
          createdAt: new Date().toISOString(),
        })
      );

      if (response.deeplink) {
        window.location.href = response.deeplink;
        
        setTimeout(() => {
          if (response.payUrl) {
            window.location.href = response.payUrl;
          }
        }, 1500);
      } else if (response.payUrl) {
        window.location.href = response.payUrl;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Thanh toán MoMo không thành công.';
      setLocalError(message);
      onError?.(message);
    } finally {
      setIsProcessing(false);
      onProcessingChange?.(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handlePayment}
        disabled={isProcessing}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#a50064] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#c00074] focus-visible:bg-[#c00074] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isProcessing ? 'Đang chuyển đến MoMo…' : 'Thanh toán qua MoMo'}
      </button>
      <p className="text-xs text-gray-500">
        Bạn sẽ được chuyển đến cổng thanh toán MoMo để hoàn tất giao dịch cho tour{' '}
        <span className="font-semibold text-gray-700">{tourName}</span> với số tiền{' '}
        <span className="font-semibold text-gray-700">{formatCurrency(amount)}</span>.
      </p>
      {localError && (
        <div className="rounded-lg border border-danger/20 bg-danger/10 p-3 text-xs text-danger">
          {localError}
        </div>
      )}


    </div>
  );
};

export default MoMoPaymentButton;
