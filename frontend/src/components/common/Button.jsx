import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:pointer-events-none disabled:opacity-60';

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-500 shadow-accent',
  secondary: 'bg-white text-primary-600 border border-primary-100 hover:border-primary-200 hover:shadow-soft',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  danger: 'bg-danger text-white hover:bg-danger/90'
};

const sizes = {
  base: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
  sm: 'h-9 px-4 text-sm',
  icon: 'h-11 w-11'
};

const Button = forwardRef(({ as = 'button', to, variant = 'primary', size = 'base', className, children, ...props }, ref) => {
  const classes = clsx(baseStyles, variants[variant], sizes[size], className);

  if (as === 'link' && to) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref} type="button" className={classes} {...props}>
      {children}
    </button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  as: PropTypes.oneOf(['button', 'link']),
  to: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger']),
  size: PropTypes.oneOf(['base', 'lg', 'sm', 'icon']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default Button;
