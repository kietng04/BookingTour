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
  const [activePayment, setActivePayment] = useState<ActivePaymentSession | null>(null);

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

      setActivePayment({
        bookingId: booking.bookingId,
        orderId: response.orderId,
        payUrl: response.payUrl,
        qrCodeUrl: response.qrCodeUrl,
        deeplink: response.deeplink,
        message: response.message,
        amount,
        createdAt: new Date().toISOString(),
      });

      // Mở thêm tab MoMo (nếu trình duyệt cho phép) để người dùng có thể tiếp tục thanh toán.
      window.open(response.payUrl, '_blank', 'noopener');
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

      {activePayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setActivePayment(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="space-y-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">Quét QR để thanh toán MoMo</h3>
              <p className="text-sm text-gray-600">
                Sử dụng ứng dụng MoMo trên điện thoại để quét mã hoặc chọn &quot;Mở MoMo&quot; để chuyển sang trang
                thanh toán.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                {activePayment.qrCodeUrl ? (
                  <img
                    src={activePayment.qrCodeUrl}
                    alt="Mã QR MoMo"
                    className="h-56 w-56 rounded-xl border border-white bg-white object-contain p-3 shadow-lg"
                  />
                ) : (
                  <div className="h-56 w-56 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500">
                    Không nhận được mã QR từ MoMo. Vui lòng bấm &quot;Mở MoMo&quot; để tiếp tục trên trang thanh toán.
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  Số tiền: <span className="font-semibold text-gray-900">{formatCurrency(activePayment.amount)}</span>
                </div>
              </div>
              {activePayment.message && (
                <p className="text-xs text-gray-500">Thông điệp từ MoMo: {activePayment.message}</p>
              )}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.open(activePayment.payUrl, '_blank', 'noopener')}
                  className="inline-flex items-center rounded-full bg-[#a50064] px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-[#c00074] focus-visible:bg-[#c00074]"
                >
                  Mở MoMo
                </button>
                {activePayment.deeplink && (
                  <a
                    href={activePayment.deeplink}
                    className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-300 hover:text-gray-900 focus-visible:border-brand-300"
                  >
                    Mở bằng ứng dụng
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setActivePayment(null)}
                  className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-300 hover:text-gray-900 focus-visible:border-brand-300"
                >
                  Đóng
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Sau khi thanh toán thành công, hệ thống sẽ tự động cập nhật trạng thái đặt chỗ. Bạn có thể kiểm tra tại
                trang &quot;Kết quả thanh toán&quot; sau vài phút.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoMoPaymentButton;
