import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock3, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import TourGallery from '../components/tours/TourGallery';
import TourInfoTabs from '../components/tours/TourInfoTabs';
import BookingSidebar from '../components/tours/BookingSidebar';
import OperatorCard from '../components/tours/OperatorCard';
import ReviewList from '../components/tours/ReviewList';
import { tours } from '../data/tours';

const TourDetailPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const tour = tours.find((item) => item.slug === slug);

  if (!tour) {
    return (
    <main id="main-content" className="container min-h-[60vh] py-24">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Tour not found</p>
          <h1 className="mt-3 text-3xl font-semibold text-gray-900">We can’t find that experience</h1>
          <p className="mt-3 text-sm text-gray-600">
            It may have been updated or is no longer available. Explore our curated tours instead.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 inline-flex items-center rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-600 focus-visible:bg-brand-600"
          >
            Browse tours
          </button>
        </div>
      </main>
    );
  }

  const reviewSummary = `${tour.rating.toFixed(2)} · ${tour.reviewCount} reviews`;

  return (
    <main id="main-content" className="bg-gray-25 pb-16">
      <div className="container space-y-10 py-10 lg:py-16">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-gray-900 focus-visible:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="space-y-4"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">
            {tour.destination}, {tour.country}
          </p>
          <h1 className="text-4xl font-semibold text-gray-900">{tour.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-500" aria-hidden="true" />
              Small-group · {tour.groupSize}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-brand-500" aria-hidden="true" />
              {tour.duration}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-inner">
              {reviewSummary}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
            {tour.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white px-3 py-1 text-[11px] text-gray-600 shadow-inner">
                {tag}
              </span>
            ))}
          </div>
        </motion.header>

        <TourGallery images={tour.gallery} alt={tour.heroImageAlt} />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-card">
              <h2 className="text-2xl font-semibold text-gray-900">Experience highlights</h2>
              <p className="mt-3 text-sm text-gray-600">{tour.overview}</p>
              <ul className="mt-6 grid gap-4 lg:grid-cols-2">
                {tour.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <Sparkles className="mt-1 h-5 w-5 text-brand-500" aria-hidden="true" />
                    <p className="text-sm text-gray-700">{highlight}</p>
                  </li>
                ))}
              </ul>
            </section>

            <TourInfoTabs
              defaultTabId="overview"
              tabs={[
                {
                  id: 'overview',
                  label: 'Overview',
                  content: (
                    <div className="grid gap-6 lg:grid-cols-2">
                      {tour.quickSummary.map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  id: 'itinerary',
                  label: 'Itinerary',
                  content: (
                    <div className="space-y-6">
                      {tour.itinerary.map((item) => (
                        <article
                          key={item.day}
                          className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:p-5"
                        >
                          <img
                            src={item.image}
                            alt=""
                            loading="lazy"
                            className="h-32 w-full rounded-2xl object-cover sm:h-28 sm:w-40"
                          />
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">
                              {item.day}
                            </p>
                            <h3 className="mt-1 text-lg font-semibold text-gray-900">{item.title}</h3>
                            <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  ),
                },
                {
                  id: 'included',
                  label: 'Included',
                  content: (
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">What&apos;s included</h3>
                        <ul className="mt-3 space-y-2 text-sm text-gray-600">
                          {tour.included.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">What&apos;s not included</h3>
                        <ul className="mt-3 space-y-2 text-sm text-gray-600">
                          {tour.excluded.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="mt-1 h-2 w-2 rounded-full bg-gray-300" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'reviews',
                  label: 'Reviews',
                  content: <ReviewList reviews={tour.reviews} />,
                  description: 'Verified traveler feedback from real BookingTour guests.',
                },
              ]}
            />

            <OperatorCard operator={tour.operator} />

            <section className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-card lg:p-8">
              <h2 className="text-lg font-semibold text-gray-900">Cancellation policy</h2>
              <p className="text-sm text-gray-600">{tour.cancellationPolicy}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <ShieldCheck className="h-5 w-5 text-brand-500" aria-hidden="true" />
                Flexible terms with instant confirmation · No hidden fees
              </div>
            </section>
          </div>

          <BookingSidebar
            priceFrom={tour.priceFrom}
            duration={tour.duration}
            reviewSummary={reviewSummary}
            onBook={() => navigate(`/booking/${tour.slug}`)}
          />
        </div>
      </div>
    </main>
  );
};

export default TourDetailPage;
