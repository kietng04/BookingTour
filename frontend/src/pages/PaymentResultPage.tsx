import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Clock3 } from 'lucide-react';
import { getPaymentStatus, PaymentDetailsResponse } from '../services/paymentService';
import { bookingsAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/format';

const PAYMENT_SESSION_KEY = 'bookingTour:lastPayment';
const PAYMENT_REOPEN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

type ResultState = 'success' | 'pending' | 'failed';

const PaymentResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ResultState>('pending');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetailsResponse | null>(null);
  const [bookingDetails, setBookingDetails] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [canReopenPayment, setCanReopenPayment] = useState(false);
  const [reopenMessage, setReopenMessage] = useState<string | null>(null);

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);

  useEffect(() => {
    const orderIdParam = query.get('orderId') || query.get('orderID');
  const resultCodeParam = query.get('resultCode');

    let sessionCreatedAtMs: number | null = null;
    const sessionRaw = sessionStorage.getItem(PAYMENT_SESSION_KEY);
    if (sessionRaw) {
      try {
        const parsed = JSON.parse(sessionRaw);
        if (parsed?.createdAt) {
          const parsedCreatedAt = Date.parse(parsed.createdAt);
          if (!Number.isNaN(parsedCreatedAt)) {
            sessionCreatedAtMs = parsedCreatedAt;
          }
        }
      } catch {
      }
    }

    const parseBookingId = (): number | null => {
      if (orderIdParam) {
        const match = orderIdParam.match(/^BT-(\d+)-/);
        if (match && match[1]) {
          return Number(match[1]);
        }
      }

      if (sessionRaw) {
        try {
          const parsed = JSON.parse(sessionRaw);
          if (parsed?.bookingId) {
            return Number(parsed.bookingId);
          }
        } catch {
        }
      }
      return null;
    };

    const bookingId = parseBookingId();

    if (!bookingId) {
      setError('Không tìm thấy mã đặt chỗ để kiểm tra thanh toán.');
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const payment = await getPaymentStatus(bookingId);
        setPaymentDetails(payment);

        let derivedStatus: ResultState = 'pending';
        if (payment.status?.toUpperCase() === 'COMPLETED') {
          derivedStatus = 'success';
        } else if (payment.status?.toUpperCase() === 'FAILED') {
          derivedStatus = 'failed';
        } else {
          const resultCode = Number(resultCodeParam);
          if (!Number.isNaN(resultCode)) {
            if (resultCode === 0) {
              derivedStatus = 'success';
            } else if (resultCode < 0) {
              derivedStatus = 'failed';
            }
          }
        }
        setStatus(derivedStatus);

        const paymentCreatedAtMs = payment?.createdAt ? Date.parse(payment.createdAt) : null;
        const referenceTimestamp = !Number.isNaN(paymentCreatedAtMs ?? NaN)
          ? paymentCreatedAtMs
          : sessionCreatedAtMs;

        if (derivedStatus === 'success') {
          setCanReopenPayment(false);
          setReopenMessage('Thanh toán đã hoàn tất. Liên kết MoMo không còn khả dụng.');
          
          setTimeout(() => {
            navigate('/booking-history', { replace: true });
          }, 3000);
        } else if (referenceTimestamp != null && !Number.isNaN(referenceTimestamp)) {
          const expiresAt = referenceTimestamp + PAYMENT_REOPEN_WINDOW_MS;
          if (Date.now() <= expiresAt) {
            setCanReopenPayment(true);
            setReopenMessage(null);
          } else {
            setCanReopenPayment(false);
            setReopenMessage('Liên kết thanh toán đã hết hạn sau 15 phút. Vui lòng tạo lại yêu cầu thanh toán để tiếp tục.');
          }
        } else {
          setCanReopenPayment(true);
          setReopenMessage(null);
        }

        try {
          const booking = await bookingsAPI.getById(bookingId);
          setBookingDetails(booking);
        } catch (bookingError) {
          console.warn('Không thể tải thông tin đặt chỗ:', bookingError);
        }
      } catch (err) {
        console.error('Không thể kiểm tra thanh toán MoMo', err);
        setError(
          err instanceof Error ? err.message : 'Không thể kiểm tra trạng thái thanh toán. Vui lòng liên hệ hỗ trợ.',
        );
      } finally {
        sessionStorage.removeItem(PAYMENT_SESSION_KEY);
        setLoading(false);
      }
    };

    fetchStatus();
  }, [query]);

  const statusContent = useMemo(() => {
    switch (status) {
      case 'success':
        return {
          title: 'Thanh toán thành công',
          description: 'Chúng tôi đã nhận được thanh toán MoMo của bạn. Đặt chỗ đang được xác nhận. Bạn sẽ được tự động chuyển đến trang lịch sử đặt tour trong 3 giây...',
          className: 'bg-green-50 text-green-700 border-green-100',
          Icon: CheckCircle2,
        };
      case 'failed':
        return {
          title: 'Thanh toán thất bại',
          description:
            'Thanh toán chưa hoàn tất. Vui lòng thử lại hoặc liên hệ với đội ngũ hỗ trợ để được giúp đỡ.',
          className: 'bg-danger/10 text-danger border-danger/20',
          Icon: AlertTriangle,
        };
      default:
        return {
          title: 'Thanh toán đang xử lý',
          description: 'Chúng tôi đang chờ xác nhận cuối cùng từ MoMo. Bạn có thể làm mới sau ít phút.',
          className: 'bg-amber-50 text-amber-700 border-amber-200',
          Icon: Clock3,
        };
    }
  }, [status]);

  const amountDisplay =
    bookingDetails?.totalAmount != null ? formatCurrency(Number(bookingDetails.totalAmount)) : null;

  return (
    <main id="main-content" className="bg-gray-25 py-16">
      <div className="container max-w-3xl space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Kết quả thanh toán</h1>
          <p className="mt-2 text-sm text-gray-600">
            Trang này hiển thị trạng thái mới nhất cho giao dịch MoMo của bạn và tình trạng đặt chỗ.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-card">
            <p className="text-sm text-gray-600">Đang kiểm tra giao dịch của bạn...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-danger/20 bg-danger/10 p-8 shadow-card text-danger">
            <p className="text-base font-semibold">Không thể xác định trạng thái thanh toán</p>
            <p className="mt-2 text-sm">{error}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600 focus-visible:bg-brand-600"
              >
                Quay về trang chủ
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-300 hover:text-gray-900 focus-visible:border-brand-300"
              >
                Thử lại
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <section className={`rounded-3xl border ${statusContent.className} p-6 shadow-card`}>
              <statusContent.Icon className="h-8 w-8" aria-hidden="true" />
              <h2 className="mt-3 text-2xl font-semibold">{statusContent.title}</h2>
              <p className="mt-2 text-sm">{statusContent.description}</p>
            </section>

            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Chi tiết giao dịch</h3>
              <dl className="grid gap-4 text-sm text-gray-600 sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-gray-500 uppercase tracking-widest text-xs">Mã đặt chỗ</dt>
                  <dd className="mt-1 text-gray-900">
                    {paymentDetails?.bookingId ?? bookingDetails?.id ?? 'Không xác định'}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-500 uppercase tracking-widest text-xs">Phương thức</dt>
                  <dd className="mt-1 text-gray-900">
                    {paymentDetails?.paymentMethod ? paymentDetails.paymentMethod : 'MoMo E-Wallet'}
                  </dd>
                </div>
                {amountDisplay && (
                  <div>
                    <dt className="font-semibold text-gray-500 uppercase tracking-widest text-xs">Số tiền</dt>
                    <dd className="mt-1 text-gray-900">{amountDisplay}</dd>
                  </div>
                )}
                {bookingDetails?.bookingDate && (
                  <div>
                    <dt className="font-semibold text-gray-500 uppercase tracking-widest text-xs">Thời gian đặt</dt>
                    <dd className="mt-1 text-gray-900">{formatDate(bookingDetails.bookingDate)}</dd>
                  </div>
                )}
                {paymentDetails?.message && (
                  <div className="sm:col-span-2">
                    <dt className="font-semibold text-gray-500 uppercase tracking-widest text-xs">Ghi chú</dt>
                    <dd className="mt-1 text-gray-900">{paymentDetails.message}</dd>
                  </div>
                )}
              </dl>
              {paymentDetails?.payUrl && canReopenPayment && (
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={paymentDetails.payUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full bg-[#a50064] px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-[#c00074] focus-visible:bg-[#c00074]"
                  >
                    Mở lại trang MoMo
                  </a>
                  {paymentDetails.deeplink && (
                    <a
                      href={paymentDetails.deeplink}
                      className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-300 hover:text-gray-900 focus-visible:border-brand-300"
                    >
                      Mở trên ứng dụng
                    </a>
                  )}
                </div>
              )}
              {reopenMessage && (
                <p className="text-xs text-gray-500">{reopenMessage}</p>
              )}
            </section>

            {paymentDetails?.qrCodeUrl && status !== 'success' && canReopenPayment && (
              <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card space-y-3 text-center">
                <h3 className="text-lg font-semibold text-gray-900">Quét lại mã QR</h3>
                <p className="text-sm text-gray-600">
                  Nếu bạn chưa hoàn tất thanh toán, hãy quét lại mã QR dưới đây bằng ứng dụng MoMo.
                </p>
                <div className="mx-auto inline-block rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <img
                    src={paymentDetails.qrCodeUrl}
                    alt="MoMo QR code"
                    className="h-56 w-56 rounded-xl border border-white bg-white object-contain p-3 shadow-lg"
                  />
                </div>
              </section>
            )}

            {bookingDetails && (
              <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card space-y-3 text-sm text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900">Tình trạng đặt chỗ</h3>
                <p>
                  Trạng thái hiện tại: <span className="font-semibold text-gray-900">{bookingDetails.status}</span>
                </p>
                {bookingDetails.tourName && (
                  <p>
                    Tour: <span className="font-semibold text-gray-900">{bookingDetails.tourName}</span>
                  </p>
                )}
              </section>
            )}

            <div className="flex flex-wrap gap-3">
              {status === 'success' && (
                <button
                  type="button"
                  onClick={() => navigate('/booking-history', { replace: true })}
                  className="inline-flex items-center rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600 focus-visible:bg-brand-600"
                >
                  Xem lịch sử đặt tour
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate('/')}
                className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg transition ${
                  status === 'success' 
                    ? 'border border-gray-200 text-gray-700 hover:border-brand-300 hover:text-gray-900 focus-visible:border-brand-300'
                    : 'bg-brand-500 text-white hover:bg-brand-600 focus-visible:bg-brand-600'
                }`}
              >
                Về trang chủ
              </button>
              <button
                type="button"
                onClick={() => navigate('/support')}
                className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-300 hover:text-gray-900 focus-visible:border-brand-300"
              >
                Liên hệ hỗ trợ
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default PaymentResultPage;
