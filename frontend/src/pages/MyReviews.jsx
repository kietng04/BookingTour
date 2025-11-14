import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Edit2, Trash2, Star, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { reviewsAPI } from '../services/api.js';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import SectionTitle from '../components/common/SectionTitle.jsx';
import Badge from '../components/common/Badge.jsx';
import RatingStars from '../components/common/RatingStars.jsx';
import { formatDate } from '../utils/format.js';
import clsx from 'clsx';

const EditReviewModal = ({ review, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    rating: parseFloat(review.rating) || 0,
    title: review.title || '',
    comment: review.comment || '',
    badges: review.badges || []
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const BADGE_OPTIONS = [
    'Cặp đôi',
    'Gia đình',
    'Nhóm bạn',
    'Phiêu lưu',
    'Nghỉ dưỡng sang trọng',
    'Văn hoá bản địa',
    'Yêu văn hoá',
    'Thích chụp ảnh',
    'Lifestyle'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Không thể cập nhật đánh giá');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBadgeToggle = (badge) => {
    const newBadges = formData.badges.includes(badge)
      ? formData.badges.filter((b) => b !== badge)
      : [...formData.badges, badge];
    setFormData({ ...formData, badges: newBadges });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Chỉnh sửa đánh giá</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Đánh giá
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={clsx('h-8 w-8 transition-colors', {
                        'fill-amber-400 text-amber-400': star <= (hoveredRating || formData.rating),
                        'text-slate-300': star > (hoveredRating || formData.rating)
                      })}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium text-slate-700 mb-2">
                Tiêu đề
              </label>
              <input
                id="edit-title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="edit-comment" className="block text-sm font-medium text-slate-700 mb-2">
                Nội dung
              </label>
              <textarea
                id="edit-comment"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                required
              />
            </div>

            {/* Badges */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phù hợp với
              </label>
              <div className="flex flex-wrap gap-2">
                {BADGE_OPTIONS.map((badge) => (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => handleBadgeToggle(badge)}
                    className={clsx(
                      'px-3 py-1 text-sm font-medium rounded-full border transition-colors',
                      formData.badges.includes(badge)
                        ? 'bg-primary-100 border-primary-300 text-primary-700'
                        : 'bg-white border-slate-300 text-slate-600 hover:border-primary-300'
                    )}
                  >
                    {badge}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

const MyReviews = () => {
  const { isAuthenticated, token, user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await reviewsAPI.getMyReviews(token);
        if (!isMounted) return;
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
        if (isMounted) {
          setError(err.message || 'Không thể tải đánh giá của bạn');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, token]);

  const handleEdit = (review) => {
    setEditingReview(review);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await reviewsAPI.update(editingReview.reviewId, updatedData, token);

      // Refresh list
      const data = await reviewsAPI.getMyReviews(token);
      setReviews(Array.isArray(data) ? data : []);
      setEditingReview(null);
    } catch (err) {
      throw new Error(err.message || 'Không thể cập nhật đánh giá');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      return;
    }

    try {
      setDeletingId(reviewId);
      await reviewsAPI.delete(reviewId, token);

      // Remove from list
      setReviews(reviews.filter((r) => r.reviewId !== reviewId));
    } catch (err) {
      alert(err.message || 'Không thể xóa đánh giá');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      PENDING: { variant: 'warning', label: 'Đang chờ duyệt' },
      APPROVED: { variant: 'success', label: 'Đã duyệt' },
      REJECTED: { variant: 'error', label: 'Đã từ chối' }
    };
    const config = configs[status] || configs.PENDING;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20">
        <Card className="text-center py-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Đăng nhập để xem đánh giá của bạn
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Bạn cần đăng nhập để quản lý các đánh giá đã viết
          </p>
          <Button to="/login">Đăng nhập ngay</Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-sm text-slate-500">Đang tải đánh giá...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20">
        <Card className="text-center py-12">
          <p className="text-red-600 font-medium mb-2">Không thể tải đánh giá</p>
          <p className="text-sm text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Thử lại
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-14 md:px-8">
      <Link to="/tours" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500">
        <ArrowLeft className="h-4 w-4" />
        Quay về tất cả tour
      </Link>

      <SectionTitle
        eyebrow={`Xin chào, ${user?.fullName || user?.username || 'Bạn'}`}
        title="Đánh giá của tôi"
        description="Quản lý tất cả các đánh giá bạn đã viết về các tour du lịch"
        align="left"
      />

      {reviews.length === 0 ? (
        <Card className="text-center py-20">
          <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Chưa có đánh giá nào
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Hãy trải nghiệm các tour của chúng tôi và chia sẻ đánh giá!
          </p>
          <Button to="/tours">Khám phá tour</Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.reviewId} className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <RatingStars rating={parseFloat(review.rating)} />
                    {getStatusBadge(review.status)}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{review.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Tour: {review.tourName || `Tour #${review.tourId}`} •{' '}
                    {formatDate(review.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(review)}
                    className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(review.reviewId)}
                    disabled={deletingId === review.reviewId}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Xóa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">{review.comment}</p>

              {review.badges && review.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                  {review.badges.map((badge) => (
                    <Badge key={badge} variant="outline">{badge}</Badge>
                  ))}
                </div>
              )}

              {review.status === 'PENDING' && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                  <p className="text-xs text-amber-700">
                    Đánh giá của bạn đang được kiểm duyệt và sẽ hiển thị công khai sau khi được phê duyệt.
                  </p>
                </div>
              )}

              {review.status === 'REJECTED' && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3">
                  <p className="text-xs text-red-700">
                    Đánh giá này không được phê duyệt. Bạn có thể chỉnh sửa và gửi lại.
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {editingReview && (
        <EditReviewModal
          review={editingReview}
          onClose={() => setEditingReview(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default MyReviews;
