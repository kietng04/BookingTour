import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Mail, Phone, UserPlus, User } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import InputField from '../components/common/InputField.jsx';

const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptNews, setAcceptNews] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const fullName = `${firstName} ${lastName}`.trim();
    const derivedUsername = username || (email ? email.split('@')[0] : '');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/users/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: derivedUsername,
          email,
          password,
          fullName: fullName || derivedUsername
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Đăng ký thất bại');
      }

      localStorage.setItem('authToken', data.token || '');
      localStorage.setItem('username', data.username || derivedUsername);
      localStorage.setItem('email', data.email || email);
      if (fullName) {
        localStorage.setItem('fullName', fullName);
      }
      if (phone) {
        localStorage.setItem('phoneNumber', phone);
      }
      if (data.userId !== undefined && data.userId !== null) {
        localStorage.setItem('userId', String(data.userId));
      }
      localStorage.setItem('authProvider', 'local');
      window.dispatchEvent(new Event('auth-changed'));

      if (acceptNews) {
        localStorage.setItem('marketingOptIn', 'true');
      } else {
        localStorage.removeItem('marketingOptIn');
      }

      navigate('/', { replace: true });
    } catch (err) {
      console.error('Register error:', err);
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-slate-100 px-4 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 shadow-soft">
        <div className="mb-8 space-y-3 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <UserPlus className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-semibold text-slate-900">Tạo tài khoản BookingTour</h1>
          <p className="text-sm text-slate-500">Lưu hành trình, nhận gợi ý cá nhân hoá và trò chuyện cùng concierge.</p>
          {error && <p className="text-sm font-medium text-danger">{error}</p>}
        </div>
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <InputField label="Họ" placeholder="Ví dụ: Nguyễn" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <InputField label="Tên" placeholder="Ví dụ: Minh Anh" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <InputField label="Tên đăng nhập" icon={User} placeholder="Username" required className="md:col-span-2" value={username} onChange={(e) => setUsername(e.target.value)} />
          <InputField label="Email" type="email" icon={Mail} placeholder="ban@example.com" required className="md:col-span-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputField label="Số điện thoại" icon={Phone} placeholder="Ví dụ: 0901 234 567" className="md:col-span-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <InputField label="Mật khẩu" type="password" placeholder="Nhập mật khẩu mạnh" className="md:col-span-2" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <label className="flex items-start gap-3 text-xs text-slate-500 md:col-span-2">
            <input type="checkbox" className="mt-1 rounded border-slate-300 text-primary-500 focus:ring-primary-500" checked={acceptNews} onChange={(e) => setAcceptNews(e.target.checked)} />
            Nhận bản tin trải nghiệm và ưu đãi mở bán sớm.
          </label>
          <Button size="lg" className="w-full md:col-span-2" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Đã có tài khoản?{' '}
          <Link to="/auth/login" className="font-semibold text-primary-500">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
