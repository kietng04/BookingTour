import PropTypes from 'prop-types';
import { Filter, RefreshCcw } from 'lucide-react';
import Card from '../common/Card.jsx';
import Button from '../common/Button.jsx';

const ratingOptions = [
  { value: 'all', label: 'All ratings' },
  { value: '5', label: '5 stars' },
  { value: '4', label: '4 stars & up' },
  { value: '3', label: '3 stars & up' }
];

const ReviewFilters = ({ filters, onChange, tours, badges }) => {
  const handleReset = () => {
    onChange({ tour: 'all', rating: 'all', badge: 'all', sort: 'newest' });
  };

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary-500">Filter reviews</p>
          <h3 className="text-lg font-semibold text-slate-900">Find relevant feedback</h3>
        </div>
        <Filter className="h-5 w-5 text-primary-500" />
      </div>

      <label className="flex flex-col gap-2 text-sm text-slate-600">
        <span className="font-medium text-slate-700">Tour</span>
        <select
          value={filters.tour}
          onChange={(event) => onChange({ ...filters, tour: event.target.value })}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
        >
          <option value="all">All tours</option>
          {tours.map((tour) => (
            <option key={tour.id} value={tour.id}>
              {tour.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm text-slate-600">
        <span className="font-medium text-slate-700">Rating</span>
        <select
          value={filters.rating}
          onChange={(event) => onChange({ ...filters, rating: event.target.value })}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
        >
          {ratingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm text-slate-600">
        <span className="font-medium text-slate-700">Badge</span>
        <select
          value={filters.badge}
          onChange={(event) => onChange({ ...filters, badge: event.target.value })}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
        >
          <option value="all">Any badge</option>
          {badges.map((badge) => (
            <option key={badge} value={badge}>
              {badge}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm text-slate-600">
        <span className="font-medium text-slate-700">Sort by</span>
        <select
          value={filters.sort}
          onChange={(event) => onChange({ ...filters, sort: event.target.value })}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="rating-desc">Highest rated</option>
          <option value="rating-asc">Lowest rated</option>
        </select>
      </label>

      <Button type="button" variant="ghost" onClick={handleReset} className="w-full">
        <RefreshCcw className="h-4 w-4" />
        Reset filters
      </Button>
    </Card>
  );
};

ReviewFilters.propTypes = {
  filters: PropTypes.shape({
    tour: PropTypes.string,
    rating: PropTypes.string,
    badge: PropTypes.string,
    sort: PropTypes.string
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  tours: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  badges: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ReviewFilters;
