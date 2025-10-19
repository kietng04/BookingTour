import PropTypes from 'prop-types';
import { Check, FlagTriangleRight } from 'lucide-react';
import Card from '../common/Card.jsx';
import StatusPill from '../common/StatusPill.jsx';
import Button from '../common/Button.jsx';
import { formatDate } from '../../utils/format.js';

const ReviewTable = ({ reviews }) => (
  <Card className="space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400">Review moderation</p>
        <h3 className="text-lg font-semibold text-slate-900">Customer sentiment</h3>
      </div>
      <Button variant="secondary" size="sm">
        Export CSV
      </Button>
    </div>
    <div className="divide-y divide-slate-100">
      {reviews.map((review) => (
        <div key={review.id} className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-slate-800">{review.guestName}</p>
            <p className="text-xs text-slate-400">{review.tourName} · {formatDate(review.submittedAt)}</p>
            <p className="mt-2 text-sm text-slate-600">&ldquo;{review.excerpt}&rdquo;</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusPill status={review.status} />
            <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
              {review.rating.toFixed(1)} ★
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Check className="h-4 w-4" />
                Approve
              </Button>
              <Button variant="ghost" size="sm">
                <FlagTriangleRight className="h-4 w-4" />
                Flag
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

ReviewTable.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ReviewTable;
