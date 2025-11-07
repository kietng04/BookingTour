import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Users } from 'lucide-react';
import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import { formatCurrency } from '../../utils/format.js';

const difficultyLabels = {
  easy: 'Thư giãn',
  moderate: 'Khám phá nhẹ nhàng',
  adventure: 'Phiêu lưu mạo hiểm',
};

const TourCard = ({ tour }) => (
  <Card className="flex flex-col gap-5 overflow-hidden p-0">
    <div className="relative h-56 w-full overflow-hidden">
      <img
        src={tour.thumbnail}
        alt={tour.name}
        className="h-full w-full object-cover transition duration-500 hover:scale-105"
        loading="lazy"
      />
      <div className="absolute left-4 top-4 flex gap-2">
        <Badge>{tour.destination}</Badge>
        <Badge variant="outline">
          {tour.difficultyLabel ?? difficultyLabels[tour.difficulty] ?? tour.difficulty}
        </Badge>
      </div>
    </div>

    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-400">
          {(tour.reviewsCount ?? 0).toLocaleString('vi-VN')}+ đánh giá
        </span>
      </div>

      <div>
        <Link
          to={`/tours/${tour.id}`}
          className="text-xl font-semibold text-slate-900 hover:text-primary-600"
        >
          {tour.name}
        </Link>
        <p className="mt-2 text-sm text-slate-500">{tour.description}</p>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
        <span className="inline-flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary-500" />
          {tour.duration} ngày
        </span>
        <span className="inline-flex items-center gap-2">
          <Users className="h-4 w-4 text-primary-500" />
          {tour.groupSize}
        </span>
        <span className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary-500" />
          {tour.destination}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wide text-slate-400">Giá từ</span>
          <p className="text-lg font-semibold text-primary-600">{formatCurrency(tour.price)}</p>
        </div>
        <Button to={`/tours/${tour.id}`} size="sm">
          Xem chi tiết
        </Button>
      </div>
    </div>
  </Card>
);

TourCard.propTypes = {
  tour: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    destination: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    groupSize: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
    difficultyLabel: PropTypes.string,
    price: PropTypes.number.isRequired,
    thumbnail: PropTypes.string.isRequired,
    reviewsCount: PropTypes.number,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default TourCard;

