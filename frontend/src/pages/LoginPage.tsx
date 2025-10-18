import React, { useState } from 'react';
import LoginWithGithub from '../components/auth/LoginWithGithub';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/api/users/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', data.username);
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>🎫 BookingTour</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Login</button>
        </form>
        <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '14px', color: '#666' }}>—— Or login with ——</div>
        <LoginWithGithub />
      </div>
    </div>
  );
};

export default LoginPage;
