import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import Button from '../common/Button.jsx';
import { useAuth } from '../../context/AuthContext.tsx';

const MobileMenu = ({ open, onClose, navigation }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = (user?.fullName || user?.username || user?.email || '').trim() || 'Khách du lịch';
  const avatar = user?.avatar;
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black/30 transition-opacity lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
      <aside className={`absolute inset-y-0 left-0 flex w-80 flex-col gap-6 bg-white p-6 shadow-xl transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold text-primary-600" onClick={onClose}>
            BookingTour Việt Nam
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            {avatar ? (
              <img
                src={avatar}
                alt={displayName}
                className="h-12 w-12 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-base font-semibold text-primary-600">
                {initials || 'BT'}
              </span>
            )}
            <div className="flex flex-col text-sm leading-tight">
              <span className="text-base font-semibold text-slate-900">{displayName}</span>
              {user?.email && <span className="text-xs text-slate-500">{user.email}</span>}
            </div>
          </div>
        )}

        <nav className="flex flex-col gap-4">
          {navigation.map((item) => (
            <Link key={item.to} to={item.to} className="text-base font-medium text-slate-600 hover:text-primary-600" onClick={onClose}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          {isAuthenticated ? (
            <>
              <Button to="/profile" variant="ghost" onClick={onClose}>
                Hồ sơ cá nhân
              </Button>
              <Button variant="danger" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button to="/auth/login" variant="ghost" onClick={onClose}>
                Đăng nhập
              </Button>
              <Button to="/auth/register" onClick={onClose}>
                Tạo tài khoản
              </Button>
            </>
          )}
        </div>
      </aside>
    </div>
  );
};

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
