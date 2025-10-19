import PropTypes from 'prop-types';
import Card from '../common/Card.jsx';
import RatingStars from '../common/RatingStars.jsx';

const ReviewSummary = ({ averageRating, total, distribution }) => (
  <Card className="space-y-6">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary-500">Overall satisfaction</p>
        <div className="mt-2 flex items-end gap-4">
          <span className="text-4xl font-semibold text-slate-900">{averageRating.toFixed(1)}</span>
          <RatingStars rating={averageRating} />
        </div>
        <p className="mt-2 text-sm text-slate-500">{total} verified traveler reviews</p>
      </div>
      <div className="rounded-2xl bg-primary-50 px-5 py-4 text-sm text-primary-600">
        <p className="font-semibold text-primary-700">97% would recommend</p>
        <p className="mt-1 text-xs text-primary-400">Mirror this with NPS data from `/analytics/reviews`.</p>
      </div>
    </div>

    <div className="space-y-3">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = distribution[star] ?? 0;
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

        return (
          <div key={star} className="flex items-center gap-3 text-sm text-slate-600">
            <span className="w-10 font-semibold text-slate-700">{star}★</span>
            <div className="h-2 flex-1 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-primary-500 transition-all" style={{ width: `${percentage}%` }} />
            </div>
            <span className="w-14 text-right text-xs text-slate-400">{percentage}%</span>
          </div>
        );
      })}
    </div>
  </Card>
);

ReviewSummary.propTypes = {
  averageRating: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  distribution: PropTypes.objectOf(PropTypes.number).isRequired
};

export default ReviewSummary;
