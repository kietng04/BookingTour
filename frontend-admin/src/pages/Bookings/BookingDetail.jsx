import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Mail, Phone } from 'lucide-react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import BookingTimeline from '../../components/bookings/BookingTimeline.jsx';
import StatusPill from '../../components/common/StatusPill.jsx';
import { adminBookings } from '../../data/bookings.js';
import { formatCurrency, formatDate } from '../../utils/format.js';

const BookingDetail = () => {
  const { bookingId } = useParams();
  const booking = useMemo(() => adminBookings.find((item) => item.id === bookingId), [bookingId]);

  if (!booking) {
    return (
      <Card className="text-sm text-slate-500">Booking not found.</Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Booking detail</p>
          <h1 className="text-2xl font-semibold text-slate-900">{booking.tourName}</h1>
          <p className="text-sm text-slate-500">ID {booking.id} · {formatDate(booking.travelDate)}</p>
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
              <p className="font-medium text-slate-800">{booking.guestName}</p>
            </div>
            <div className="space-y-1 text-sm text-slate-600">
              <p className="text-xs uppercase tracking-widest text-slate-400">Concierge</p>
              <p className="font-medium text-slate-800">{booking.assignedTo}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Mail className="h-4 w-4" />
              guest@email.com
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Phone className="h-4 w-4" />
              +1 234 567 8900
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="text-xs uppercase tracking-widest text-slate-400">Notes</p>
            <p>VIP traveler. Loves private dining, photography sessions, and spa experiences. Prefers WhatsApp updates.</p>
          </div>
        </Card>

        <Card className="space-y-4 bg-slate-900 text-slate-100">
          <h3 className="text-lg font-semibold text-white">Financial summary</h3>
          <div className="flex items-center justify-between text-sm">
            <span>Total amount</span>
            <span className="text-lg font-semibold text-white">{formatCurrency(booking.amount)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Deposit paid</span>
            <span>{formatCurrency(booking.amount * 0.2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Balance due</span>
            <span>{formatCurrency(booking.amount * 0.8)}</span>
          </div>
          <Button variant="secondary" className="w-full text-slate-900">
            Generate invoice
          </Button>
        </Card>
      </div>

      <BookingTimeline
        events={[
          {
            label: 'Booking requested',
            status: 'completed',
            timestamp: '2024-01-28',
            description: 'Customer submitted booking via customer portal. Autoresponder sent immediately.'
          },
          {
            label: 'Supplier confirmation',
            status: 'confirmed',
            timestamp: '2024-01-29',
            description: 'Partner held inventory for requested departure. Pending payment to lock in.'
          },
          {
            label: 'Payment collection',
            status: 'pending',
            timestamp: '2024-01-30',
            description: 'Send payment link after verifying traveler documents. Reminder scheduled at T-48 hours.'
          }
        ]}
      />
    </div>
  );
};

export default BookingDetail;
