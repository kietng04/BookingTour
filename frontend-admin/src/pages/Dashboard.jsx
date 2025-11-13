import { DollarSign, TicketPercent, Users as UsersIcon, TrendingUp } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard.jsx';
import RevenueChart from '../components/dashboard/RevenueChart.jsx';
import RecentBookings from '../components/dashboard/RecentBookings.jsx';
import DateRangeFilter from '../components/dashboard/DateRangeFilter.jsx';
import TopToursChart from '../components/dashboard/TopToursChart.jsx';
import BookingStatusChart from '../components/dashboard/BookingStatusChart.jsx';
import DepartureOccupancyChart from '../components/dashboard/DepartureOccupancyChart.jsx';
import Card from '../components/common/Card.jsx';
import { useEffect, useState } from 'react';
import { dashboardAPI, bookingsAPI } from '../services/api.js';

const iconMap = {
  revenue: DollarSign,
  bookings: TicketPercent,
  users: UsersIcon,
  conversion: TrendingUp
};

const Dashboard = () => {
  const [stats, setStats] = useState([
    { id: 'revenue', title: 'Net revenue', value: '—', change: 0, subtitle: 'Confirmed bookings' },
    { id: 'bookings', title: 'Total bookings', value: '—', change: 0, subtitle: 'All statuses' },
    { id: 'users', title: 'Active users', value: '—', change: 0, subtitle: 'Made bookings' },
    { id: 'conversion', title: 'Conversion rate', value: '—', change: 0, subtitle: 'Confirmed %' },
  ]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [topTours, setTopTours] = useState([]);
  const [bookingStatusStats, setBookingStatusStats] = useState([]);
  const [departureOccupancy, setDepartureOccupancy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Initialize default date range (last 30 days)
  useEffect(() => {
    const today = new Date();
    const last30Days = new Date(today);
    last30Days.setDate(today.getDate() - 30);

    const endDate = today.toISOString().split('T')[0];
    const startDate = last30Days.toISOString().split('T')[0];

    setDateRange({ startDate, endDate });
  }, []);

  // Fetch all dashboard data when date range changes
  useEffect(() => {
    if (!dateRange.startDate || !dateRange.endDate) return;

    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [
        statsData,
        trendsData,
        toursData,
        statusData,
        occupancyData,
        recentData
      ] = await Promise.all([
        dashboardAPI.getStats(dateRange),
        dashboardAPI.getRevenueTrends(dateRange),
        dashboardAPI.getTopTours({ limit: 5 }),
        dashboardAPI.getBookingStatus(),
        dashboardAPI.getDepartureOccupancy(),
        bookingsAPI.getAll({ page: 0, size: 10 })
      ]);

      // Update stats cards
      if (statsData) {
        const updatedStats = [
          {
            id: 'revenue',
            title: 'Net revenue',
            value: formatCurrency(statsData.revenue?.confirmed || 0),
            change: statsData.revenue?.change || 0,
            subtitle: 'Confirmed bookings'
          },
          {
            id: 'bookings',
            title: 'Total bookings',
            value: String(statsData.bookings?.total || 0),
            change: 0,
            subtitle: 'All statuses'
          },
          {
            id: 'users',
            title: 'Active users',
            value: String(statsData.users?.activeUsers || 0),
            change: 0,
            subtitle: 'Made bookings'
          },
          {
            id: 'conversion',
            title: 'Conversion rate',
            value: `${(statsData.bookings?.conversionRate || 0).toFixed(1)}%`,
            change: 0,
            subtitle: 'Confirmed %'
          }
        ];
        setStats(updatedStats);
      }

      // Update revenue trends chart
      if (trendsData && Array.isArray(trendsData)) {
        const formattedTrends = trendsData.map(item => ({
          month: formatDateShort(item.period),
          revenue: Number(item.revenue) || 0
        }));
        setRevenueTrends(formattedTrends);
      }

      // Update top tours chart
      if (toursData && Array.isArray(toursData)) {
        const formattedTours = toursData.map(tour => ({
          tourId: tour.tourId,
          tourName: truncateText(tour.tourName, 20),
          revenue: Number(tour.revenue) || 0,
          bookingCount: tour.bookingCount || 0,
          occupancyRate: tour.occupancyRate || 0
        }));
        setTopTours(formattedTours);
      }

      // Update booking status chart
      if (statusData && Array.isArray(statusData)) {
        setBookingStatusStats(statusData);
      }

      // Update departure occupancy
      if (occupancyData && Array.isArray(occupancyData)) {
        setDepartureOccupancy(occupancyData);
      }

      // Update recent bookings
      if (recentData && recentData.content) {
        const formattedBookings = recentData.content.map((b) => ({
          id: String(b.id),
          tourName: `Tour #${b.tourId}`,
          guestName: `User #${b.userId}`,
          travelDate: b.createdAt || '',
          amount: Number(b.totalAmount || 0),
          status: (b.status || 'PENDING').toLowerCase(),
        }));
        setRecentBookings(formattedBookings);
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDateShort = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="space-y-8">
      {/* Date Range Filter */}
      <DateRangeFilter onDateRangeChange={handleDateRangeChange} />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
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

      {/* Revenue Trends and Recent Bookings */}
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <RevenueChart data={revenueTrends} />
        <RecentBookings bookings={recentBookings} />
      </div>

      {/* Top Tours and Booking Status */}
      <div className="grid gap-6 xl:grid-cols-2">
        <TopToursChart data={topTours} />
        <BookingStatusChart data={bookingStatusStats} />
      </div>

      {/* Departure Occupancy */}
      <DepartureOccupancyChart data={departureOccupancy} />

      {loading && (
        <Card className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2"></div>
          <p className="text-sm text-slate-400">Loading dashboard data...</p>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
