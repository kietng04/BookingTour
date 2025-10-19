import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MapPin, Shield, Users } from 'lucide-react';
import TourHighlights from '../components/tour/TourHighlights.jsx';
import TourGallery from '../components/tour/TourGallery.jsx';
import TourItinerary from '../components/tour/TourItinerary.jsx';
import ReviewsPanel from '../components/tour/ReviewsPanel.jsx';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import SectionTitle from '../components/common/SectionTitle.jsx';
import { tours } from '../data/mockTours.js';
import { reviews } from '../data/mockReviews.js';
import { formatCurrency } from '../utils/format.js';

const TourDetail = () => {
  const { tourId } = useParams();
  const tour = useMemo(() => tours.find((item) => item.id === tourId), [tourId]);

  if (!tour) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-sm text-slate-500">Tour not found.</p>
        <Button to="/tours" className="mt-4">Back to tours</Button>
      </div>
    );
  }

  const tourReviews = reviews.filter((review) => review.tourId === tour.id);

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-14 md:px-8">
      <Link to="/tours" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500">
        <ArrowLeft className="h-4 w-4" />
        Back to all tours
      </Link>

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-primary-500">Private journey</p>
            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">{tour.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-500" />
                {tour.destination}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary-500" />
                {tour.duration} days
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-primary-500" />
                {tour.groupSize}
              </span>
            </div>
          </div>
          <div className="space-y-2 rounded-3xl bg-primary-50 px-6 py-4 text-right text-primary-700">
            <p className="text-xs uppercase tracking-widest">Investment</p>
            <p className="text-2xl font-semibold">{formatCurrency(tour.price)} <span className="text-sm font-medium text-primary-500">per guest</span></p>
            <Button to={`/booking/${tour.id}`} size="sm">
              Start booking
            </Button>
          </div>
        </div>

        <TourGallery gallery={tour.gallery} thumbnail={tour.thumbnail} />
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">The experience</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{tour.description}</p>
            <div className="rounded-2xl bg-slate-100/70 p-4 text-sm text-slate-600">
              <p>Backend hook: fetch `/tours/{tour.id}` to hydrate this page. Sections map directly to API response (highlights, itinerary, policies, etc.).</p>
            </div>
          </Card>

          <TourHighlights highlights={tour.highlights} />
          <TourItinerary itinerary={tour.itinerary} />
        </div>

        <div className="space-y-6">
          <Card className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">What&apos;s included</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {tour.includes.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Shield className="mt-1 h-4 w-4 text-primary-500" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-200 pt-4">
              <h4 className="text-sm font-semibold text-slate-700">Not included</h4>
              <ul className="mt-2 space-y-2 text-sm text-slate-500">
                {tour.excludes.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </Card>

          <Card className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900">Policies</h3>
            <div>
              <h4 className="text-sm font-semibold text-slate-700">Flexible cancellation</h4>
              <p className="text-sm text-slate-500">{tour.policies.cancellation}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-700">Traveler requirements</h4>
              <p className="text-sm text-slate-500">{tour.policies.requirements}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-700">Payment terms</h4>
              <p className="text-sm text-slate-500">{tour.policies.payment}</p>
            </div>
          </Card>

          <ReviewsPanel reviews={tourReviews} />
        </div>
      </section>

      <SectionTitle
        align="center"
        eyebrow="Need something custom?"
        title="Design a trip with our concierge team"
        description="Link tracks to `/inquiries` API. Perfect for high-touch groups or corporate retreats."
        actions={<Button to="/contact">Plan a custom journey</Button>}
      />
    </div>
  );
};

export default TourDetail;
