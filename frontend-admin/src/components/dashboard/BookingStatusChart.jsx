import PropTypes from 'prop-types';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../common/Card.jsx';

const BookingStatusChart = ({ data }) => {
  // Color scheme for different statuses
  const STATUS_COLORS = {
    CONFIRMED: '#10b981', // green
    PENDING: '#f59e0b',   // amber
    CANCELLED: '#ef4444', // red
    FAILED: '#6b7280',    // gray
  };

  // Custom label to show percentage
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label if less than 5%

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const statusData = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-900 mb-1">{statusData.status}</p>
          <p className="text-sm text-slate-600">
            Count: <span className="font-semibold">{statusData.count}</span>
          </p>
          <p className="text-sm text-slate-600">
            Percentage: <span className="font-semibold">{statusData.percentage.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
  };

  renderCustomizedLabel.propTypes = {
    cx: PropTypes.number,
    cy: PropTypes.number,
    midAngle: PropTypes.number,
    innerRadius: PropTypes.number,
    outerRadius: PropTypes.number,
    percent: PropTypes.number,
  };

  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="h-[400px]" padding="p-0">
      <div className="px-6 pt-6 pb-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Booking Distribution</p>
          <h3 className="text-lg font-semibold text-slate-900">Status Breakdown</h3>
        </div>
      </div>
      {data && data.length > 0 ? (
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={90}
                innerRadius={50}
                fill="#8884d8"
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="w-full px-6 pb-6">
            <div className="grid grid-cols-2 gap-3">
              {data.map((item) => (
                <div key={item.status} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[item.status] || '#94a3b8' }}
                  />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-700">{item.status}</p>
                    <p className="text-xs text-slate-500">{item.count} ({item.percentage.toFixed(1)}%)</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t">
              <p className="text-sm text-slate-600">
                Total Bookings: <span className="font-semibold text-slate-900">{totalCount}</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-slate-400">No booking data available</p>
        </div>
      )}
    </Card>
  );
};

BookingStatusChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    status: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    percentage: PropTypes.number.isRequired,
  })).isRequired
};

export default BookingStatusChart;
