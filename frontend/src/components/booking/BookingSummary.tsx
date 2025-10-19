import React from 'react';
import { format } from 'date-fns';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { Tour } from '../../data/tours';

interface BookingSummaryProps {
  tour: Tour;
  startDate?: Date;
  endDate?: Date;
  guests: number;
  step: number;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ tour, startDate, endDate, guests, step }) => {
  const priceFormatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });

  return (
    <aside className="sticky top-28 space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-card lg:p-8">
      <div className="flex items-start gap-4">
        <img
          src={tour.heroImage}
          alt={tour.heroImageAlt}
          className="h-20 w-24 rounded-2xl object-cover"
          loading="lazy"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">
            {tour.destination}, {tour.country}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-gray-900">{tour.title}</h3>
          <p className="mt-2 text-xs text-gray-500">
            Free cancellation within policy · {tour.duration}
          </p>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl bg-gray-25 p-4 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>Guests</span>
          <span className="font-medium text-gray-900">{guests}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Dates</span>
          <span className="font-medium text-gray-900">
            {startDate && endDate
              ? `${format(startDate, 'dd MMM')} – ${format(endDate, 'dd MMM yyyy')}`
              : 'Select dates'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Price</span>
          <span className="font-semibold text-gray-900">{priceFormatter.format(tour.priceFrom)}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-600 shadow-inner">
        <p className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-brand-500" aria-hidden="true" />
          Secure payments & data encryption
        </p>
        <p className="mt-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-500" aria-hidden="true" />
          Step {step} of 4 · You can modify guests and dates later
        </p>
      </div>
    </aside>
  );
};

export default BookingSummary;
