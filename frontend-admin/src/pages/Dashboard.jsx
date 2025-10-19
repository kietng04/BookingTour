import { DollarSign, TicketPercent, Users as UsersIcon, ThumbsUp } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard.jsx';
import RevenueChart from '../components/dashboard/RevenueChart.jsx';
import RecentBookings from '../components/dashboard/RecentBookings.jsx';
import Card from '../components/common/Card.jsx';
import { dashboardStats, revenuePerformance, recentBookings } from '../data/dashboard.js';

const iconMap = {
  revenue: DollarSign,
  bookings: TicketPercent,
  refunds: UsersIcon,
  nps: ThumbsUp
};

const Dashboard = () => (
  <div className="space-y-8">
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {dashboardStats.map((stat) => (
        <StatCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          subtitle={stat.subtitle}
          icon={iconMap[stat.id] || DollarSign}
        />
      ))}
    </div>

    <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
      <RevenueChart data={revenuePerformance} />
      <RecentBookings bookings={recentBookings} />
    </div>

    <Card className="grid gap-6 rounded-3xl border-dashed border-primary-200 bg-primary-50/60 p-8 text-primary-700 md:grid-cols-2">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-primary-500">Automation roadmap</p>
        <h3 className="text-2xl font-semibold">Workflow sync with backend events</h3>
        <p className="text-sm text-primary-600">
          Use webhooks or queues to sync tour updates, booking status changes, and review moderation decisions.
          UI components already map to those states — simply hydrate with real data.
        </p>
      </div>
      <ul className="space-y-2 text-sm text-primary-600">
        <li>• `booking.confirmed` → auto-send payment receipt + assign concierge</li>
        <li>• `tour.updated` → trigger content review & translation workflow</li>
        <li>• `review.flagged` → notify moderation team & pause auto-publish</li>
      </ul>
    </Card>
  </div>
);

export default Dashboard;
