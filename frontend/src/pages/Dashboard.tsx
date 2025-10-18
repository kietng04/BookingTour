import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/auth/login');
      return;
    }
    setUsername(localStorage.getItem('username') || '');
    setEmail(localStorage.getItem('email') || '');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header style={{ backgroundColor: '#2c3e50', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>🎫 BookingTour Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
      </header>
      <main style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Welcome! 👋</h2>
          <p style={{ margin: '10px 0', fontSize: '16px' }}><strong>Username:</strong> {username}</p>
          <p style={{ margin: '10px 0', fontSize: '16px' }}><strong>Email:</strong> {email}</p>
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#ecf0f1', borderRadius: '4px' }}>
            <h3 style={{ color: '#2c3e50', marginTop: 0 }}>🔐 Authenticated</h3>
            <p style={{ color: '#666', margin: '10px 0' }}>You have successfully logged in!</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
