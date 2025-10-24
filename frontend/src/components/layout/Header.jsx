import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import Button from '../common/Button.jsx';
import MobileMenu from './MobileMenu.jsx';
import { useAuth } from '../../context/AuthContext.tsx';

const navigation = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Tour', to: '/tours' },
  { label: 'Đánh giá', to: '/reviews' },
  { label: 'Đặt chỗ của tôi', to: '/profile' }
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { isAuthenticated, user, logout } = useAuth();

  const displayName = (user?.fullName || user?.username || user?.email || '').trim() || 'Khách du lịch';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  const avatar = user?.avatar;

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 text-2xl font-semibold text-primary-600">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">BT</span>
          BookingTour Việt Nam
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-primary-600 ${isActive ? 'text-primary-600' : 'text-slate-600'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="ghost" size="icon" aria-label="Tìm kiếm">
            <Search className="h-5 w-5" />
          </Button>
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-left text-slate-700 shadow-sm transition hover:bg-slate-50"
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt={displayName}
                    className="h-9 w-9 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600">
                    {initials || 'BT'}
                  </span>
                )}
                <span className="flex flex-col text-sm leading-tight">
                  <span className="font-semibold text-slate-800">{displayName}</span>
                  {user?.email && <span className="text-xs text-slate-500">{user.email}</span>}
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl">
                  <Link
                    to="/profile"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-primary-50 hover:text-primary-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    Hồ sơ cá nhân
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-danger transition hover:bg-danger/10"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button to="/auth/login" variant="ghost">Đăng nhập</Button>
              <Button to="/auth/register">Tạo tài khoản</Button>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          aria-label="Mở menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} navigation={navigation} />
      </div>
    </header>
  );
};

export default Header;
