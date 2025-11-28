import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, refresh } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setError(null);

      if (!email.trim() || !password) {
        setError('Vui lòng nhập đầy đủ email và mật khẩu.');
        return;
      }

      setSubmitting(true);
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            username: email.trim(),
            password
          })
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          const message = payload?.error || payload?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
          throw new Error(message);
        }

        const { token, username, email: contactEmail, fullName, avatar, role = 'ADMIN', userId } = payload;

        localStorage.setItem('bt-admin-token', token);
        localStorage.setItem('bt-admin-username', username || '');
        localStorage.setItem('bt-admin-email', contactEmail || '');
        localStorage.setItem('bt-admin-fullName', fullName || '');
        localStorage.setItem('bt-admin-avatar', avatar || '');
        localStorage.setItem('bt-admin-role', role);
        localStorage.setItem('bt-admin-userId', userId?.toString() || '');
        localStorage.setItem('bt-admin-lastActivity', Date.now().toString());

        const defaultPermissions = [
          'TOUR_READ',
          'TOUR_CREATE',
          'TOUR_UPDATE',
          'TOUR_DELETE',
          'BOOKING_READ',
          'BOOKING_UPDATE',
          'BOOKING_CANCEL',
          'USER_READ',
          'USER_UPDATE',
          'DASHBOARD_READ'
        ];
        localStorage.setItem('bt-admin-permissions', JSON.stringify(defaultPermissions));

        if (!rememberMe) {
          sessionStorage.setItem('bt-admin-session-token', token);
        } else {
          sessionStorage.removeItem('bt-admin-session-token');
        }

        // Trigger AdminAuthContext to refresh from localStorage
        // This ensures the context picks up the new auth state immediately
        refresh();

        // Navigate to dashboard immediately without dispatching the event
        // The useEffect in Login component will handle the redirect after isAuthenticated updates
        navigate('/', { replace: true });
      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
      } finally {
        setSubmitting(false);
      }
    },
    [email, password, rememberMe, refresh, navigate]
  );

  const checkboxId = useMemo(() => `remember-${Math.random().toString(36).slice(2)}`, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur">
        <div className="mb-8 space-y-3 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/20 text-primary-200">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="text-2xl font-semibold">BookingTour Admin</h1>
          <p className="text-sm text-slate-200">Đăng nhập để quản lý tours, bookings, và concierge workflows.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Email / Tên đăng nhập"
            type="text"
            placeholder="Nhập email hoặc tên đăng nhập"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={submitting}
          />
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={submitting}
          />
          <label htmlFor={checkboxId} className="flex items-center gap-2 text-xs text-slate-200">
            <input
              id={checkboxId}
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="rounded border-slate-400/50 bg-transparent text-primary-500 focus:ring-primary-300"
              disabled={submitting}
            />
            Ghi nhớ đăng nhập
          </label>
          {error && <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-2 text-xs font-medium text-danger">{error}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
