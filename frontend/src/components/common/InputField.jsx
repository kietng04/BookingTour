import PropTypes from 'prop-types';
import clsx from 'clsx';

const InputField = ({
  label,
  description,
  error,
  className,
  icon: Icon,
  ...props
}) => (
  <label className={clsx('flex flex-col gap-2 text-sm text-slate-600', className)}>
    {label && <span className="font-medium text-slate-700">{label}</span>}
    <div className={clsx(
      'flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition focus-within:border-primary-300 focus-within:ring-4 focus-within:ring-primary-100',
      error && 'border-danger ring-danger/10'
    )}>
      {Icon && <Icon className="h-5 w-5 text-slate-400" />}
      <input
        className="w-full border-none bg-transparent text-slate-700 placeholder:text-slate-400 focus:outline-none"
        {...props}
      />
    </div>
    {description && !error && <span className="text-xs text-slate-400">{description}</span>}
    {error && <span className="text-xs font-medium text-danger">{error}</span>}
  </label>
);

InputField.propTypes = {
  label: PropTypes.string,
  description: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.elementType
};

export default InputField;
