import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(({ label, hint, error, className, ...props }, ref) => (
  <label className={clsx('flex flex-col gap-2 text-sm text-slate-600', className)}>
    {label && <span className="font-medium text-slate-700">{label}</span>}
    <input
      ref={ref}
      className={clsx(
        'h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm transition focus:border-primary-300 focus:ring-4 focus:ring-primary-100',
        error && 'border-danger focus:ring-danger/20'
      )}
      {...props}
    />
    {hint && !error && <span className="text-xs text-slate-400">{hint}</span>}
    {error && <span className="text-xs font-medium text-danger">{error}</span>}
  </label>
));

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string
};

export default Input;
