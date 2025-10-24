import PropTypes from 'prop-types';
import { MessageCircle } from 'lucide-react';
import Card from '../common/Card.jsx';
import RatingStars from '../common/RatingStars.jsx';
import Badge from '../common/Badge.jsx';
import { formatDate } from '../../utils/format.js';

const ReviewsPanel = ({ reviews }) => (
  <Card className="space-y-6">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary-500">Câu chuyện từ du khách</p>
        <h3 className="text-lg font-semibold text-slate-900">Đánh giá mới nhất</h3>
      </div>
      <MessageCircle className="h-6 w-6 text-primary-500" />
    </div>

    <div className="space-y-5">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-3xl border border-slate-100 bg-slate-50/70 p-5">
          <div className="flex items-center gap-4">
            <img src={review.avatar} alt={review.guest} className="h-12 w-12 rounded-full object-cover" />
            <div>
              <p className="text-sm font-semibold text-slate-800">{review.guest}</p>
              <p className="text-xs text-slate-400">{formatDate(review.createdAt)}</p>
            </div>
            <RatingStars rating={review.rating} />
          </div>
          <h4 className="mt-4 text-base font-semibold text-slate-800">{review.title}</h4>
          <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
          {review.badges?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {review.badges.map((badge) => (
                <Badge key={badge} variant="outline">{badge}</Badge>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </Card>
);

ReviewsPanel.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    guest: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    badges: PropTypes.arrayOf(PropTypes.string)
  })).isRequired
};

export default ReviewsPanel;
