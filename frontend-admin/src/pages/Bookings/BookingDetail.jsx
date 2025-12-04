import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import BookingTimeline from '../../components/bookings/BookingTimeline.jsx';
import StatusPill from '../../components/common/StatusPill.jsx';
import { bookingsAPI, departuresAPI, usersAPI } from '../../services/api.js';
import { formatCurrency, formatDate } from '../../utils/format.js';

const buildTimelineForStatus = (status, bookingDate) => {
  const now = new Date().toISOString();
  const baseTimestamp = bookingDate || now;

  const timeline = [
    {
      label: 'Đặt chỗ được tạo',
      status: 'completed',
      timestamp: baseTimestamp,
      description: 'Khách hàng đã gửi yêu cầu đặt tour.',
    },
    {
      label: 'Giữ chỗ',
      status: status === 'PENDING' ? 'pending' : 'confirmed',
      timestamp: baseTimestamp,
      description: 'Tour-service giữ chỗ qua RabbitMQ.',
    },
    {
      label: 'Xử lý thanh toán',
      status: status === 'CONFIRMED' || status === 'COMPLETED' ? 'confirmed' : status === 'CANCELLED' ? 'cancelled' : 'pending',
      timestamp: baseTimestamp,
      description: 'Payment-service xác nhận thanh toán.',
    },
  ];

  if (status === 'COMPLETED') {
    timeline.push({
      label: 'Chuyến đi hoàn tất',
      status: 'completed',
      timestamp: baseTimestamp,
      description: 'Chuyến đi đã hoàn tất.',
    });
  }

  if (status === 'CANCELLED') {
    timeline.push({
      label: 'Đặt chỗ bị hủy',
      status: 'cancelled',
      timestamp: baseTimestamp,
      description: 'Đặt chỗ bị hủy, ghế đã được trả về inventory.',
    });
  }

  return timeline;
};

const BookingDetail = () => {
  const { bookingId } = useParams();
  const numericId = useMemo(() => (bookingId ? Number(bookingId) : null), [bookingId]);
  const [booking, setBooking] = useState(null);
  const [user, setUser] = useState(null);
  const [departure, setDeparture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!numericId) {
      setError('ID đặt chỗ không hợp lệ.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const bookingData = await bookingsAPI.getById(numericId);
        setBooking(bookingData);

        if (bookingData?.userId) {
          try {
            const userData = await usersAPI.getById(bookingData.userId);
            setUser(userData);
          } catch (err) {
            console.warn('Không thể tải thông tin người dùng', err);
          }
        }

        if (bookingData?.departureId) {
          try {
            const allDepartures = await departuresAPI.getAll();
            const matched = allDepartures.find((dep) => dep.departureId === bookingData.departureId || dep.id === bookingData.departureId);
            setDeparture(matched ?? null);
          } catch (err) {
            console.warn('Không thể tải thông tin lịch khởi hành', err);
          }
        }
      } catch (err) {
        console.error('Failed to fetch booking', err);
        setError('Không thể tải thông tin đặt chỗ.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [numericId]);

  const handleConfirmBooking = async () => {
    if (!numericId) return;
    if (!window.confirm('Bạn có chắc muốn xác nhận đặt chỗ này? Email xác nhận sẽ được gửi đến khách hàng.')) {
      return;
    }

    try {
      setConfirming(true);
      console.log('[BookingDetail] Confirming booking:', numericId);
      await bookingsAPI.confirm(numericId);
      console.log('[BookingDetail] Booking confirmed successfully');
      alert('Đã xác nhận đặt chỗ thành công! Email đã được gửi đến khách hàng.');
      // Refresh booking data
      const bookingData = await bookingsAPI.getById(numericId);
      setBooking(bookingData);
    } catch (err) {
      console.error('[BookingDetail] Failed to confirm booking:', err);
      alert('Lỗi khi xác nhận đặt chỗ: ' + (err.message || 'Unknown error'));
    } finally {
      setConfirming(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!numericId) return;

    const isConfirmed = booking?.status === 'CONFIRMED';
    const confirmMessage = isConfirmed
      ? 'Đặt chỗ này đã được xác nhận. Bạn có chắc muốn hủy? Khách hàng sẽ cần được hoàn tiền. Hành động này không thể hoàn tác.'
      : 'Bạn có chắc muốn hủy đặt chỗ này? Hành động này không thể hoàn tác.';

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setCancelling(true);
      console.log('[BookingDetail] Cancelling booking:', numericId);
      await bookingsAPI.cancel(numericId);
      console.log('[BookingDetail] Booking cancelled successfully');
      alert('Đã hủy đặt chỗ thành công!');
      // Refresh booking data
      const bookingData = await bookingsAPI.getById(numericId);
      setBooking(bookingData);
    } catch (err) {
      console.error('[BookingDetail] Failed to cancel booking:', err);
      alert('Lỗi khi hủy đặt chỗ: ' + (err.message || 'Unknown error'));
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <Card className="py-12 text-center text-sm text-slate-500">Đang tải thông tin đặt chỗ...</Card>;
  }

  if (error) {
    return <Card className="py-12 text-center text-sm text-danger">{error}</Card>;
  }

  if (!booking) {
    return <Card className="text-sm text-slate-500">Không tìm thấy đặt chỗ.</Card>;
  }

  const tourName = departure?.tourName ?? `Booking #${booking.id}`;
  const bookingDateLabel = booking.bookingDate ? formatDate(booking.bookingDate) : 'Chưa cập nhật';
  const totalAmount = booking.totalAmount ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Chi tiết đặt chỗ</p>
          <h1 className="text-2xl font-semibold text-slate-900">{tourName}</h1>
          <p className="text-sm text-slate-500">ID {booking.id}</p>
          {departure && (
            <p className="text-xs text-slate-500">
              Khởi hành: {formatDate(departure.startDate)} → {formatDate(departure.endDate)} · {departure.remainingSlots}/{departure.totalSlots} chỗ
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={booking.status} />
          {booking.status === 'PENDING' && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmBooking}
              disabled={confirming}
            >
              {confirming ? 'Đang xác nhận...' : 'Xác nhận đặt chỗ'}
            </Button>
          )}
          {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleCancelBooking}
              disabled={cancelling}
            >
              {cancelling ? 'Đang hủy...' : 'Hủy đặt chỗ'}
            </Button>
          )}
        </div>
      </div>

      <Card className="space-y-5">
        <h3 className="text-lg font-semibold text-slate-900">Thông tin khách hàng</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1 text-sm text-slate-600">
            <p className="text-xs uppercase tracking-widest text-slate-400">Khách hàng chính</p>
            <p className="font-medium text-slate-800">{user?.fullName || user?.username || 'Chưa cập nhật'}</p>
          </div>
          <div className="space-y-1 text-sm text-slate-600">
            <p className="text-xs uppercase tracking-widest text-slate-400">Mã người dùng</p>
            <p className="font-medium text-slate-800">{booking.userId}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Mail className="h-4 w-4" />
            {user?.email || 'Chưa có email'}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Phone className="h-4 w-4" />
            {user?.phoneNumber || 'Chưa cập nhật'}
          </div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="text-xs uppercase tracking-widest text-slate-400">Ghi chú</p>
          <p>{booking.seats} khách · Trạng thái hiện tại: {booking.status}</p>
          <p className="mt-2 font-semibold text-slate-900">Tổng tiền: {formatCurrency(totalAmount)}</p>
        </div>
      </Card>

      <BookingTimeline
        events={buildTimelineForStatus(booking.status, booking.createdAt || booking.bookingDate)}
      />
    </div>
  );
};

export default BookingDetail;
