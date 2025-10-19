import PropTypes from 'prop-types';
import clsx from 'clsx';

const Skeleton = ({ className }) => (
  <div className={clsx('animate-pulse rounded-xl bg-slate-200/70', className)} />
);

Skeleton.propTypes = {
  className: PropTypes.string
};

export default Skeleton;
