import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Globe2, PhoneCall, User, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Tour', to: '/tours' },
  { label: 'Điểm đến', to: '/destinations' },
  { label: 'Trải nghiệm', to: '/experiences' },
  { label: 'Câu chuyện', to: '/stories' },
  { label: 'Hỗ trợ', to: '/support' },
];

const primaryNavClass =
  'relative inline-flex items-center text-sm font-medium text-gray-600 transition hover:text-gray-900 focus-visible:text-gray-900';

const SiteHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const { isAuthenticated, user, logout } = useAuth();

  const profileInitials = useMemo(() => {
    if (!user) return 'BT';
    const source = user.fullName || user.username || '';
    if (!source) return 'BT';
    const parts = source.split(' ').filter(Boolean);
    return parts.slice(-2).map((part) => part[0]?.toUpperCase() ?? '').join('') || 'BT';
  }, [user]);

  const profileName = useMemo(() => {
    if (!user) return '';
    return user.fullName || user.username || '';
  }, [user]);

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
      <a
        href="#main-content"
        className="absolute left-3 top-3 z-[100] -translate-y-20 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg focus-visible:translate-y-0 focus-visible:outline-none"
      >
        Bỏ qua nội dung
      </a>
      <div className="container flex items-center justify-between gap-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white shadow-card">
              BT
            </span>
            BookingTour
          </Link>
        </div>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  primaryNavClass,
                  isActive &&
                    'text-gray-900 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-brand-500 after:content-[""]'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <button className="inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-brand-200 hover:text-gray-900 focus-visible:border-brand-300">
            <Globe2 className="h-4 w-4" aria-hidden="true" />
            VN
          </button>
          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-soft transition hover:border-brand-200 hover:text-gray-900 focus-visible:border-brand-300"
                aria-haspopup="true"
                aria-expanded={isProfileMenuOpen}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
                  {profileInitials}
                </span>
                <span className="max-w-[150px] truncate text-left">{profileName || 'Tài khoản'}</span>
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">{profileName || 'Tài khoản'}</p>
                    <p className="text-xs text-gray-500">{user?.email ?? 'Chưa cập nhật email'}</p>
                  </div>
                  <div className="flex flex-col gap-1 p-2 text-sm text-gray-600">
                    <Link
                      to="/profile"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-brand-50 hover:text-brand-600"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" aria-hidden="true" />
                      Hồ sơ của tôi
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        logout();
                      }}
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-left transition hover:bg-danger/10 hover:text-danger"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-200 hover:text-gray-900 focus-visible:border-brand-300"
            >
              Đăng nhập
            </Link>
          )}
        </div>
        <button
          type="button"
          className="inline-flex items-center rounded-full border border-gray-200 p-2 text-gray-700 transition hover:border-brand-200 hover:text-brand-600 focus-visible:border-brand-300 focus-visible:text-brand-600 lg:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">Mở menu</span>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <div
        id="mobile-menu"
        className={clsx(
          'lg:hidden',
          isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <div className="space-y-6 border-t border-gray-100 bg-white px-6 py-6 shadow-card transition-all duration-300 ease-in-out">
          <nav className="grid gap-4" aria-label="Điều hướng di động">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  clsx('text-base font-medium text-gray-700', isActive && 'text-brand-600')
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="grid gap-3 border-t border-gray-100 pt-4">
            <a
              href="tel:+84987654321"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600"
            >
              <PhoneCall className="h-4 w-4 text-brand-500" aria-hidden="true" />
              0987 654 321
            </a>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-200 hover:text-gray-900 focus-visible:border-brand-300"
                >
                  <User className="h-4 w-4" aria-hidden="true" />
                  Hồ sơ của tôi
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-danger/30 px-4 py-2 text-sm font-semibold text-danger transition hover:bg-danger/10 focus-visible:border-danger/40"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link
                to="/auth/login"
                className="inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-brand-600 focus-visible:bg-brand-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
