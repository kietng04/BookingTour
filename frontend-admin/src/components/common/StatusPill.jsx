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
  full: 'bg-warning/10 text-warning',
  end: 'bg-slate-200 text-slate-500'
};

const prettifyStatus = (value) => value
  .replace(/[_\-]/g, ' ')
  .toLowerCase()
  .replace(/^(\w)|\s(\w)/g, (m) => m.toUpperCase());

const StatusPill = ({ status }) => {
  const normalized = (status || '').toString().toLowerCase();
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', STATUS_COLORS[normalized] || STATUS_COLORS.draft)}>
      {prettifyStatus((status || '').toString())}
    </span>
  );
};

StatusPill.propTypes = {
  status: PropTypes.string.isRequired
};

export default StatusPill;
