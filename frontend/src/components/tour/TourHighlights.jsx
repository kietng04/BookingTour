import PropTypes from 'prop-types';
import { CheckCircle2 } from 'lucide-react';
import Card from '../common/Card.jsx';

const TourHighlights = ({ highlights }) => (
  <Card className="space-y-4">
    <h3 className="text-lg font-semibold text-slate-900">Điểm nổi bật được yêu thích</h3>
    <ul className="space-y-3">
      {highlights.map((highlight) => (
        <li key={highlight} className="flex gap-3 text-sm text-slate-600">
          <CheckCircle2 className="mt-1 h-5 w-5 text-primary-500" />
          <span>{highlight}</span>
        </li>
      ))}
    </ul>
  </Card>
);

TourHighlights.propTypes = {
  highlights: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default TourHighlights;
