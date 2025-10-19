import PropTypes from 'prop-types';
import clsx from 'clsx';

const variants = {
  highlight: 'bg-primary-50 text-primary-600 border-primary-100',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  outline: 'bg-white text-slate-600 border-slate-200'
};

const Badge = ({ children, variant = 'highlight', className }) => (
  <span className={clsx(
    'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide',
    variants[variant],
    className
  )}>
    {children}
  </span>
);

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['highlight', 'success', 'warning', 'outline']),
  className: PropTypes.string
};

export default Badge;
