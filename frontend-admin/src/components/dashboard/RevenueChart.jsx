import PropTypes from 'prop-types';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../common/Card.jsx';

const RevenueChart = ({ data }) => (
  <Card className="h-[320px]" padding="p-0">
    <div className="flex items-center justify-between px-6 pt-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400">Revenue analytics</p>
        <h3 className="text-lg font-semibold text-slate-900">Rolling 12 months</h3>
      </div>
      <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">+18% YoY</span>
    </div>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 40, right: 24, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" x2="0" y1="0" y2="1">
            <stop offset="10%" stopColor="#2563eb" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #e2e8f0' }} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#2563eb"
          strokeWidth={3}
          fill="url(#colorRevenue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </Card>
);

RevenueChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    month: PropTypes.string.isRequired,
    revenue: PropTypes.number.isRequired
  })).isRequired
};

export default RevenueChart;
