import { useEffect, useState } from 'react';
import { customTourService } from '../../services/customTourService';

const CustomTourList = () => {
  const [customTours, setCustomTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    fetchCustomTours();
  }, [statusFilter]);

  const fetchCustomTours = async () => {
    setLoading(true);
    try {
      const data = await customTourService.getAllCustomTours(statusFilter || null);
      setCustomTours(data.content || data || []);
    } catch (error) {
      console.error('Error fetching custom tours:', error);
      // Don't show alert for empty data, just set empty array
      setCustomTours([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm('Xác nhận duyệt tour tùy chỉnh này?')) return;

    setProcessing(prev => ({ ...prev, [id]: true }));
    try {
      await customTourService.updateCustomTourStatus(id, { status: 'COMPLETED' });
      alert('Đã duyệt tour thành công!');
      fetchCustomTours();
    } catch (error) {
      alert('Lỗi khi duyệt tour: ' + error.message);
    } finally {
      setProcessing(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Xác nhận từ chối tour tùy chỉnh này?')) return;

    setProcessing(prev => ({ ...prev, [id]: true }));
    try {
      await customTourService.updateCustomTourStatus(id, { status: 'REJECTED' });
      alert('Đã từ chối tour!');
      fetchCustomTours();
    } catch (error) {
      alert('Lỗi khi từ chối tour: ' + error.message);
    } finally {
      setProcessing(prev => ({ ...prev, [id]: false }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const classes = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    const labels = {
      PENDING: 'Đang chờ',
      COMPLETED: 'Đã duyệt',
      REJECTED: 'Từ chối'
    };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${classes[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Tour Tùy Chỉnh</h1>
        <p className="text-sm text-slate-500">Quản lý yêu cầu tour tùy chỉnh từ khách hàng</p>
      </div>

      {/* Filter */}
      <div className="flex gap-4 items-center bg-white rounded-lg shadow p-4">
        <label className="text-sm font-medium text-slate-700">Lọc theo trạng thái:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Tất cả</option>
          <option value="PENDING">Đang chờ</option>
          <option value="COMPLETED">Đã duyệt</option>
          <option value="REJECTED">Từ chối</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : customTours.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-slate-600">Không có yêu cầu nào</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tên Tour
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Số người
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ngày đi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {customTours.map((tour) => (
                <tr key={tour.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    #{tour.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                    {tour.tourName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {tour.numAdult} người lớn, {tour.numChildren} trẻ em
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {formatDate(tour.startDate)} - {formatDate(tour.endDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(tour.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      {tour.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(tour.id)}
                            disabled={processing[tour.id]}
                            className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            {processing[tour.id] ? 'Đang xử lý...' : 'Xác nhận'}
                          </button>
                          <button
                            onClick={() => handleReject(tour.id)}
                            disabled={processing[tour.id]}
                            className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 disabled:opacity-50"
                          >
                            {processing[tour.id] ? 'Đang xử lý...' : 'Từ chối'}
                          </button>
                        </>
                      )}
                      {tour.status !== 'PENDING' && (
                        <span className="text-slate-400 text-xs italic">Đã xử lý</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomTourList;
