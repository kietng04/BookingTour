import React, { useState } from 'react';

const LoginWithGoogle: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    try {
      sessionStorage.setItem('oauthProvider', 'google');
      const userServiceUrl = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:8081';
      window.location.href = `${userServiceUrl}/auth/start-oauth/google`;
    } catch (err) {
      console.error('OAuth error:', err);
      alert('Failed to start Google login');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        width: '100%',
        padding: '10px 20px',
        backgroundColor: '#ffffff',
        color: '#444',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
        marginTop: '10px',
      }}
    >
      {loading ? 'Redirecting...' : '🔴 Login with Google'}
    </button>
  );
};

export default LoginWithGoogle;

