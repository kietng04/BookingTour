import { useState } from 'react';

const CustomTourDetailModal = ({ tour, onClose, onStatusUpdate }) => {
  const [status, setStatus] = useState(tour.status);
  const [adminNotes, setAdminNotes] = useState(tour.adminNotes || '');

  const handleSubmit = () => {
    if (status === 'PENDING' && !adminNotes.trim()) {
      alert('Vui lòng nhập ghi chú khi chuyển trạng thái');
      return;
    }
    onStatusUpdate(tour.id, status, adminNotes);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Chi tiết yêu cầu #{tour.id}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Gửi lúc: {new Date(tour.createdAt).toLocaleString('vi-VN')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Destination and Travel Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Điểm đến
                </label>
                <p className="text-slate-900 font-semibold text-lg">{tour.destination}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Số người
                </label>
                <p className="text-slate-900">{tour.numberOfPeople} người</p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ngày khởi hành
                </label>
                <p className="text-slate-900">{formatDate(tour.startDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ngày kết thúc
                </label>
                <p className="text-slate-900">{formatDate(tour.endDate)}</p>
              </div>
            </div>

            {/* Budget */}
            {tour.budgetRange && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ngân sách dự kiến
                </label>
                <p className="text-slate-900">{tour.budgetRange}</p>
              </div>
            )}

            {/* Contact Info */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Thông tin liên hệ
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Email</label>
                  <p className="text-slate-900">{tour.contactEmail}</p>
                </div>
                {tour.contactPhone && (
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Số điện thoại</label>
                    <p className="text-slate-900">{tour.contactPhone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Special Request */}
            {tour.specialRequest && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Yêu cầu đặc biệt
                </label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-slate-900 whitespace-pre-wrap">{tour.specialRequest}</p>
                </div>
              </div>
            )}

            <hr className="border-slate-200" />

            {/* Status Update Section */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Trạng thái
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="PENDING">Đang chờ xử lý</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="REJECTED">Từ chối</option>
              </select>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ghi chú của admin
                {status !== 'PENDING' && <span className="text-red-500 ml-1">*</span>}
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows="4"
                placeholder="Nhập phản hồi cho khách hàng..."
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                {status === 'COMPLETED'
                  ? 'Hãy thông báo chi tiết về tour đã được thiết kế và hướng dẫn tiếp theo cho khách hàng.'
                  : status === 'REJECTED'
                  ? 'Hãy giải thích lý do từ chối một cách lịch sự và đề xuất phương án thay thế nếu có.'
                  : 'Ghi chú này sẽ được gửi đến khách hàng nếu bạn thay đổi trạng thái.'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Cập nhật
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-slate-200 text-slate-800 py-3 rounded-lg font-semibold hover:bg-slate-300 transition"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomTourDetailModal;
