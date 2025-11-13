import PropTypes from 'prop-types';
import clsx from 'clsx';

const STATUS_COLORS = {
  draft: 'bg-slate-100 text-slate-600',
  live: 'bg-success/10 text-success',
  archived: 'bg-slate-200 text-slate-500',
  pending: 'bg-warning/10 text-warning',
  confirmed: 'bg-success/10 text-success',
  completed: 'bg-primary-100 text-primary-600',
  cancelled: 'bg-danger/10 text-danger',
  active: 'bg-success/10 text-success',
  unactive: 'bg-slate-200 text-slate-600',
  full: 'bg-red-100 text-red-700',
  end: 'bg-slate-200 text-slate-500',
  // Departure statuses
  concho: 'bg-green-100 text-green-700',
  sapfull: 'bg-yellow-100 text-yellow-700',
  dakhoihanh: 'bg-gray-200 text-gray-600'
};

const STATUS_LABELS = {
  concho: 'Available',
  sapfull: 'Almost Full',
  full: 'Full',
  dakhoihanh: 'Departed',
  active: 'Active',
  unactive: 'Inactive',
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed'
};

const STATUS_DESCRIPTIONS = {
  concho: 'Departure is available for booking',
  sapfull: 'Departure is almost fully booked',
  full: 'Departure is fully booked',
  dakhoihanh: 'Departure has already started',
  active: 'Currently active',
  unactive: 'Currently inactive',
  pending: 'Awaiting confirmation',
  confirmed: 'Confirmed and active',
  cancelled: 'Cancelled',
  completed: 'Successfully completed'
};

const prettifyStatus = (value) => value
  .replace(/[_\-]/g, ' ')
  .toLowerCase()
  .replace(/^(\w)|\s(\w)/g, (m) => m.toUpperCase());

const StatusPill = ({ status }) => {
  const normalized = (status || '').toString().toLowerCase();
  const label = STATUS_LABELS[normalized] || prettifyStatus((status || '').toString());
  const description = STATUS_DESCRIPTIONS[normalized];

  return (
    <span
      className={clsx('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', STATUS_COLORS[normalized] || STATUS_COLORS.draft)}
      title={description}
    >
      {label}
    </span>
  );
};

StatusPill.propTypes = {
  status: PropTypes.string.isRequired
};

export default StatusPill;
