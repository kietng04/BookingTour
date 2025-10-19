import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Card from '../common/Card.jsx';
import StatusPill from '../common/StatusPill.jsx';
import { formatCurrency, formatDate } from '../../utils/format.js';

const RecentBookings = ({ bookings }) => (
  <Card className="space-y-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400">Recent bookings</p>
        <h3 className="text-lg font-semibold text-slate-900">Latest concierge activity</h3>
      </div>
      <Link to="/bookings" className="text-xs font-semibold text-primary-600">View all</Link>
    </div>

    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          <div>
            <p className="font-semibold text-slate-800">{booking.tourName}</p>
            <p className="text-xs text-slate-400">{booking.guestName} · {formatDate(booking.travelDate)}</p>
          </div>
          <div className="flex items-center gap-4">
            <StatusPill status={booking.status} />
            <span className="font-semibold text-primary-600">{formatCurrency(booking.amount)}</span>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

RecentBookings.propTypes = {
  bookings: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    tourName: PropTypes.string.isRequired,
    guestName: PropTypes.string.isRequired,
    travelDate: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired
  })).isRequired
};

export default RecentBookings;
