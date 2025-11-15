import { useMemo, useState, useEffect } from 'react';
import { MessageCircle, MessageSquareHeart } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle.jsx';
import ReviewSummary from '../components/reviews/ReviewSummary.jsx';
import ReviewFilters from '../components/reviews/ReviewFilters.jsx';
import ReviewList from '../components/reviews/ReviewList.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import { tours } from '../data/mockTours.js';
import { reviewsAPI } from '../services/api.js';

const defaultFilters = {
  tour: 'all',
  rating: 'all',
  badge: 'all',
  sort: 'newest'
};

const Reviews = () => {
  const [filters, setFilters] = useState(() => ({ ...defaultFilters }));
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tourLookup = useMemo(
    () => Object.fromEntries(tours.map((tour) => [tour.id, tour.name])),
    []
  );

  const availableBadges = useMemo(() => {
    const badgeSet = new Set();
    reviewData.forEach((review) => review.badges?.forEach((badge) => badgeSet.add(badge)));
    return Array.from(badgeSet).sort((a, b) => a.localeCompare(b));
  }, [reviewData]);

  useEffect(() => {
    let isMounted = true;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await reviewsAPI.getAllApproved(); // Get all approved reviews via /reviews/approved endpoint
        if (!isMounted) return;

        // Transform backend format to frontend format
        const transformedReviews = (Array.isArray(data) ? data : []).map((review) => ({
          id: `rv-${review.reviewId}`,
          tourId: review.tourId,
          guest: review.guestName || 'Khách hàng',
          avatar: review.guestAvatar || `https://i.pravatar.cc/100?u=${review.userId}`,
          rating: parseFloat(review.rating),
          title: review.title,
          comment: review.comment,
          createdAt: review.createdAt,
          badges: review.badges || []
        }));

        setReviewData(transformedReviews);
      } catch (error) {
        console.error('Failed to load reviews:', error);
        if (isMounted) {
          setReviewData([]);
          setError(error.message || 'Không thể tải đánh giá.');
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
  }, []);

  const overallStats = useMemo(() => {
    const total = reviewData.length;
    const sum = reviewData.reduce((acc, review) => acc + review.rating, 0);
    const distribution = reviewData.reduce((acc, review) => {
      const rounded = Math.floor(review.rating);
      acc[rounded] = (acc[rounded] ?? 0) + 1;
      return acc;
    }, {});
    return {
      total,
      average: total > 0 ? sum / total : 0,
      distribution
    };
  }, [reviewData]);

  const filteredReviews = useMemo(() => {
    const ratingThreshold = filters.rating === 'all' ? 0 : Number(filters.rating);
    const sorters = {
      newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      'rating-desc': (a, b) => b.rating - a.rating,
      'rating-asc': (a, b) => a.rating - b.rating
    };

    return [...reviewData]
      .filter((review) => {
        const matchesTour = filters.tour === 'all' || review.tourId === filters.tour;
        const matchesRating = review.rating >= ratingThreshold;
        const matchesBadge =
          filters.badge === 'all' || review.badges?.some((badge) => badge === filters.badge);
        return matchesTour && matchesRating && matchesBadge;
      })
      .sort(sorters[filters.sort]);
  }, [filters, reviewData]);

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-14 md:px-8">
      <SectionTitle
        eyebrow="Tiếng nói từ du khách"
        title="Những câu chuyện chân thực sau mỗi hành trình"
        description="Toàn bộ đánh giá được đồng bộ từ hàng đợi kiểm duyệt. Dùng bộ lọc để tìm gợi ý phù hợp cho chiến dịch marketing hoặc đội concierge."
        align="center"
        actions={<Button to="/tours">Xem tour</Button>}
      />

      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-6">
          <ReviewSummary
            averageRating={overallStats.average}
            total={overallStats.total}
            distribution={overallStats.distribution}
          />
          <ReviewFilters
            filters={filters}
            onChange={setFilters}
            tours={tours}
            badges={availableBadges}
          />
          <Card className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
              <MessageSquareHeart className="h-4 w-4" />
              Gợi ý concierge
            </div>
            <p className="text-sm text-slate-600">
              Các đánh giá có huy hiệu <span className="font-semibold text-slate-800">“Nghỉ dưỡng sang trọng”</span> hoặc{' '}
              <span className="font-semibold text-slate-800">“Gia đình”</span> tương ứng với chiến dịch loyalty trên backend.
              Kết hợp trong email chăm sóc hoặc upsell tại mô-đun `/crm/segments`.
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          {filteredReviews.length > 0 ? (
            <ReviewList reviews={filteredReviews} tourLookup={tourLookup} />
          ) : (
          <EmptyState
            title="Không có đánh giá phù hợp bộ lọc"
            description="Hãy nới rộng tiêu chí hoặc sử dụng các testimonial do concierge đề xuất."
            actionLabel="Đặt lại bộ lọc"
            icon={MessageCircle}
            onAction={() => setFilters({ ...defaultFilters })}
          />
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
