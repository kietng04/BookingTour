import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import Button from '../common/Button.jsx';

const MobileMenu = ({ open, onClose, navigation }) => (
  <div className={`fixed inset-0 z-50 bg-black/30 transition-opacity lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
    <aside className={`absolute inset-y-0 left-0 flex w-80 flex-col gap-6 bg-white p-6 shadow-xl transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold text-primary-600" onClick={onClose}>
          BookingTour
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex flex-col gap-4">
        {navigation.map((item) => (
          <Link key={item.to} to={item.to} className="text-base font-medium text-slate-600 hover:text-primary-600" onClick={onClose}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-3">
        <Button to="/auth/login" variant="ghost" onClick={onClose}>
          Log in
        </Button>
        <Button to="/auth/register" onClick={onClose}>
          Create account
        </Button>
      </div>
    </aside>
  </div>
);

MobileMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  navigation: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired
    })
  ).isRequired
};

export default MobileMenu;
