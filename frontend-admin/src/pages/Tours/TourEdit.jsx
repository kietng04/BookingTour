import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TourForm from '../../components/tours/TourForm.jsx';
import Card from '../../components/common/Card.jsx';
import { toursAPI } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../../components/common/Button.jsx';

const TourEdit = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tour, setTour] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await toursAPI.getById(tourId);
        if (!mounted) return;
        setTour(data);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Không thể tải tour');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [tourId]);

  const adaptInitial = (t) => ({
    name: t.tourName || t.tour_name || t.name || '',
    slug: t.tourSlug || t.tour_slug || '',
    status: t.status || 'ACTIVE',
    price: t.adultPrice ?? t.adult_price ?? '',
    duration: t.days ?? '',
    seats: '',
    difficulty: 'moderate',
    heroImage: '',
    tags: [],
    highlights: [],
  });

  const adaptPayload = (form) => ({
    tour_name: form.name,
    tour_slug: form.slug,
    description: tour?.description ?? '',
    days: Number(form.duration) || 1,
    nights: Math.max((Number(form.duration) || 1) - 1, 0),
    adult_price: Number(form.price) || 0,
    child_price: tour?.childPrice ?? tour?.child_price ?? 0,
    status: form.status === 'live' ? 'ACTIVE' : form.status === 'archived' ? 'END' : 'ACTIVE',
    region_id: tour?.regionId ?? tour?.region_id ?? 1,
    province_id: tour?.provinceId ?? tour?.province_id ?? 1,
    departure_point: tour?.departurePoint ?? '',
    main_destination: tour?.mainDestination ?? '',
  });

  const handleSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      const payload = adaptPayload(data);
      await toursAPI.update(tourId, payload);
      toast.success('Tour updated successfully');
      navigate('/tours');
    } catch (err) {
      setError(err.message || 'Cập nhật tour thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Card className="p-6 text-sm text-slate-500">Đang tải dữ liệu tour...</Card>;
  }
  if (error) {
    return <Card className="p-6 text-sm text-danger">{error}</Card>;
  }
  if (!tour) {
    return <Card className="p-6 text-sm text-slate-500">Không tìm thấy tour.</Card>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Edit tour</h1>
        <p className="text-sm text-slate-500">Update details, pricing, or availability. Reflects PUT /tours/:id behavior.</p>
      </div>
      <div className="flex justify-end">
        <Button to={`/departures`} variant="secondary" size="sm">
          Manage departures
        </Button>
      </div>
      <TourForm
        mode="edit"
        initialValues={adaptInitial(tour)}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
};

export default TourEdit;
