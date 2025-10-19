import PropTypes from 'prop-types';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

const SelectField = ({ label, options, className, error, ...props }) => (
  <label className={clsx('flex flex-col gap-2 text-sm text-slate-600', className)}>
    {label && <span className="font-medium text-slate-700">{label}</span>}
    <div className={clsx(
      'relative flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 transition focus-within:border-primary-300 focus-within:ring-4 focus-within:ring-primary-100',
      error && 'border-danger ring-danger/10'
    )}>
      <select
        className="w-full appearance-none border-none bg-transparent pr-6 text-slate-700 focus:outline-none"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none h-4 w-4 text-slate-400" />
    </div>
    {error && <span className="text-xs font-medium text-danger">{error}</span>}
  </label>
);

SelectField.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  className: PropTypes.string,
  error: PropTypes.string
};

export default SelectField;
