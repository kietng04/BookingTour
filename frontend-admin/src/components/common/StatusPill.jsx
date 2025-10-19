import PropTypes from 'prop-types';
import clsx from 'clsx';

const STATUS_COLORS = {
  draft: 'bg-slate-100 text-slate-600',
  live: 'bg-success/10 text-success',
  archived: 'bg-slate-200 text-slate-500',
  pending: 'bg-warning/10 text-warning',
  confirmed: 'bg-success/10 text-success',
  completed: 'bg-primary-100 text-primary-600',
  cancelled: 'bg-danger/10 text-danger'
};

const StatusPill = ({ status }) => (
  <span className={clsx('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize', STATUS_COLORS[status] || STATUS_COLORS.draft)}>
    {status.replace('-', ' ')}
  </span>
);

StatusPill.propTypes = {
  status: PropTypes.string.isRequired
};

export default StatusPill;
