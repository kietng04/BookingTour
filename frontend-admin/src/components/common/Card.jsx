import PropTypes from 'prop-types';
import clsx from 'clsx';

const Card = ({ children, className, padding = 'p-6' }) => (
  <div className={clsx('rounded-3xl border border-slate-200 bg-white shadow-sm', padding, className)}>
    {children}
  </div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  padding: PropTypes.string
};

export default Card;
