import PropTypes from 'prop-types';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

const TrendIndicator = ({ value }) => {
  const isPositive = value >= 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-success' : 'text-danger'}`}>
      <Icon className="h-3.5 w-3.5" />
      {Math.abs(value)}%
    </span>
  );
};

TrendIndicator.propTypes = {
  value: PropTypes.number.isRequired
};

export default TrendIndicator;
