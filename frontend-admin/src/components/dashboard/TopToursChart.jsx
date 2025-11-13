import PropTypes from 'prop-types';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../common/Card.jsx';

const TopToursChart = ({ data }) => {
  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const tour = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900 mb-2">{tour.tourName}</p>
          <div className="space-y-1 text-sm">
            <p className="text-slate-600">
              Revenue: <span className="font-semibold text-primary-600">{formatCurrency(tour.revenue)}</span>
            </p>
            <p className="text-slate-600">
              Bookings: <span className="font-semibold">{tour.bookingCount}</span>
            </p>
            {tour.occupancyRate !== undefined && tour.occupancyRate > 0 && (
              <p className="text-slate-600">
                Occupancy: <span className="font-semibold">{tour.occupancyRate.toFixed(1)}%</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
  };

  return (
    <Card className="h-[400px]" padding="p-0">
      <div className="px-6 pt-6 pb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Top Performers</p>
          <h3 className="text-lg font-semibold text-slate-900">Best Selling Tours</h3>
        </div>
      </div>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 24, left: 0, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="tourName"
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="revenue"
              fill="#2563eb"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full pb-20">
          <p className="text-sm text-slate-400">No tour data available</p>
        </div>
      )}
    </Card>
  );
};

TopToursChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    tourId: PropTypes.number,
    tourName: PropTypes.string.isRequired,
    revenue: PropTypes.number.isRequired,
    bookingCount: PropTypes.number,
    occupancyRate: PropTypes.number,
  })).isRequired
};

export default TopToursChart;
