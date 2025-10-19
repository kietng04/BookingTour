import React from 'react';
import { Tour } from '../../data/tours';
import TourCard from './TourCard';
import Skeleton from '../ui/Skeleton';

interface TourGridProps {
  tours: Tour[];
  isLoading?: boolean;
  onWishlist?: (tourId: string) => void;
  wishlistState?: Record<string, boolean>;
}

const TourGrid: React.FC<TourGridProps> = ({ tours, isLoading = false, onWishlist, wishlistState }) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-card">
            <Skeleton className="mb-4 h-48 w-full rounded-xl" />
            <Skeleton className="mb-3 h-5 w-3/4" />
            <Skeleton className="mb-2 h-4 w-2/3" />
            <Skeleton className="mb-2 h-4 w-1/2" />
            <Skeleton className="mt-auto h-10 w-full rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {tours.map((tour) => (
        <TourCard
          key={tour.id}
          tour={tour}
          onWishlist={onWishlist}
          wishlisted={Boolean(wishlistState?.[tour.id])}
        />
      ))}
    </div>
  );
};

export default TourGrid;
