import PropTypes from 'prop-types';
import { Star } from 'lucide-react';

const RatingStars = ({ rating, outOf = 5 }) => {
  const stars = Array.from({ length: outOf }).map((_, index) => (
    <Star
      key={index}
      className={`h-4 w-4 ${index + 1 <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
    />
  ));

  return (
    <div className="flex items-center gap-1">
      {stars}
      <span className="ml-1 text-xs font-medium text-slate-500">{rating.toFixed(1)}</span>
    </div>
  );
};

RatingStars.propTypes = {
  rating: PropTypes.number.isRequired,
  outOf: PropTypes.number
};

export default RatingStars;
