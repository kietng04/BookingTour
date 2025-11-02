import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import LoginWithGithub from '../components/auth/LoginWithGithub';
import LoginWithGoogle from '../components/auth/LoginWithGoogle';
import { useAuth } from '../context/AuthContext.tsx';

const featureHighlights = [
  'Bảo mật thanh toán chuẩn ngân hàng châu Âu',
  'Ưu đãi dành riêng cho thành viên thân thiết',
  'Quản lý lịch trình và thanh toán chỉ với một cú chạm',
];

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = (location.state as { from?: string })?.from || '/';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/api/users/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('authToken', data.token || '');
        localStorage.setItem('username', data.username || username);
        localStorage.setItem('email', data.email || '');
        if (data.fullName) {
          localStorage.setItem('fullName', data.fullName);
        } else {
          localStorage.removeItem('fullName');
        }
        if (data.avatar) {
          localStorage.setItem('avatar', data.avatar);
        } else {
          localStorage.removeItem('avatar');
        }
        if (data.userId !== undefined && data.userId !== null) {
          localStorage.setItem('userId', String(data.userId));
        }
        localStorage.setItem('authProvider', 'local');
        window.dispatchEvent(new Event('auth-changed'));
        const redirectTo = (location.state as { from?: string })?.from || '/';
        navigate(redirectTo, { replace: true });
      } else {
        setError(data.error || data.message || 'Đăng nhập không thành công.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Không thể kết nối tới máy chủ. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-brand-25 via-white to-slate-100">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-brand-100 blur-3xl opacity-70" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-accent/20 blur-[140px]" />

      <div className="container relative z-10 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_minmax(0,1fr)] lg:items-center">
          <section className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-500 shadow-soft backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Đăng nhập an toàn
            </div>

            <div className="space-y-5">
              <h1 className="max-w-xl text-4xl font-semibold text-slate-900 sm:text-5xl">
                Chào mừng trở lại BookingTour
              </h1>
              <p className="max-w-2xl text-base text-slate-600">
                Đồng bộ hành trình, giữ trạng thái tour yêu thích và thanh toán chỉ trong vài phút.
                Kích hoạt tài khoản để nhận những ưu đãi độc quyền cho mùa du lịch mới.
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {featureHighlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/40 bg-white/70 p-4 text-sm text-slate-600 shadow-soft backdrop-blur transition hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="relative">
            <div className="absolute inset-0 -translate-y-6 translate-x-6 rounded-3xl bg-brand-100/40 blur-3xl" aria-hidden />
            <div className="relative rounded-3xl border border-white/60 bg-white/90 p-8 shadow-card backdrop-blur">
              <div className="space-y-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-500">
                  Đăng nhập tài khoản
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Cùng tiếp tục hành trình của bạn
                </h2>
                <p className="text-sm text-slate-500">
                  Nhập thông tin để quản lý đơn, thanh toán và nhận ưu đãi. Chúng tôi bảo vệ dữ liệu của bạn bằng chuẩn mã hóa AES-256.
                </p>
              </div>

              {error && (
                <div className="mt-6 rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger shadow-soft">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="mt-6 space-y-5">
                <div className="space-y-2 text-left">
                  <label htmlFor="username" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                    Tên đăng nhập
                  </label>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 transition focus:border-brand-300 focus:ring-2 focus:ring-brand-200"
                    placeholder="ví dụ: linh.tran"
                    required
                  />
                </div>

                <div className="space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Mật khẩu
                    </label>
                    <a href="#" className="text-xs font-medium text-brand-500 hover:text-brand-600">
                      Quên mật khẩu?
                    </a>
                  </div>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 transition focus:border-brand-300 focus:ring-2 focus:ring-brand-200"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-accent transition hover:bg-brand-600 focus-visible:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                  Hoặc
                </span>
                <span className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="grid gap-3">
                <LoginWithGithub />
                <LoginWithGoogle />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
