import BookingTable from '../../components/bookings/BookingTable.jsx';
import Card from '../../components/common/Card.jsx';
import { adminBookings } from '../../data/bookings.js';

const BookingList = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Bookings</h1>
      <p className="text-sm text-slate-500">Track lifecycle states: pending → confirmed → completed. Aligns with backend `/admin/bookings` response.</p>
    </div>

    <BookingTable bookings={adminBookings} />

    <Card className="space-y-3 bg-slate-900 text-slate-100">
      <h3 className="text-lg font-semibold">Operations checklist</h3>
      <ul className="space-y-2 text-sm text-slate-200">
        <li>• Confirm inventory with supplier and mark booking as `confirmed`.</li>
        <li>• Collect payment via secure invoice or on-platform gateway.</li>
        <li>• Trigger pre-trip email sequence at T-48 hours.</li>
      </ul>
    </Card>
  </div>
);

export default BookingList;
