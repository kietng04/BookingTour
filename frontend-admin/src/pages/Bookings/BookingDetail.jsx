import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Mail, Phone } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import BookingTimeline from '../../components/bookings/BookingTimeline.jsx';
import StatusPill from '../../components/common/StatusPill.jsx';
import { bookingsAPI, departuresAPI, usersAPI } from '../../services/api.js';
import { formatCurrency, formatDate } from '../../utils/format.js';

const buildTimelineForStatus = (status) => {
  const timeline = [
    {
      label: 'Booking created',
      status: 'completed',
      description: 'Khách hàng đã gửi yêu cầu đặt tour.',
    },
    {
      label: 'Seat reservation',
      status: status === 'PENDING' ? 'pending' : 'confirmed',
      description: 'Tour-service giữ chỗ qua RabbitMQ.',
    },
    {
      label: 'Payment processing',
      status: status === 'CONFIRMED' || status === 'COMPLETED' ? 'confirmed' : status === 'CANCELLED' ? 'cancelled' : 'pending',
      description: 'Payment-service xác nhận thanh toán.',
    },
  ];

  if (status === 'COMPLETED') {
    timeline.push({
      label: 'Trip completed',
      status: 'completed',
      description: 'Chuyến đi đã hoàn tất.',
    });
  }

  if (status === 'CANCELLED') {
    timeline.push({
      label: 'Booking cancelled',
      status: 'cancelled',
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
  const depositAmount = totalAmount * 0.2;
  const balanceAmount = totalAmount - depositAmount;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Booking detail</p>
          <h1 className="text-2xl font-semibold text-slate-900">{tourName}</h1>
          <p className="text-sm text-slate-500">ID {booking.id} · {bookingDateLabel}</p>
          {departure && (
            <p className="text-xs text-slate-500">
              Khởi hành: {formatDate(departure.startDate)} → {formatDate(departure.endDate)} · {departure.remainingSlots}/{departure.totalSlots} chỗ
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={booking.status} />
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4" />
            Export itinerary
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-5">
          <h3 className="text-lg font-semibold text-slate-900">Guest profile</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1 text-sm text-slate-600">
              <p className="text-xs uppercase tracking-widest text-slate-400">Primary guest</p>
              <p className="font-medium text-slate-800">{user?.fullName || user?.username || 'Chưa cập nhật'}</p>
            </div>
            <div className="space-y-1 text-sm text-slate-600">
              <p className="text-xs uppercase tracking-widest text-slate-400">User ID</p>
              <p className="font-medium text-slate-800">{booking.userId}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Mail className="h-4 w-4" />
              {user?.email || 'Chưa có email'}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Phone className="h-4 w-4" />
              {user?.phoneNumber || 'Chưa cập nhật' }
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="text-xs uppercase tracking-widest text-slate-400">Notes</p>
            <p>{booking.seats} khách · Trạng thái hiện tại: {booking.status}</p>
          </div>
        </Card>

        <Card className="space-y-4 bg-slate-900 text-slate-100">
          <h3 className="text-lg font-semibold text-white">Financial summary</h3>
          <div className="flex items-center justify-between text-sm">
            <span>Total amount</span>
            <span className="text-lg font-semibold text-white">{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Deposit (20%)</span>
            <span>{formatCurrency(depositAmount)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Balance</span>
            <span>{formatCurrency(balanceAmount)}</span>
          </div>
          <Button variant="secondary" className="w-full text-slate-900">
            Generate invoice
          </Button>
        </Card>
      </div>

      <BookingTimeline
        events={buildTimelineForStatus(booking.status)}
      />
    </div>
  );
};

export default BookingDetail;
