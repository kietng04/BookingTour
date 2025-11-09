import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import clsx from 'clsx';

const Select = forwardRef(({ label, options = [], className, error, children, ...props }, ref) => (
  <label className={clsx('flex flex-col gap-2 text-sm text-slate-600', className)}>
    {label && <span className="font-medium text-slate-700">{label}</span>}
    <select
      ref={ref}
      className={clsx(
        'h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm transition focus:border-primary-300 focus:ring-4 focus:ring-primary-100',
        error && 'border-danger focus:ring-danger/20'
      )}
      {...props}
    >
      {children && children}
      {!children && options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <span className="text-xs font-medium text-danger">{error}</span>}
  </label>
));

Select.displayName = 'Select';

Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired
  })),
  className: PropTypes.string,
  error: PropTypes.string,
  children: PropTypes.node
};

export default Select;
