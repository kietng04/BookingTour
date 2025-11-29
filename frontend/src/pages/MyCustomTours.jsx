import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { customTourAPI } from '../services/customTourService';

const MyCustomTours = () => {
  const [customTours, setCustomTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomTours();
  }, []);

  const fetchCustomTours = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('authToken');

      if (!userId) {
        setError('Vui lòng đăng nhập để xem yêu cầu của bạn');
        setLoading(false);
        return;
      }

      const data = await customTourAPI.getByUserId(userId, token);
      setCustomTours(data);
    } catch (err) {
      console.error('Error fetching custom tours:', err);
      setError(err.message || 'Không thể tải danh sách yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      COMPLETED: 'bg-green-100 text-green-800 border-green-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200'
    };
    const labels = {
      PENDING: 'Đang xử lý',
      COMPLETED: 'Hoàn thành',
      REJECTED: 'Từ chối'
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || ''}`}>
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tour Tùy Chỉnh Của Tôi</h1>
          <p className="text-gray-600 mt-1">Quản lý các yêu cầu tour tùy chỉnh của bạn</p>
        </div>
        <Link
          to="/custom-tour-request"
          className="bg-brand-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-600 transition"
        >
          + Yêu cầu tour mới
        </Link>
      </div>

      {customTours.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="max-w-md mx-auto">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có yêu cầu tour nào
            </h3>
            <p className="text-gray-600">
              Hiện tại bạn chưa có yêu cầu tour tùy chỉnh nào.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {customTours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {tour.tourName}
                    </h3>
                    {getStatusBadge(tour.status)}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(tour.startDate)} - {formatDate(tour.endDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {tour.numAdult} người lớn{tour.numChildren > 0 && `, ${tour.numChildren} trẻ em`}
                    </span>
                  </div>
                </div>
              </div>

              {tour.description && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Mô tả chi tiết:</h4>
                  <p className="text-sm text-gray-600 line-clamp-3">{tour.description}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                <span>
                  Gửi lúc: {new Date(tour.createdAt).toLocaleString('vi-VN')}
                </span>
                {tour.updatedAt && tour.updatedAt !== tour.createdAt && (
                  <span>
                    Cập nhật: {new Date(tour.updatedAt).toLocaleString('vi-VN')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCustomTours;
