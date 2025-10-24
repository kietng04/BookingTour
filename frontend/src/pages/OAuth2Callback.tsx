import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuth2Callback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [statusMessage, setStatusMessage] = useState('Processing OAuth Login...');
  const [hasError, setHasError] = useState(false);
  const [providerLabel, setProviderLabel] = useState('GitHub');

  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username');
    const email = searchParams.get('email');
    const fullName = searchParams.get('fullName');
    const avatar = searchParams.get('avatar');
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const providerParam = searchParams.get('provider');
    const rememberedProvider = sessionStorage.getItem('oauthProvider');
    const resolvedProvider = (providerParam || rememberedProvider || 'github').toLowerCase();
    const resolvedLabel = resolvedProvider === 'google' ? 'Google' : 'GitHub';

    setProviderLabel(resolvedLabel);
    setStatusMessage(`Processing ${resolvedLabel} Login...`);

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
      localStorage.setItem('authProvider', resolvedProvider);
      window.dispatchEvent(new Event('auth-changed'));
      sessionStorage.removeItem('oauthProvider');
      setStatusMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 800);
      return;
    }

    if (!code) {
      setHasError(true);
      setStatusMessage('Missing authorization code. Redirecting to login...');
      sessionStorage.removeItem('oauthProvider');
      setTimeout(() => navigate('/auth/login'), 2000);
      return;
    }

    const abortController = new AbortController();
    const exchangeCodeForToken = async () => {
      try {
        setStatusMessage('Exchanging authorization code with server...');
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
        const callbackPath = resolvedProvider === 'google' ? '/api/users/auth/google/callback' : '/api/users/auth/github/callback';
        const response = await fetch(`${apiUrl}${callbackPath}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(errorBody || `${resolvedLabel} OAuth exchange failed`);
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
        localStorage.setItem('authProvider', resolvedProvider);
        window.dispatchEvent(new Event('auth-changed'));

        sessionStorage.removeItem('oauthProvider');
        setStatusMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 800);
      } catch (err) {
        console.error(`${resolvedLabel} OAuth callback error:`, err);
        setHasError(true);
        setStatusMessage(`${resolvedLabel} login failed. Redirecting to login...`);
        sessionStorage.removeItem('oauthProvider');
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
        <h2>{hasError ? `${providerLabel} Login Error` : `Processing ${providerLabel} Login...`}</h2>
        <p>{statusMessage}</p>
      </div>
    </div>
  );
};

export default OAuth2Callback;
