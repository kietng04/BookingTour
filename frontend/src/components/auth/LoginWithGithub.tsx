import React, { useState } from 'react';

const LoginWithGithub: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    try {
      // Call user-service directly to bypass API Gateway routing issues
      // In Docker, this will resolve to the user-service container
      // In local dev, this goes to localhost:8081
      const userServiceUrl = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:8081';
      window.location.href = `${userServiceUrl}/auth/start-oauth/github`;
    } catch (err) {
      console.error('OAuth error:', err);
      alert('Failed to start GitHub login');
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading} style={{ width: '100%', padding: '10px 20px', backgroundColor: '#24292e', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
      {loading ? 'Redirecting...' : '🐙 Login with GitHub'}
    </button>
  );
};

export default LoginWithGithub;
