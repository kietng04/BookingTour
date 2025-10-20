import { useMemo, useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import SectionTitle from '../components/common/SectionTitle.jsx';
import BookingForm from '../components/booking/BookingForm.jsx';
import BookingSummary from '../components/booking/BookingSummary.jsx';
import BookingTimeline from '../components/booking/BookingTimeline.jsx';
import { tours } from '../data/mockTours.js';
import { toursAPI } from '../services/api.js';

const Booking = () => {
  const { tourId } = useParams();
  const [searchParams] = useSearchParams();
  const departureId = searchParams.get('departureId');

  const [snapshot, setSnapshot] = useState({ guests: '2', date: '' });
  const [departure, setDeparture] = useState(null);
  const [loadingDeparture, setLoadingDeparture] = useState(!!departureId);

  const tour = useMemo(() => tours.find((item) => item.id === tourId), [tourId]);

  useEffect(() => {
    if (!departureId || !tourId) return;

    const fetchDeparture = async () => {
      try {
        setLoadingDeparture(true);
        const departures = await toursAPI.getDepartures(tourId);
        const selected = departures.find(d => d.departureId === parseInt(departureId));
        setDeparture(selected);

        if (selected) {
          setSnapshot(prev => ({ ...prev, date: selected.startDate }));
        }
      } catch (error) {
        console.error('Failed to load departure:', error);
      } finally {
        setLoadingDeparture(false);
      }
    };

    fetchDeparture();
  }, [departureId, tourId]);

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

      {departure && (
        <div className="rounded-2xl bg-primary-50 border border-primary-200 p-4">
          <h3 className="text-sm font-semibold text-primary-900">Selected Departure</h3>
          <p className="mt-1 text-sm text-primary-700">
            {new Date(departure.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {' - '}
            {new Date(departure.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <p className="mt-1 text-xs text-primary-600">
            {departure.remainingSlots} seats remaining
          </p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-8">
          <BookingForm
            tour={tour}
            departure={departure}
            departureId={departureId}
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
