import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BarChart2, BookOpen, CalendarClock, LayoutDashboard, LogOut, Settings, Star, Users } from 'lucide-react';
import clsx from 'clsx';
import Button from '../components/common/Button.jsx';

const navigation = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: BookOpen, label: 'Tours', to: '/tours' },
  { icon: CalendarClock, label: 'Bookings', to: '/bookings' },
  { icon: Users, label: 'Users', to: '/users' },
  { icon: Star, label: 'Reviews', to: '/reviews' },
  { icon: Settings, label: 'Settings', to: '/settings' }
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={clsx('grid min-h-screen bg-slate-100 text-slate-900 lg:grid-cols-[260px_1fr]', collapsed && 'sidebar-collapsed lg:grid-cols-[90px_1fr]')}>
      <aside className="hidden h-full flex-col border-r border-slate-200 bg-white/90 px-4 py-6 backdrop-blur lg:flex">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">BT</span>
            {!collapsed && (
              <div>
                <p className="text-lg font-semibold text-slate-900">BookingTour</p>
                <p className="text-xs text-slate-400">Admin dashboard</p>
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

        <Button variant="ghost" className="justify-start">
          <LogOut className="h-4 w-4" />
          <span className="sidebar-label">Log out</span>
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
                <p className="text-sm font-semibold text-slate-800">Today&apos;s pulse</p>
                <p className="text-xs text-slate-400">Monitor bookings, revenue, and reviews at a glance.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500 md:flex">
                <span className="inline-flex h-2 w-2 rounded-full bg-success" />
                Live sync
              </div>
              <Button to="/auth/login" variant="ghost" size="sm">
                Switch account
              </Button>
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
