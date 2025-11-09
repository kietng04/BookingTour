import { DollarSign, TicketPercent, Users as UsersIcon, ThumbsUp } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard.jsx';
import RevenueChart from '../components/dashboard/RevenueChart.jsx';
import RecentBookings from '../components/dashboard/RecentBookings.jsx';
import Card from '../components/common/Card.jsx';
import { useEffect, useState } from 'react';
import { bookingsAPI } from '../services/api.js';

const iconMap = {
  revenue: DollarSign,
  bookings: TicketPercent,
  refunds: UsersIcon,
  nps: ThumbsUp
};

const Dashboard = () => {
  const [stats, setStats] = useState([
    { id: 'revenue', title: 'Net revenue', value: '—', change: 0, subtitle: '30 ngày gần đây' },
    { id: 'bookings', title: 'Confirmed bookings', value: '—', change: 0, subtitle: 'Tổng đơn' },
    { id: 'refunds', title: 'Refund requests', value: '—', change: 0, subtitle: 'Yêu cầu hoàn' },
    { id: 'nps', title: 'NPS score', value: '—', change: 0, subtitle: 'Khảo sát' },
  ]);
  const [recent, setRecent] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const page = await bookingsAPI.getAll({ page: 0, size: 10 });
        const content = page.content || [];

        // Tạo danh sách recent bookings hiển thị
        const recentAdapted = content.map((b) => ({
          id: String(b.id),
          tourName: `Tour #${b.tourId}`,
          guestName: `User #${b.userId}`,
          travelDate: (b.createdAt || '').toString(),
          amount: Number(b.totalAmount || 0),
          status: (b.status || 'PENDING').toLowerCase(),
        }));
        setRecent(recentAdapted);

        // Cập nhật số liệu tổng quan
        const confirmedCount = content.filter((b) => (b.status || '').toUpperCase() === 'CONFIRMED').length;
        const totalAmount = content.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
        setStats((prev) => prev.map((s) => {
          if (s.id === 'bookings') return { ...s, value: String(confirmedCount) };
          if (s.id === 'revenue') return { ...s, value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount) };
          return s;
        }));

        // Dữ liệu biểu đồ doanh thu (nhóm theo tháng từ createdAt)
        const byMonth = new Map();
        content.forEach((b) => {
          const d = b.createdAt ? new Date(b.createdAt) : new Date();
          const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
          const cur = byMonth.get(key) || 0;
          byMonth.set(key, cur + Number(b.totalAmount || 0));
        });
        const chart = Array.from(byMonth.entries()).sort(([a],[b]) => a.localeCompare(b)).map(([ym, revenue]) => {
          const [y,m] = ym.split('-');
          return { month: `${m}/${y}`, revenue };
        });
        setChartData(chart);
      } catch (e) {
        console.error('Load dashboard failed', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
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

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <RevenueChart data={chartData} />
        <RecentBookings bookings={recent} />
      </div>

      <Card className="grid gap-6 rounded-3xl border-dashed border-primary-200 bg-primary-50/60 p-8 text-primary-700 md:grid-cols-2">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-primary-500">Automation roadmap</p>
          <h3 className="text-2xl font-semibold">Workflow sync with backend events</h3>
          <p className="text-sm text-primary-600">
            Kết nối sự kiện đặt chỗ, cập nhật tour, và xử lý thanh toán để tự động hóa.
          </p>
        </div>
        <ul className="space-y-2 text-sm text-primary-600">
          <li>• booking.confirmed → gửi biên nhận thanh toán</li>
          <li>• tour.updated → quy trình duyệt nội dung & dịch</li>
          <li>• payment.failed → cảnh báo và hỗ trợ thủ công</li>
        </ul>
      </Card>
      {loading && <p className="text-xs text-slate-400">Đang tải dữ liệu dashboard...</p>}
    </div>
  );
};

export default Dashboard;
