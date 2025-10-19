import PropTypes from 'prop-types';
import TourCard from './TourCard.jsx';
import Skeleton from '../common/Skeleton.jsx';

const TourGrid = ({ tours, loading }) => {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-4">
            <Skeleton className="h-48 w-full rounded-3xl" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
};

TourGrid.propTypes = {
  tours: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool
};

export default TourGrid;
