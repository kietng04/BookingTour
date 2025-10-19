import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuth2Callback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [statusMessage, setStatusMessage] = useState('Processing GitHub Login...');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username');
    const email = searchParams.get('email');
    const fullName = searchParams.get('fullName');
    const avatar = searchParams.get('avatar');
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (token) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', username || '');
      localStorage.setItem('email', email || '');
      if (fullName) {
        localStorage.setItem('fullName', fullName);
      }
      if (avatar) {
        localStorage.setItem('avatar', avatar);
      }
      setStatusMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 800);
      return;
    }

    if (!code) {
      setHasError(true);
      setStatusMessage('Missing authorization code. Redirecting to login...');
      setTimeout(() => navigate('/auth/login'), 2000);
      return;
    }

    const abortController = new AbortController();
    const exchangeCodeForToken = async () => {
      try {
        setStatusMessage('Exchanging authorization code with server...');
        const userServiceUrl = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:8081';
        const response = await fetch(`${userServiceUrl}/auth/github/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(errorBody || 'GitHub OAuth exchange failed');
        }

        const data = await response.json();

        localStorage.setItem('authToken', data.token || '');
        localStorage.setItem('username', data.username || '');
        localStorage.setItem('email', data.email || '');
        if (data.fullName) {
          localStorage.setItem('fullName', data.fullName);
        }
        if (data.avatar) {
          localStorage.setItem('avatar', data.avatar);
        }

        setStatusMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 800);
      } catch (err) {
        console.error('GitHub OAuth callback error:', err);
        setHasError(true);
        setStatusMessage('GitHub login failed. Redirecting to login...');
        setTimeout(() => navigate('/auth/login'), 2000);
      }
    };

    exchangeCodeForToken();

    return () => {
      abortController.abort();
    };
  }, [searchParams, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>{hasError ? 'GitHub Login Error' : 'Processing GitHub Login...'}</h2>
        <p>{statusMessage}</p>
      </div>
    </div>
  );
};

export default OAuth2Callback;
