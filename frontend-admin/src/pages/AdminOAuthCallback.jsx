import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminOAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refresh } = useAdminAuth();

  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Đang xử lý đăng nhập...');

  const validateAdminRole = async (token) => {
    try {
      const userServiceUrl = import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8081';
      const response = await fetch(`${userServiceUrl}/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token validation failed');
      }

      const userData = await response.json();

      if (userData.role !== 'ADMIN' && userData.role !== 'SUPER_ADMIN') {
        throw new Error('Access denied. Admin privileges required.');
      }

      return true;
    } catch (error) {
      console.error('Admin validation error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const username = searchParams.get('username');
        const email = searchParams.get('email');
        const fullName = searchParams.get('fullName');
        const avatar = searchParams.get('avatar');
        const userId = searchParams.get('userId');
        const role = searchParams.get('role');
        const error = searchParams.get('error');

        if (error) {
          setMessage(`Lỗi đăng nhập: ${decodeURIComponent(error)}`);
          setStatus('error');
          setTimeout(() => navigate('/auth/login'), 3000);
          return;
        }

        if (!token || !username) {
          setMessage('Thiếu thông tin đăng nhập. Vui lòng thử lại.');
          setStatus('error');
          setTimeout(() => navigate('/auth/login'), 3000);
          return;
        }

        localStorage.setItem('bt-admin-token', token);
        localStorage.setItem('bt-admin-username', username || '');
        localStorage.setItem('bt-admin-email', email || '');
        localStorage.setItem('bt-admin-fullName', fullName || '');
        localStorage.setItem('bt-admin-avatar', avatar || '');
        localStorage.setItem('bt-admin-role', role || 'ADMIN');
        localStorage.setItem('bt-admin-userId', userId || '');
        localStorage.setItem('bt-admin-lastActivity', Date.now().toString());

        const defaultPermissions = [
          'TOUR_READ',
          'TOUR_CREATE',
          'TOUR_UPDATE',
          'TOUR_DELETE',
          'BOOKING_READ',
          'BOOKING_UPDATE',
          'BOOKING_CANCEL',
          'USER_READ',
          'USER_UPDATE',
          'DASHBOARD_READ'
        ];

        localStorage.setItem('bt-admin-permissions', JSON.stringify(defaultPermissions));

        await validateAdminRole(token);

        sessionStorage.removeItem('oauthProvider');
        sessionStorage.removeItem('authTarget');

        refresh();

        setMessage('Đăng nhập thành công! Đang chuyển hướng...');
        setStatus('success');

        setTimeout(() => navigate('/'), 1500);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setMessage('Có lỗi xảy ra trong quá trình đăng nhập.');
        setStatus('error');
        setTimeout(() => navigate('/auth/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, refresh]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <div className="mb-4">
            {status === 'loading' && (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            )}
            {status === 'success' && (
              <div className="text-green-600">
                <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="text-red-600">
                <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-4">
            {status === 'loading' && 'Xác thực đăng nhập'}
            {status === 'success' && 'Đăng nhập thành công'}
            {status === 'error' && 'Đăng nhập thất bại'}
          </h2>

          <p className="text-gray-600 mb-4">
            {message}
          </p>

          {status === 'error' && (
            <button
              onClick={() => navigate('/auth/login')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Quay lại trang đăng nhập
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOAuthCallback;