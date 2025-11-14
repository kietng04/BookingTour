import { DollarSign, TicketPercent, Users as UsersIcon, Download, MessageCircle } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard.jsx';
import RevenueChart from '../components/dashboard/RevenueChart.jsx';
import DateRangeFilter from '../components/dashboard/DateRangeFilter.jsx';
import TopToursChart from '../components/dashboard/TopToursChart.jsx';
import BookingStatusChart from '../components/dashboard/BookingStatusChart.jsx';
import DepartureOccupancyChart from '../components/dashboard/DepartureOccupancyChart.jsx';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import { useEffect, useState } from 'react';
import { dashboardAPI, exportAPI, reviewsAPI } from '../services/api.js';

const iconMap = {
  revenue: DollarSign,
  bookings: TicketPercent,
  users: UsersIcon,
  reviews: MessageCircle
};

const Dashboard = () => {
  const [stats, setStats] = useState([
    { id: 'revenue', title: 'Doanh thu', value: '—', change: 0, subtitle: 'Từ booking đã xác nhận' },
    { id: 'bookings', title: 'Tổng đặt tour', value: '—', change: 0, subtitle: 'Tất cả trạng thái' },
    { id: 'users', title: 'Người dùng', value: '—', change: 0, subtitle: 'Đã đặt tour' },
    { id: 'reviews', title: 'Đánh giá', value: '—', change: 0, subtitle: 'Chờ duyệt' },
  ]);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [topTours, setTopTours] = useState([]);
  const [bookingStatusStats, setBookingStatusStats] = useState([]);
  const [departureOccupancy, setDepartureOccupancy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const today = new Date();
    const last30Days = new Date(today);
    last30Days.setDate(today.getDate() - 30);

    const endDate = today.toISOString().split('T')[0];
    const startDate = last30Days.toISOString().split('T')[0];

    setDateRange({ startDate, endDate });
  }, []);

  useEffect(() => {
    if (!dateRange.startDate || !dateRange.endDate) return;

    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [
        statsData,
        trendsData,
        toursData,
        statusData,
        occupancyData,
        reviewStatsData
      ] = await Promise.all([
        dashboardAPI.getStats(dateRange),
        dashboardAPI.getRevenueTrends(dateRange),
        dashboardAPI.getTopTours({ limit: 5 }),
        dashboardAPI.getBookingStatus(),
        dashboardAPI.getDepartureOccupancy(),
        reviewsAPI.getOverallStats()
      ]);

      if (statsData) {
        const updatedStats = [
          {
            id: 'revenue',
            title: 'Doanh thu',
            value: formatCurrency(statsData.revenue?.confirmed || 0),
            change: statsData.revenue?.change || 0,
            subtitle: 'Từ booking đã xác nhận'
          },
          {
            id: 'bookings',
            title: 'Tổng đặt tour',
            value: String(statsData.bookings?.total || 0),
            change: 0,
            subtitle: 'Tất cả trạng thái'
          },
          {
            id: 'users',
            title: 'Người dùng',
            value: String(statsData.users?.activeUsers || 0),
            change: 0,
            subtitle: 'Đã đặt tour'
          },
          {
            id: 'reviews',
            title: 'Đánh giá',
            value: String(reviewStatsData?.total || 0),
            change: 0,
            subtitle: `${reviewStatsData?.pending || 0} chờ duyệt`
          }
        ];
        setStats(updatedStats);
      }

      if (trendsData && Array.isArray(trendsData)) {
        const formattedTrends = trendsData.map(item => ({
          month: formatDateShort(item.period),
          revenue: Number(item.revenue) || 0
        }));
        setRevenueTrends(formattedTrends);
      }

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

      if (statusData && Array.isArray(statusData)) {
        setBookingStatusStats(statusData);
      }

      if (occupancyData && Array.isArray(occupancyData)) {
        setDepartureOccupancy(occupancyData);
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

  const handleExportDashboard = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      alert('Vui lòng chọn khoảng thời gian hợp lệ');
      return;
    }

    try {
      setExporting(true);
      await exportAPI.downloadDashboardExcel(dateRange.startDate, dateRange.endDate);
    } catch (err) {
      console.error('Failed to export dashboard:', err);
      alert('Xuất báo cáo thất bại. Vui lòng thử lại.');
    } finally {
      setExporting(false);
    }
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
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1">
          <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
        </div>
        <div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportDashboard}
            disabled={exporting || loading || !dateRange.startDate || !dateRange.endDate}
          >
            <Download className="h-4 w-4" />
            {exporting ? 'Đang xuất...' : 'Xuất báo cáo'}
          </Button>
        </div>
      </div>

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

      <RevenueChart data={revenueTrends} />

      <div className="grid gap-6 xl:grid-cols-2">
        <TopToursChart data={topTours} />
        <BookingStatusChart data={bookingStatusStats} />
      </div>

      <DepartureOccupancyChart data={departureOccupancy} />

      {loading && (
        <Card className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2"></div>
          <p className="text-sm text-slate-400">Đang tải dữ liệu dashboard...</p>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
