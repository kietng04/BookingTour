import PropTypes from 'prop-types';
import Card from '../common/Card.jsx';
import RatingStars from '../common/RatingStars.jsx';
import Badge from '../common/Badge.jsx';
import { formatDate } from '../../utils/format.js';

const ReviewList = ({ reviews, tourLookup }) => (
  <div className="space-y-5">
    {reviews.map((review) => (
      <Card key={review.id} className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={review.avatar}
              alt={review.guest}
              className="h-12 w-12 rounded-full object-cover"
              loading="lazy"
            />
            <div>
              <p className="text-sm font-semibold text-slate-800">{review.guest}</p>
              <p className="text-xs text-slate-400">{formatDate(review.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RatingStars rating={review.rating} />
            <span className="text-sm font-semibold text-slate-600">{review.rating.toFixed(1)}</span>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-primary-500">
            {tourLookup[review.tourId] ?? 'Custom itinerary'}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{review.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{review.comment}</p>
        </div>

        {review.badges?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {review.badges.map((badge) => (
              <Badge key={badge} variant="outline">
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </Card>
    ))}
  </div>
);

ReviewList.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      tourId: PropTypes.string.isRequired,
      guest: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      comment: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      badges: PropTypes.arrayOf(PropTypes.string)
    })
  ).isRequired,
  tourLookup: PropTypes.objectOf(PropTypes.string).isRequired
};

export default ReviewList;
