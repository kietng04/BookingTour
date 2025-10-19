import PropTypes from 'prop-types';
import clsx from 'clsx';

const Card = ({ children, className }) => (
  <div className={clsx('rounded-3xl border border-slate-100 bg-white p-6 shadow-soft', className)}>
    {children}
  </div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Card;
