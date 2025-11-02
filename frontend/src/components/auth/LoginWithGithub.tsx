import React, { useState } from 'react';

const LoginWithGithub: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    try {
      sessionStorage.setItem('oauthProvider', 'github');
      const userServiceUrl = import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8081';
      window.location.href = `${userServiceUrl}/auth/start-oauth/github`;
    } catch (err) {
      console.error('OAuth error:', err);
      alert('Failed to start GitHub login');
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#24292e] px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-[#1b1f24] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-[#24292e] disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span role="img" aria-hidden="true">
        🐙
      </span>
      {loading ? 'Đang chuyển hướng...' : 'Đăng nhập với GitHub'}
    </button>
  );
};

export default LoginWithGithub;
