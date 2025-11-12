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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptNews, setAcceptNews] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [tempUserData, setTempUserData] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Validation functions
  const validateForm = () => {
    const errors = {};
    
    // Validate first name
    if (!firstName.trim()) {
      errors.firstName = 'Họ không được để trống';
    }
    
    // Validate last name
    if (!lastName.trim()) {
      errors.lastName = 'Tên không được để trống';
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = 'Email không được để trống';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    // Validate password
    if (!password) {
      errors.password = 'Mật khẩu không được để trống';
    } else if (password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    // Validate confirm password
    if (!confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    // Validate phone (optional but if provided, must be valid)
    if (phone && phone.trim()) {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        errors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
      }
    }
    
    // Validate username
    if (!username.trim()) {
      const derivedUsername = email ? email.split('@')[0] : '';
      if (!derivedUsername) {
        errors.username = 'Tên đăng nhập không được để trống';
      }
    } else if (username.length < 3) {
      errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    
    // Validate form first
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    const fullName = `${firstName} ${lastName}`.trim();
    const derivedUsername = username || (email ? email.split('@')[0] : '');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      
      // Step 1: Register user and send verification email
      const response = await fetch(`${apiUrl}/api/users/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: derivedUsername,
          email,
          password,
          fullName: fullName || derivedUsername,
          phoneNumber: phone || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Đăng ký thất bại');
      }

      // Save temporary user data for verification step
      setTempUserData({
        username: derivedUsername,
        email,
        fullName,
        phone,
        userId: data.userId
      });
      
      // Show verification form instead of direct login
      setShowVerification(true);
      setError(''); // Clear any previous errors
      
    } catch (err) {
      console.error('Register error:', err);
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle email verification
  const handleVerification = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      
      const response = await fetch(`${apiUrl}/api/users/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: tempUserData.email,
          code: verificationCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Mã xác nhận không đúng');
      }

      // Successful verification - login user
      localStorage.setItem('authToken', data.token || '');
      localStorage.setItem('username', tempUserData.username);
      localStorage.setItem('email', tempUserData.email);
      localStorage.setItem('fullName', tempUserData.fullName);
      if (tempUserData.phone) {
        localStorage.setItem('phoneNumber', tempUserData.phone);
      }
      if (tempUserData.userId) {
        localStorage.setItem('userId', String(tempUserData.userId));
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
      console.error('Verification error:', err);
      setError(err instanceof Error ? err.message : 'Xác thực thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend verification code
  const handleResendCode = async () => {
    setError('');
    setIsSubmitting(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      
      const response = await fetch(`${apiUrl}/api/users/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: tempUserData.email
        })
      });

      if (!response.ok) {
        throw new Error('Không thể gửi lại mã xác nhận');
      }

      setError('Mã xác nhận mới đã được gửi đến email của bạn!');
      
    } catch (err) {
      console.error('Resend error:', err);
      setError(err instanceof Error ? err.message : 'Gửi lại mã thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show verification form if email verification is required
  if (showVerification) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-slate-100 px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 shadow-soft">
          <div className="mb-8 space-y-3 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-500">
              <Mail className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-semibold text-slate-900">Xác thực email</h1>
            <p className="text-sm text-slate-500">
              Chúng tôi đã gửi mã xác nhận 6 số đến email <strong>{tempUserData?.email}</strong>
            </p>
            {error && <p className="text-sm font-medium text-danger">{error}</p>}
          </div>
          
          <form onSubmit={handleVerification}>
            <div className="mb-6">
              <InputField 
                label="Mã xác nhận" 
                placeholder="Nhập mã 6 số" 
                required 
                value={verificationCode} 
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength="6"
              />
            </div>
            
            <Button size="lg" className="w-full mb-4" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xác thực...' : 'Xác thực'}
            </Button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isSubmitting}
                className="text-sm text-primary-500 hover:text-primary-600 disabled:opacity-50"
              >
                Không nhận được mã? Gửi lại
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowVerification(false)}
              className="text-sm text-gray-500 hover:text-gray-600"
            >
              ← Quay lại đăng ký
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-slate-100 px-4 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 shadow-soft">
        <div className="mb-8 space-y-3 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <UserPlus className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-semibold text-slate-900">Tạo tài khoản BookingTour</h1>
          {error && <p className="text-sm font-medium text-danger">{error}</p>}
        </div>
        
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          {/* First Name */}
          <div>
            <InputField 
              label="Họ" 
              placeholder="Ví dụ: Nguyễn" 
              required 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)}
            />
            {validationErrors.firstName && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.firstName}</p>
            )}
          </div>
          
          {/* Last Name */}
          <div>
            <InputField 
              label="Tên" 
              placeholder="Ví dụ: Minh Anh" 
              required 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)}
            />
            {validationErrors.lastName && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.lastName}</p>
            )}
          </div>
          
          {/* Username */}
          <div className="md:col-span-2">
            <InputField 
              label="Tên đăng nhập" 
              icon={User} 
              placeholder="Username (tự động tạo từ tên nếu để trống)" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
            />
            {validationErrors.username && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.username}</p>
            )}
          </div>
          
          {/* Email */}
          <div className="md:col-span-2">
            <InputField 
              label="Email" 
              type="email" 
              icon={Mail} 
              placeholder="ban@example.com" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
            {validationErrors.email && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.email}</p>
            )}
          </div>
          
          {/* Phone */}
          <div className="md:col-span-2">
            <InputField 
              label="Số điện thoại" 
              icon={Phone} 
              placeholder="Ví dụ: 0901234567" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
            />
            {validationErrors.phone && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.phone}</p>
            )}
          </div>
          
          {/* Password */}
          <div>
            <InputField 
              label="Mật khẩu" 
              type="password" 
              placeholder="Ít nhất 6 ký tự" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
            {validationErrors.password && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.password}</p>
            )}
          </div>
          
          {/* Confirm Password */}
          <div>
            <InputField 
              label="Xác nhận mật khẩu" 
              type="password" 
              placeholder="Nhập lại mật khẩu" 
              required 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {validationErrors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.confirmPassword}</p>
            )}
          </div>
          
          {/* Submit Button */}
          <Button size="lg" className="w-full md:col-span-2" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản & Gửi mã xác thực'}
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
