import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Globe2, PhoneCall } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { label: 'Tours', to: '/tours' },
  { label: 'Destinations', to: '/destinations' },
  { label: 'Experiences', to: '/experiences' },
  { label: 'Stories', to: '/stories' },
  { label: 'Support', to: '/support' },
];

const primaryNavClass =
  'relative inline-flex items-center text-sm font-medium text-gray-600 transition hover:text-gray-900 focus-visible:text-gray-900';

const SiteHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
      <a
        href="#main-content"
        className="absolute left-3 top-3 z-[100] -translate-y-20 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg focus-visible:translate-y-0 focus-visible:outline-none"
      >
        Skip to content
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
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  primaryNavClass,
                  isActive && 'text-gray-900 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-brand-500 after:content-[""]'
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
            EN
          </button>
          <Link
            to="/auth/login"
            className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-200 hover:text-gray-900 focus-visible:border-brand-300"
          >
            Log in
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-brand-600 focus-visible:bg-brand-600"
          >
            Host Portal
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex items-center rounded-full border border-gray-200 p-2 text-gray-700 transition hover:border-brand-200 hover:text-brand-600 focus-visible:border-brand-300 focus-visible:text-brand-600 lg:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle navigation</span>
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
          <nav className="grid gap-4" aria-label="Mobile navigation">
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
              href="tel:+442012345678"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600"
            >
              <PhoneCall className="h-4 w-4 text-brand-500" aria-hidden="true" />
              +44 20 1234 5678
            </a>
            <Link
              to="/auth/login"
              className="inline-flex items-center justify-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-200 hover:text-gray-900 focus-visible:border-brand-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Log in
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-brand-600 focus-visible:bg-brand-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Host Portal
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
