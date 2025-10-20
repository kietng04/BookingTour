import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import TourForm from '../../components/tours/TourForm.jsx';
import Card from '../../components/common/Card.jsx';
import { adminTours } from '../../data/tours.js';

const TourEdit = () => {
  const { tourId } = useParams();
  const tour = useMemo(() => adminTours.find((item) => item.id === tourId), [tourId]);

  if (!tour) {
    return (
      <Card className="text-sm text-slate-500">
        Tour not found. Return to catalog to choose another experience.
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Edit tour</h1>
        <p className="text-sm text-slate-500">Update details, pricing, or availability. Reflects `PUT /admin/tours/:id` behavior.</p>
      </div>
      <TourForm
        mode="edit"
        initialValues={{
          name: tour.name,
          slug: tour.id,
          status: tour.status,
          price: tour.price,
          duration: parseInt(tour.duration, 10),
          seats: tour.seatsLeft,
          difficulty: 'moderate',
          heroImage: '',
          tags: tour.tags.map((tag) => ({ value: tag })),
          highlights: [
            { value: 'Personal concierge included' },
            { value: 'Flexible itinerary builder' }
          ]
        }}
        onSubmit={(data) => {
          console.log('Update tour payload', data);
        }}
      />
    </div>
  );
};

export default TourEdit;
