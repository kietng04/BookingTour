import ReviewTable from '../../components/reviews/ReviewTable.jsx';
import Card from '../../components/common/Card.jsx';
import { adminReviews } from '../../data/reviews.js';

const Reviews = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Reviews</h1>
      <p className="text-sm text-slate-500">Moderate guest feedback before publishing to the customer site. Connect to `/admin/reviews`.</p>
    </div>

    <ReviewTable reviews={adminReviews} />

    <Card className="space-y-3 text-sm text-slate-600">
      <p className="font-semibold text-slate-800">Automation idea</p>
      <p>Auto-approve 4★+ reviews while routing flagged ones to Slack. Use status badges (pending, approved, flagged) tied to moderation queue.</p>
    </Card>
  </div>
);

export default Reviews;
