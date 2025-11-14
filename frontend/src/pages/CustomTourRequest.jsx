import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customTourAPI } from '../services/customTourService';

const CustomTourRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    numberOfPeople: 1,
    specialRequest: '',
    contactEmail: '',
    contactPhone: '',
    budgetRange: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

      await customTourAPI.create(userId, formData, token);

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
        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Điểm đến mong muốn <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="destination"
            required
            placeholder="VD: Hà Giang, Phú Quốc, Đà Lạt..."
            value={formData.destination}
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số người <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="numberOfPeople"
            min="1"
            max="50"
            required
            value={formData.numberOfPeople}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Budget Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngân sách dự kiến
          </label>
          <select
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Chọn mức ngân sách</option>
            <option value="Under 10M">Dưới 10 triệu</option>
            <option value="10M-20M">10-20 triệu</option>
            <option value="20M-50M">20-50 triệu</option>
            <option value="50M+">Trên 50 triệu</option>
          </select>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email liên hệ <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="contactEmail"
              required
              placeholder="email@example.com"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="contactPhone"
              placeholder="0901234567"
              pattern="[0-9]{10,11}"
              value={formData.contactPhone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Special Request */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Yêu cầu đặc biệt
          </label>
          <textarea
            name="specialRequest"
            rows="4"
            placeholder="VD: Cần hướng dẫn viên tiếng Anh, muốn khám phá ẩm thực địa phương, có trẻ nhỏ đi cùng..."
            value={formData.specialRequest}
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
