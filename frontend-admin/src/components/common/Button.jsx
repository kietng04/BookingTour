import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:pointer-events-none disabled:opacity-60';

const variants = {
  primary: 'bg-primary-600 text-white shadow focus-visible:outline-primary-600 hover:bg-primary-500',
  secondary: 'bg-white text-primary-600 border border-primary-100 hover:bg-primary-50',
  ghost: 'bg-transparent text-slate-500 hover:bg-slate-100',
  danger: 'bg-danger text-white hover:bg-danger/90'
};

const sizes = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-sm',
  icon: 'h-10 w-10'
};

const Button = forwardRef(({ variant = 'primary', size = 'md', to, type = 'button', className, children, ...rest }, ref) => {
  const classes = clsx(base, variants[variant], sizes[size], className);

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref} type={type} className={classes} {...rest}>
      {children}
    </button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'icon']),
  to: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default Button;
