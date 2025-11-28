import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LockKeyhole, Mail } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import InputField from '../components/common/InputField.jsx';
import { useAuth } from '../context/AuthContext.tsx';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleGitHubLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    window.location.href = `${apiUrl}/api/users/auth/start-oauth/github`;
  };

  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    window.location.href = `${apiUrl}/api/users/auth/start-oauth/google`;
  };

  return (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-12">
    <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-soft">
      <div className="mb-8 space-y-3 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-500">
          <LockKeyhole className="h-5 w-5" />
        </span>
        <h1 className="text-2xl font-semibold text-slate-900">Chào mừng trở lại</h1>
        <p className="text-sm text-slate-500">Quản lý lịch trình đã lưu, tour yêu thích và trao đổi cùng concierge.</p>
      </div>
      <form className="space-y-5">
        <InputField label="Email" type="email" icon={Mail} placeholder="ban@example.com" required />
        <InputField label="Mật khẩu" type="password" placeholder="••••••••" required />
        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2 text-slate-500">
            <input type="checkbox" className="rounded border-slate-300 text-primary-500 focus:ring-primary-500" />
            Ghi nhớ đăng nhập
          </label>
          <Link to="/auth/forgot" className="font-medium text-primary-500">Quên mật khẩu?</Link>
        </div>
        <Button size="lg" className="w-full">
          Đăng nhập
        </Button>
      </form>
      
      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 border-t border-slate-200"></div>
        <span className="text-sm text-slate-500">Hoặc tiếp tục bằng</span>
        <div className="flex-1 border-t border-slate-200"></div>
      </div>
      
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGitHubLogin}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Đăng nhập với GitHub
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Đăng nhập với Google
        </button>
      </div>
      
      <p className="mt-6 text-center text-sm text-slate-500">
        Mới tham gia BookingTour?{' '}
        <Link to="/auth/register" className="font-semibold text-primary-500">Tạo tài khoản</Link>
      </p>
    </div>
  </div>
  );
};

export default Login;
