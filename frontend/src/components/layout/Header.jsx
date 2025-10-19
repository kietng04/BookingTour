import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import Button from '../common/Button.jsx';
import MobileMenu from './MobileMenu.jsx';

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'Tours', to: '/tours' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'My Bookings', to: '/profile' }
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 text-2xl font-semibold text-primary-600">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">BT</span>
          BookingTour
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
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <Button to="/auth/login" variant="ghost">Log in</Button>
          <Button to="/auth/register">Sign up</Button>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} navigation={navigation} />
      </div>
    </header>
  );
};

export default Header;
