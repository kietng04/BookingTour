import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart2, BookOpen, CalendarClock, LayoutDashboard, LogOut, Users, Calendar, MessageCircle, MapPin } from 'lucide-react';
import clsx from 'clsx';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import Button from '../components/common/Button.jsx';

const navigation = [
  { icon: LayoutDashboard, label: 'Bảng điều khiển', to: '/' },
  { icon: BookOpen, label: 'Tour du lịch', to: '/tours' },
  { icon: Calendar, label: 'Chuyến đi', to: '/departures' },
  { icon: CalendarClock, label: 'Đặt chỗ', to: '/bookings' },
  { icon: MapPin, label: 'Tour tùy chỉnh', to: '/custom-tours' },
  // { icon: MessageCircle, label: 'Đánh giá', to: '/reviews' }, // Disabled - not in use
  { icon: Users, label: 'Người dùng', to: '/users' }
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  if (!isAuthenticated) {
    navigate('/auth/login');
    return null;
  }

  return (
    <div className={clsx('grid min-h-screen bg-slate-100 text-slate-900 lg:grid-cols-[260px_1fr]', collapsed && 'sidebar-collapsed lg:grid-cols-[90px_1fr]')}>
      <aside className="hidden h-full flex-col border-r border-slate-200 bg-white/90 px-4 py-6 backdrop-blur lg:flex">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">BT</span>
            {!collapsed && (
              <div>
                <p className="text-lg font-semibold text-slate-900">BookingTour</p>
                <p className="text-xs text-slate-400">Quản trị viên</p>
              </div>
            )}
          </div>
        </div>

        <nav className="mt-10 flex flex-1 flex-col gap-2">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <Button variant="ghost" className="justify-start" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span className="sidebar-label">Đăng xuất</span>
        </Button>
      </aside>

      <div className="flex flex-col">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCollapsed((prev) => !prev)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100"
                aria-label="Toggle sidebar"
              >
                <BarChart2 className="h-5 w-5" />
              </button>
              <div>
                <p className="text-sm font-semibold text-slate-800">Tổng quan hôm nay</p>
                <p className="text-xs text-slate-400">Theo dõi đặt chỗ, doanh thu và đánh giá một cách nhanh chóng.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold text-slate-800">{user?.fullName || user?.username || 'Admin'}</p>
                <p className="text-xs text-slate-400">{user?.role || 'ADMIN'}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <span className="text-sm font-medium text-primary-600">
                    {(user?.fullName || user?.username || 'A').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
