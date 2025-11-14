import { useState } from 'react';
import PropTypes from 'prop-types';
import { Star } from 'lucide-react';
import Card from '../common/Card.jsx';
import Button from '../common/Button.jsx';
import clsx from 'clsx';

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

const ReviewForm = ({ tourId, tourName, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    badges: []
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (formData.rating === 0) {
      newErrors.rating = 'Vui lòng chọn số sao đánh giá';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề đánh giá';
    } else if (formData.title.trim().length < 10) {
      newErrors.title = 'Tiêu đề phải có ít nhất 10 ký tự';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Tiêu đề không được quá 200 ký tự';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Vui lòng nhập nội dung đánh giá';
    } else if (formData.comment.trim().length < 20) {
      newErrors.comment = 'Nội dung phải có ít nhất 20 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Will be implemented with actual API call
      await onSuccess({
        ...formData,
        rating: formData.rating.toFixed(1)
      });
    } catch (error) {
      console.error('Failed to submit review:', error);
      setErrors({ submit: error.message || 'Không thể gửi đánh giá. Vui lòng thử lại.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
    setErrors({ ...errors, rating: undefined });
  };

  const handleBadgeToggle = (badge) => {
    const newBadges = formData.badges.includes(badge)
      ? formData.badges.filter((b) => b !== badge)
      : [...formData.badges, badge];

    setFormData({ ...formData, badges: newBadges });
  };

  return (
    <Card className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Viết đánh giá của bạn</h3>
        <p className="text-sm text-slate-600 mt-1">
          Đánh giá cho tour: <span className="font-medium">{tourName}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Đánh giá tổng quan <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
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
            {formData.rating > 0 && (
              <span className="ml-2 text-sm font-medium text-slate-700">
                {formData.rating.toFixed(1)} sao
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="review-title" className="block text-sm font-medium text-slate-700 mb-2">
            Tiêu đề đánh giá <span className="text-red-500">*</span>
          </label>
          <input
            id="review-title"
            type="text"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              setErrors({ ...errors, title: undefined });
            }}
            placeholder="Tóm tắt trải nghiệm của bạn"
            className={clsx(
              'w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2',
              errors.title
                ? 'border-red-300 focus:ring-red-500'
                : 'border-slate-300 focus:ring-primary-500'
            )}
            maxLength={200}
          />
          <div className="mt-1 flex justify-between">
            {errors.title ? (
              <p className="text-sm text-red-600">{errors.title}</p>
            ) : (
              <p className="text-xs text-slate-500">Ít nhất 10 ký tự</p>
            )}
            <p className="text-xs text-slate-400">{formData.title.length}/200</p>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="review-comment" className="block text-sm font-medium text-slate-700 mb-2">
            Nội dung đánh giá <span className="text-red-500">*</span>
          </label>
          <textarea
            id="review-comment"
            value={formData.comment}
            onChange={(e) => {
              setFormData({ ...formData, comment: e.target.value });
              setErrors({ ...errors, comment: undefined });
            }}
            placeholder="Chia sẻ chi tiết về trải nghiệm của bạn..."
            rows={6}
            className={clsx(
              'w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 resize-none',
              errors.comment
                ? 'border-red-300 focus:ring-red-500'
                : 'border-slate-300 focus:ring-primary-500'
            )}
          />
          {errors.comment ? (
            <p className="mt-1 text-sm text-red-600">{errors.comment}</p>
          ) : (
            <p className="mt-1 text-xs text-slate-500">Ít nhất 20 ký tự</p>
          )}
        </div>

        {/* Badges */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Phù hợp với (Tùy chọn)
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
          <p className="mt-2 text-xs text-slate-500">
            Chọn các nhãn phù hợp để giúp người khác tìm hiểu thêm
          </p>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Hủy
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </Button>
        </div>

        <p className="text-xs text-slate-500 text-center">
          Đánh giá của bạn sẽ được kiểm duyệt trước khi hiển thị công khai
        </p>
      </form>
    </Card>
  );
};

ReviewForm.propTypes = {
  tourId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tourName: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func
};

export default ReviewForm;
