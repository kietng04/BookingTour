import { useEffect, useState } from 'react';
import { regionsAPI } from '../../services/api';

const CustomTourDetailModal = ({ tour, onClose }) => {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    fetchRegionsAndProvinces();
  }, [tour]);

  const fetchRegionsAndProvinces = async () => {
    try {
      const regionsData = await regionsAPI.getAll();
      setRegions(regionsData || []);

      if (tour.regionId) {
        const provincesData = await regionsAPI.getProvinces(tour.regionId);
        setProvinces(provincesData || []);
      }
    } catch (err) {
      console.error('Error fetching regions/provinces:', err);
    }
  };

  const getRegionName = () => {
    const region = regions.find(r => r.id === tour.regionId);
    return region ? region.name : 'N/A';
  };

  const getProvinceName = () => {
    const province = provinces.find(p => p.id === tour.provinceId);
    return province ? province.name : 'N/A';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const classes = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      PENDING: 'Đang chờ',
      COMPLETED: 'Đã duyệt',
      REJECTED: 'Từ chối',
      CANCELLED: 'Đã hủy'
    };
    return (
      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${classes[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Chi tiết Tour Tùy Chỉnh</h2>
            <p className="text-sm text-slate-500 mt-1">Mã yêu cầu: #{tour.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Status */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Trạng thái:</span>
              {getStatusBadge(tour.status)}
            </div>
          </div>

          {/* Tour Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tên tour mong muốn
            </label>
            <div className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-slate-50 text-slate-900">
              {tour.tourName}
            </div>
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ngày khởi hành
              </label>
              <div className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-slate-50 text-slate-900">
                {formatDate(tour.startDate)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ngày kết thúc
              </label>
              <div className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-slate-50 text-slate-900">
                {formatDate(tour.endDate)}
              </div>
            </div>
          </div>

          {/* Number of People */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Số người lớn
              </label>
              <div className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-slate-50 text-slate-900">
                {tour.numAdult} người
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Số trẻ em
              </label>
              <div className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-slate-50 text-slate-900">
                {tour.numChildren} trẻ
              </div>
            </div>
          </div>

          {/* Region and Province */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Khu vực
              </label>
              <div className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-slate-50 text-slate-900">
                {getRegionName()}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tỉnh/Thành phố
              </label>
              <div className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-slate-50 text-slate-900">
                {getProvinceName()}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mô tả chi tiết
            </label>
            <div className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-slate-50 text-slate-900 min-h-[100px] whitespace-pre-wrap">
              {tour.description || 'Không có mô tả'}
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Ngày tạo
              </label>
              <div className="text-sm text-slate-700">
                {tour.createdAt ? formatDate(tour.createdAt) : 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Cập nhật lần cuối
              </label>
              <div className="text-sm text-slate-700">
                {tour.updatedAt ? formatDate(tour.updatedAt) : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full bg-slate-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomTourDetailModal;
