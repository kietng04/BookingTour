import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Trash2, Eye } from 'lucide-react';
import api from '../../services/api';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useToast } from '../../context/ToastContext';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', tourId: '', minRating: '' });
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchReviews();
  }, [filters]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.tourId) params.tourId = filters.tourId;
      if (filters.minRating) params.minRating = filters.minRating;

      const data = await api.reviews.getAll(params);
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      toast?.showToast?.('Không thể tải danh sách đánh giá', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    if (!window.confirm('Phê duyệt đánh giá này?')) return;
    try {
      await api.reviews.updateStatus(reviewId, 'APPROVED');
      toast?.showToast?.('Đã phê duyệt đánh giá', 'success');
      fetchReviews();
    } catch (error) {
      toast?.showToast?.('Không thể phê duyệt', 'error');
    }
  };

  const handleReject = async (reviewId) => {
    if (!window.confirm('Từ chối đánh giá này?')) return;
    try {
      await api.reviews.updateStatus(reviewId, 'REJECTED');
      toast?.showToast?.('Đã từ chối đánh giá', 'success');
      fetchReviews();
    } catch (error) {
      toast?.showToast?.('Không thể từ chối', 'error');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Xóa đánh giá này? Hành động không thể hoàn tác.')) return;
    try {
      await api.reviews.delete(reviewId);
      toast?.showToast?.('Đã xóa đánh giá', 'success');
      fetchReviews();
    } catch (error) {
      toast?.showToast?.('Không thể xóa', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      PENDING: { variant: 'warning', label: 'Chờ duyệt' },
      APPROVED: { variant: 'success', label: 'Đã duyệt' },
      REJECTED: { variant: 'error', label: 'Từ chối' }
    };
    const config = map[status] || map.PENDING;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const columns = [
    { key: 'id', label: 'ID', render: (val) => `#${val}` },
    { key: 'tourName', label: 'Tour', render: (val, row) => val || `Tour #${row.tourId}` },
    { key: 'guestName', label: 'Người đánh giá' },
    { key: 'rating', label: 'Rating', render: (val) => `${parseFloat(val).toFixed(1)}⭐` },
    { key: 'status', label: 'Trạng thái', render: (val) => getStatusBadge(val) },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      render: (val) => new Date(val).toLocaleDateString('vi-VN')
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => { setSelectedReview(row); setShowModal(true); }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
            title="Xem chi tiết"
          >
            <Eye className="h-4 w-4" />
          </button>
          {row.status !== 'APPROVED' && (
            <button
              onClick={() => handleApprove(row.id)}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded"
              title="Phê duyệt"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
          {row.status !== 'REJECTED' && (
            <button
              onClick={() => handleReject(row.id)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
              title="Từ chối"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 text-gray-600 hover:bg-gray-50 rounded"
            title="Xóa"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý đánh giá</h1>
          <p className="text-sm text-slate-600 mt-1">Kiểm duyệt và quản lý đánh giá từ khách hàng</p>
        </div>
      </div>

      <Card>
        <div className="flex gap-4 mb-6">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECTED">Từ chối</option>
          </select>

          <select
            value={filters.minRating}
            onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
          >
            <option value="">Tất cả rating</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao trở lên</option>
            <option value="3">3 sao trở lên</option>
          </select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({ status: '', tourId: '', minRating: '' })}
          >
            Đặt lại
          </Button>
        </div>

        <Table columns={columns} data={reviews} loading={loading} emptyMessage="Không có đánh giá" />
      </Card>

      {showModal && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Chi tiết đánh giá #{selectedReview.id}</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Tour:</span>
                  <span className="font-medium">{selectedReview.tourName || `Tour #${selectedReview.tourId}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Người đánh giá:</span>
                  <span className="font-medium">{selectedReview.guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Rating:</span>
                  <span className="font-medium">{parseFloat(selectedReview.rating).toFixed(1)} ⭐</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Trạng thái:</span>
                  {getStatusBadge(selectedReview.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Ngày tạo:</span>
                  <span>{new Date(selectedReview.createdAt).toLocaleString('vi-VN')}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <p className="text-sm font-medium text-slate-700 mb-2">Tiêu đề:</p>
                <p className="text-sm text-slate-900">{selectedReview.title}</p>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <p className="text-sm font-medium text-slate-700 mb-2">Nội dung:</p>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedReview.comment}</p>
              </div>

              {selectedReview.badges && selectedReview.badges.length > 0 && (
                <div className="pt-3 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-2">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedReview.badges.map((badge) => (
                      <Badge key={badge} variant="outline">{badge}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                {selectedReview.status !== 'APPROVED' && (
                  <Button onClick={() => { handleApprove(selectedReview.id); setShowModal(false); }} className="flex-1">
                    Phê duyệt
                  </Button>
                )}
                {selectedReview.status !== 'REJECTED' && (
                  <Button onClick={() => { handleReject(selectedReview.id); setShowModal(false); }} variant="ghost" className="flex-1">
                    Từ chối
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
