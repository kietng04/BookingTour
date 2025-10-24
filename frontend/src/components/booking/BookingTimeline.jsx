import PropTypes from 'prop-types';
import Card from '../common/Card.jsx';
import { formatDate } from '../../utils/format.js';

const BookingTimeline = ({ steps }) => (
  <Card className="space-y-6">
    <div>
      <p className="text-xs uppercase tracking-widest text-primary-500">Quy trình xử lý</p>
      <h3 className="mt-1 text-lg font-semibold text-slate-900">Luồng đặt tour cùng concierge</h3>
      <p className="text-sm text-slate-500">Phản ánh chính xác trạng thái backend (pending → confirmed → finalized → checked-in → completed).</p>
    </div>

    <ol className="space-y-5">
      {steps.map((step, index) => (
        <li key={step.label} className="flex gap-4">
          <div className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${step.completed ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-slate-200 text-slate-400'}`}>
            {index + 1}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{step.label}</p>
            <p className="text-xs text-slate-500">{step.description}</p>
            {step.timestamp && (
              <p className="mt-1 text-xs text-primary-500">Cập nhật {formatDate(step.timestamp)}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  </Card>
);

BookingTimeline.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    timestamp: PropTypes.string,
    completed: PropTypes.bool
  })).isRequired
};

export default BookingTimeline;
