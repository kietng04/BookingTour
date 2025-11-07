import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Clock3 } from 'lucide-react';
import clsx from 'clsx';
import { Tour } from '../../data/tours';

interface TourCardProps {
  tour: Tour;
  onWishlist?: (tourId: string) => void;
  wishlisted?: boolean;
}

const TourCard: React.FC<TourCardProps> = ({ tour, onWishlist, wishlisted }) => {
  const priceFormatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(tour.priceFrom);

  const handleKeyWishlist = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onWishlist?.(tour.id);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-card-hover focus-within:-translate-y-1 focus-within:shadow-card-hover"
    >
      <div className="relative">
        <img
          src={tour.heroImage}
          alt={tour.heroImageAlt}
          loading="lazy"
          className="h-56 w-full object-cover transition duration-300 ease-in-out group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => onWishlist?.(tour.id)}
          onKeyDown={handleKeyWishlist}
          aria-label={`Save ${tour.title}`}
          className={clsx(
            'absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md transition focus-visible:ring-2 focus-visible:ring-brand-400',
            'backdrop-blur-sm',
            wishlisted ? 'text-brand-500' : 'text-gray-500 hover:text-brand-500'
          )}
        >
          <Heart className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
          {tour.duration}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
              {tour.destination}, {tour.country}
            </p>
            <h3 className="mt-1 line-clamp-2 text-xl font-semibold text-gray-900">{tour.title}</h3>
          </div>
        </div>
        <ul className="space-y-2 text-sm text-gray-600">
          {tour.quickSummary.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500 opacity-70" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Giá từ</p>
            <p className="text-lg font-semibold text-gray-900">{priceFormatted}</p>
          </div>
          <Link
            to={`/tours/${tour.slug}`}
            className="inline-flex items-center rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-brand-600 focus-visible:bg-brand-600"
            aria-label={`Xem chi tiết tour ${tour.title}`}
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default TourCard;
