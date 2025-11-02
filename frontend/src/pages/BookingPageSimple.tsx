import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toursAPI } from '../services/api';
import MoMoPaymentButton from '../components/payment/MoMoPaymentButton';

interface Tour {
  id: number;
  title: string;
  slug: string;
  price: number;
  departures: Array<{
    id: number;
    departureDate: string;
    availableSeats: number;
  }>;
}

const BookingPageSimple: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        if (!slug) return;
        const data = await toursAPI.getBySlug(slug);
        setTour(data);
      } catch (err) {
        setError('Failed to load tour');
        console.error('Error fetching tour:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [slug]);

  const handleBookingSubmit = async (formData: any) => {
    try {
      const booking = await toursAPI.createBooking({
        userId: 1,
        tourId: tour?.id || 0,
        departureId: tour?.departures[0]?.id || 0,
        seats: formData.guests || 1,
        totalAmount: (tour?.price || 0) * (formData.guests || 1),
        paymentOverride: 'momo'
      });
      
      setBookingData(booking);
      console.log('Booking created:', booking);
    } catch (err) {
      console.error('Error creating booking:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!tour) return <div>Tour not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Book {tour.title}
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Tour Details</h2>
          <p className="text-gray-600 mb-2">Price: ${tour.price}</p>
          <p className="text-gray-600 mb-4">Available Departures: {tour.departures.length}</p>
        </div>

        {!bookingData ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Booking Form</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleBookingSubmit({
                guests: parseInt(formData.get('guests') as string) || 1
              });
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <input
                  type="number"
                  name="guests"
                  min="1"
                  max="10"
                  defaultValue="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Booking
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Booking Created!</h2>
            <p className="text-gray-600 mb-4">Booking ID: {bookingData.id}</p>
            <p className="text-gray-600 mb-6">Total Amount: ${bookingData.totalAmount}</p>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Payment</h3>
              <MoMoPaymentButton
                amount={bookingData.totalAmount}
                tourName={tour.title}
                onCreateBooking={async () => ({ bookingId: bookingData.id })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPageSimple;
