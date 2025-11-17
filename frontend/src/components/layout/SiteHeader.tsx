import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Globe2, PhoneCall, User, LogOut, Calendar, ChevronDown, MessageCircle } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

import { regionsAPI } from '../../services/api';

const navItems = [
  { label: 'Tour', to: '/tours' },
  { label: 'Chuyến đi tùy chỉnh', to: '/custom-tour-request' },
];

const primaryNavClass =
  'relative inline-flex items-center text-sm font-medium text-gray-600 transition hover:text-gray-900 focus-visible:text-gray-900';

const SiteHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isTravelMenuOpen, setIsTravelMenuOpen] = useState(false);
  const [regions, setRegions] = useState([]);
  const [provincesByRegion, setProvincesByRegion] = useState({});
  const [loadingRegions, setLoadingRegions] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const travelRef = useRef<HTMLDivElement | null>(null);
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
    const fetchRegionsAndProvinces = async () => {
      setLoadingRegions(true);
      try {
        const regionsData = await regionsAPI.getAll();
        const regionsList = Array.isArray(regionsData) ? regionsData : [];
        setRegions(regionsList);

        const provincesMap = {};
        await Promise.all(
          regionsList.map(async (region) => {
            try {
              const provincesData = await regionsAPI.getProvinces(region.id);
              provincesMap[region.id] = Array.isArray(provincesData) ? provincesData : [];
            } catch (error) {
              console.error(`Failed to fetch provinces for region ${region.id}:`, error);
              provincesMap[region.id] = [];
            }
          })
        );
        setProvincesByRegion(provincesMap);
      } catch (error) {
        console.error('Failed to fetch regions:', error);
        setRegions([]);
        setProvincesByRegion({});
      } finally {
        setLoadingRegions(false);
      }
    };

    fetchRegionsAndProvinces();
  }, []);

  useEffect(() => {
    if (!isProfileMenuOpen && !isTravelMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (travelRef.current && !travelRef.current.contains(event.target as Node)) {
        setIsTravelMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen, isTravelMenuOpen]);

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
          {/* Du lịch Dropdown */}
          <div className="relative" ref={travelRef}>
            <button
              type="button"
              onClick={() => setIsTravelMenuOpen((prev) => !prev)}
              className={clsx(
                primaryNavClass,
                'group gap-1',
                isTravelMenuOpen && 'text-gray-900'
              )}
              aria-haspopup="true"
              aria-expanded={isTravelMenuOpen}
            >
              Du lịch
              <ChevronDown className={clsx(
                'h-4 w-4 transition-transform duration-200',
                isTravelMenuOpen && 'rotate-180'
              )} />
            </button>
            
            {isTravelMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-[900px] origin-top-left transform">
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                  <div className="p-6">
                    {loadingRegions ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
                        <p className="text-sm text-gray-600">Đang tải dữ liệu...</p>
                      </div>
                    ) : regions.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-600">Không có dữ liệu vùng miền</p>
                      </div>
                    ) : (
                      <div className={`grid gap-6 ${regions.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                        {regions.map((region) => {
                          const provinces = provincesByRegion[region.id] || [];
                          const regionSlug = region.name.toLowerCase().includes('bắc') ? 'north' : 
                                           region.name.toLowerCase().includes('trung') ? 'central' : 'south';
                          
                          return (
                            <div key={region.id}>
                              <h3 className="mb-3 text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                {region.name}
                              </h3>
                              <ul className="space-y-2">
                                {provinces.slice(0, 10).map((province) => (
                                  <li key={province.id}>
                                    <Link
                                      to={`/tours?region=${regionSlug}&destination=${encodeURIComponent(province.name)}`}
                                      className="block text-sm text-gray-600 hover:text-brand-600 transition-colors"
                                      onClick={() => setIsTravelMenuOpen(false)}
                                    >
                                      {province.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Các menu khác */}
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
                    <Link
                      to="/booking-history"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-brand-50 hover:text-brand-600"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      Lịch sử đặt tour
                    </Link>
                    <Link
                      to="/my-reviews"
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-brand-50 hover:text-brand-600"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      Đánh giá của tôi
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
            {/* Du lịch mobile menu */}
            <div>
              <button
                type="button"
                onClick={() => setIsTravelMenuOpen((prev) => !prev)}
                className="flex w-full items-center justify-between text-base font-medium text-gray-700"
              >
                Du lịch
                <ChevronDown className={clsx(
                  'h-4 w-4 transition-transform duration-200',
                  isTravelMenuOpen && 'rotate-180'
                )} />
              </button>
              
              {isTravelMenuOpen && (
                <div className="mt-3 space-y-4 pl-4">
                  {loadingRegions ? (
                    <p className="text-sm text-gray-500">Đang tải...</p>
                  ) : (
                    regions.slice(0, 2).map((region) => {
                      const provinces = provincesByRegion[region.id] || [];
                      const regionSlug = region.name.toLowerCase().includes('bắc') ? 'north' : 
                                       region.name.toLowerCase().includes('trung') ? 'central' : 'south';
                      
                      return (
                        <div key={region.id}>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">{region.name}</h4>
                          <ul className="space-y-1">
                            {provinces.slice(0, 5).map((province) => (
                              <li key={province.id}>
                                <Link
                                  to={`/tours?region=${regionSlug}&destination=${encodeURIComponent(province.name)}`}
                                  className="block text-sm text-gray-600"
                                  onClick={() => {
                                    setIsMenuOpen(false);
                                    setIsTravelMenuOpen(false);
                                  }}
                                >
                                  {province.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Các menu khác */}
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
                <Link
                  to="/booking-history"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-200 hover:text-gray-900 focus-visible:border-brand-300"
                >
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  Lịch sử đặt tour
                </Link>
                <Link
                  to="/my-reviews"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-200 hover:text-gray-900 focus-visible:border-brand-300"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Đánh giá của tôi
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
