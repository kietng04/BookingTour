import React from 'react';
import { Star } from 'lucide-react';
import { TourReview } from '../../data/tours';

interface ReviewListProps {
  reviews: TourReview[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => (
  <div className="space-y-6">
    {reviews.map((review) => (
      <article
        key={review.id}
        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
        aria-label={`Đánh giá từ ${review.travelerName}`}
      >
        <div className="flex items-center gap-4">
          <img
            src={review.travelerAvatar}
            alt={`Ảnh của ${review.travelerName}`}
            loading="lazy"
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{review.travelerName}</h4>
            <p className="text-xs text-gray-500">{review.date}</p>
            <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-gray-700">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${index < Math.round(review.rating) ? 'text-amber-400' : 'text-gray-200'}`}
                  aria-hidden="true"
                />
              ))}
              <span className="ml-2 text-xs text-gray-500">{review.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-700">{review.comment}</p>
        <p className="mt-3 inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
          {review.highlight}
        </p>
      </article>
    ))}
  </div>
);

export default ReviewList;
