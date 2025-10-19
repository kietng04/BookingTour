import { useMemo, useState } from 'react';
import { MessageCircle, MessageSquareHeart } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle.jsx';
import ReviewSummary from '../components/reviews/ReviewSummary.jsx';
import ReviewFilters from '../components/reviews/ReviewFilters.jsx';
import ReviewList from '../components/reviews/ReviewList.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import { reviews as reviewData } from '../data/mockReviews.js';
import { tours } from '../data/mockTours.js';

const defaultFilters = {
  tour: 'all',
  rating: 'all',
  badge: 'all',
  sort: 'newest'
};

const Reviews = () => {
  const [filters, setFilters] = useState(() => ({ ...defaultFilters }));

  const tourLookup = useMemo(
    () => Object.fromEntries(tours.map((tour) => [tour.id, tour.name])),
    []
  );

  const availableBadges = useMemo(() => {
    const badgeSet = new Set();
    reviewData.forEach((review) => review.badges?.forEach((badge) => badgeSet.add(badge)));
    return Array.from(badgeSet).sort((a, b) => a.localeCompare(b));
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
  }, []);

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
  }, [filters]);

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-14 md:px-8">
      <SectionTitle
        eyebrow="Voices from travelers"
        title="Real stories from recent journeys"
        description="Every review is synced from the moderation queue. Use filters to surface relevant testimonials for your marketing or concierge teams."
        align="center"
        actions={<Button to="/tours">Browse tours</Button>}
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
              Concierge tip
            </div>
            <p className="text-sm text-slate-600">
              Positive reviews with <span className="font-semibold text-slate-800">“Luxury retreat”</span> or{' '}
              <span className="font-semibold text-slate-800">“Family friendly”</span> badges map to backend loyalty campaigns.
              Use them in emails or upsell journeys in `/crm/segments`.
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          {filteredReviews.length > 0 ? (
            <ReviewList reviews={filteredReviews} tourLookup={tourLookup} />
          ) : (
            <EmptyState
              title="No reviews match these filters"
              description="Broaden your filters or highlight concierge-curated testimonials."
              actionLabel="Reset filters"
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
