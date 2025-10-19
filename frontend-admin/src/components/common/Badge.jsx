import PropTypes from 'prop-types';
import clsx from 'clsx';

const variants = {
  neutral: 'bg-slate-100 text-slate-600',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  primary: 'bg-primary-100 text-primary-600'
};

const Badge = ({ children, variant = 'neutral', className }) => (
  <span className={clsx('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', variants[variant], className)}>
    {children}
  </span>
);

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['neutral', 'success', 'warning', 'danger', 'primary']),
  className: PropTypes.string
};

export default Badge;
