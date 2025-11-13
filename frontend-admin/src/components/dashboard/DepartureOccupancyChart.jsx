import PropTypes from 'prop-types';
import Card from '../common/Card.jsx';

const DepartureOccupancyChart = ({ data }) => {
  const getOccupancyColor = (rate) => {
    if (rate >= 90) return 'bg-red-500';
    if (rate >= 70) return 'bg-amber-500';
    if (rate >= 50) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'FULL':
        return 'bg-red-100 text-red-700';
      case 'NEARLY_FULL':
        return 'bg-amber-100 text-amber-700';
      case 'AVAILABLE':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="h-[400px] overflow-hidden" padding="p-0">
      <div className="px-6 pt-6 pb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Capacity Management</p>
          <h3 className="text-lg font-semibold text-slate-900">Departure Occupancy</h3>
        </div>
      </div>
      {data && data.length > 0 ? (
        <div className="px-6 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(400px - 80px)' }}>
          <div className="space-y-4">
            {data.map((departure) => (
              <div
                key={departure.departureId}
                className="border border-slate-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 text-sm">{departure.tourName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatDate(departure.startDate)}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                      departure.status
                    )}`}
                  >
                    {departure.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700">
                      {departure.bookedSlots} / {departure.totalSlots} slots
                    </span>
                    <span className="text-xs font-semibold text-slate-900">
                      {departure.occupancyRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all ${getOccupancyColor(
                        departure.occupancyRate
                      )}`}
                      style={{ width: `${Math.min(departure.occupancyRate, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Booked: {departure.bookedSlots}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Available: {departure.remainingSlots}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full pb-20">
          <p className="text-sm text-slate-400">No departure data available</p>
        </div>
      )}
    </Card>
  );
};

DepartureOccupancyChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    departureId: PropTypes.number.isRequired,
    tourId: PropTypes.number.isRequired,
    tourName: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    totalSlots: PropTypes.number.isRequired,
    bookedSlots: PropTypes.number.isRequired,
    remainingSlots: PropTypes.number.isRequired,
    occupancyRate: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  })).isRequired
};

export default DepartureOccupancyChart;
