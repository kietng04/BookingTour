import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import SectionTitle from '../components/common/SectionTitle.jsx';
import BookingForm from '../components/booking/BookingForm.jsx';
import BookingSummary from '../components/booking/BookingSummary.jsx';
import BookingTimeline from '../components/booking/BookingTimeline.jsx';
import { tours } from '../data/mockTours.js';

const Booking = () => {
  const { tourId } = useParams();
  const [snapshot, setSnapshot] = useState({ guests: '2', date: '' });

  const tour = useMemo(() => tours.find((item) => item.id === tourId), [tourId]);

  if (!tour) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-sm text-slate-500">We could not locate this tour.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-14 md:px-8">
      <SectionTitle
        eyebrow="Reserve your journey"
        title={`Secure your spot for ${tour.name}`}
        description="Submitting this form calls the backend booking endpoint (`POST /bookings`). We pre-fill price, policies, and metadata for a streamlined payment step."
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-8">
          <BookingForm
            tour={tour}
            onSubmit={(formValues) => setSnapshot({ guests: formValues.guests, date: formValues.date })}
          />
          <BookingTimeline
            steps={[
              {
                label: 'Request submitted',
                description: 'Trigger backend booking in `pending` status. Concierge receives alert.',
                timestamp: new Date().toISOString(),
                completed: true
              },
              {
                label: 'Concierge confirmation',
                description: 'Team verifies availability, upgrades, and special requests before marking confirmed.'
              },
              {
                label: 'Payment & docs',
                description: 'Secure payment link, traveler forms, and insurance options shared automatically.'
              },
              {
                label: 'Departure concierge',
                description: '48-hour pre-travel call, airport transfers, and on-ground host introduction.'
              }
            ]}
          />
        </div>
        <BookingSummary tour={tour} guests={snapshot.guests} date={snapshot.date} />
      </div>
    </div>
  );
};

export default Booking;
