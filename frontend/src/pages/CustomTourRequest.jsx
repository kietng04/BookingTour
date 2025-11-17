import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customTourAPI } from '../services/customTourService';
import { regionsAPI } from '../services/api';

const CustomTourRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tourName: '',
    startDate: '',
    endDate: '',
    numAdult: 1,
    numChildren: 0,
    regionId: '',
    provinceId: '',
    description: ''
  });
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    if (formData.regionId) {
      fetchProvinces(formData.regionId);
    } else {
      setProvinces([]);
      setFormData(prev => ({ ...prev, provinceId: '' }));
    }
  }, [formData.regionId]);

  const fetchRegions = async () => {
    try {
      const data = await regionsAPI.getAll();
      setRegions(data || []);
    } catch (err) {
      console.error('Error fetching regions:', err);
    }
  };

  const fetchProvinces = async (regionId) => {
    try {
      const data = await regionsAPI.getProvinces(regionId);
      setProvinces(data || []);
    } catch (err) {
      console.error('Error fetching provinces:', err);
      setProvinces([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get userId from localStorage (assuming it's stored there after login)
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId) {
        setError('Vui lòng đăng nhập để gửi yêu cầu');
        return;
      }

      // Format data to match backend DTO
      const requestData = {
        tourName: formData.tourName,
        numAdult: parseInt(formData.numAdult, 10),
        numChildren: parseInt(formData.numChildren, 10),
        regionId: formData.regionId ? parseInt(formData.regionId, 10) : null,
        provinceId: formData.provinceId ? parseInt(formData.provinceId, 10) : null,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description || null
      };

      await customTourAPI.create(userId, requestData, token);

      alert('Yêu cầu tour tùy chỉnh đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
      navigate('/my-custom-tours');
    } catch (err) {
      console.error('Error creating custom tour:', err);
      setError(err.message || 'Có lỗi xảy ra khi gửi yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Yêu cầu Tour Tùy Chỉnh
        </h1>
        <p className="text-gray-600">
          Gửi cho chúng tôi ý tưởng của bạn, team tư vấn sẽ thiết kế tour riêng phù hợp với nhu cầu của bạn
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Tour Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên tour mong muốn <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="tourName"
            required
            placeholder="VD: Khám phá Hà Giang 3N2Đ, Tour Phú Quốc nghỉ dưỡng..."
            value={formData.tourName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Dates */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày khởi hành <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              required
              value={formData.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày kết thúc <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              required
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Number of People */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số người lớn <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="numAdult"
              min="1"
              max="50"
              required
              value={formData.numAdult}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số trẻ em <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="numChildren"
              min="0"
              max="50"
              required
              value={formData.numChildren}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Region and Province */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khu vực
            </label>
            <select
              name="regionId"
              value={formData.regionId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Chọn khu vực</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tỉnh/Thành phố
            </label>
            <select
              name="provinceId"
              value={formData.provinceId}
              onChange={handleChange}
              disabled={!formData.regionId || provinces.length === 0}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả chi tiết
          </label>
          <textarea
            name="description"
            rows="4"
            placeholder="VD: Cần hướng dẫn viên tiếng Anh, muốn khám phá ẩm thực địa phương, có trẻ nhỏ đi cùng..."
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Mô tả chi tiết về sở thích, nhu cầu đặc biệt của bạn để chúng tôi có thể tư vấn tốt nhất
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-brand-500 text-white py-3 rounded-lg font-semibold hover:bg-brand-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/tours')}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomTourRequest;
