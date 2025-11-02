import React, { useState } from 'react';

const LoginWithGoogle: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    try {
      sessionStorage.setItem('oauthProvider', 'google');
      const userServiceUrl = import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8081';
      window.location.href = `${userServiceUrl}/auth/start-oauth/google`;
    } catch (err) {
      console.error('OAuth error:', err);
      alert('Failed to start Google login');
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-soft transition hover:border-brand-200 hover:text-brand-600 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-brand-200 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span role="img" aria-hidden="true">
        🔴
      </span>
      {loading ? 'Đang chuyển hướng...' : 'Đăng nhập với Google'}
    </button>
  );
};

export default LoginWithGoogle;

