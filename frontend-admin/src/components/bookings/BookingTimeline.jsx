import PropTypes from 'prop-types';
import Card from '../common/Card.jsx';
import StatusPill from '../common/StatusPill.jsx';
import { formatDate } from '../../utils/format.js';

const BookingTimeline = ({ events }) => (
  <Card className="space-y-5">
    <div>
      <p className="text-xs uppercase tracking-widest text-slate-400">Timeline</p>
      <h3 className="text-lg font-semibold text-slate-900">Operational updates</h3>
    </div>
    <ol className="space-y-4">
      {events.map((event) => (
        <li key={event.label} className="flex gap-4">
          <div className="mt-1 h-3 w-3 rounded-full border-4 border-primary-100 bg-primary-500" />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-slate-800">{event.label}</p>
              <StatusPill status={event.status} />
            </div>
            <p className="text-xs text-slate-400">{formatDate(event.timestamp)}</p>
            <p className="mt-2 text-sm text-slate-600">{event.description}</p>
          </div>
        </li>
      ))}
    </ol>
  </Card>
);

BookingTimeline.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  })).isRequired
};

export default BookingTimeline;
