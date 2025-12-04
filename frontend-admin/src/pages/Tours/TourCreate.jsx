import { useState } from 'react';
import TourForm from '../../components/tours/TourForm.jsx';
import { toursAPI } from '../../services/api.js';
import Card from '../../components/common/Card.jsx';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext.jsx';

const TourCreate = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const adaptPayload = (form) => {
    const days = Number(form.days) || 1;
    // Use schedules from form, or create default ones if none provided
    let schedules = form.schedules || [];
    if (schedules.length === 0) {
      schedules = Array.from({ length: days }, (_, idx) => ({
        dayNumber: idx + 1,
        scheduleDescription: `Lịch trình ngày ${idx + 1}: trải nghiệm và tham quan`,
      }));
    }

    // Fix: Properly handle nights = 0 (don't use || operator)
    // If form.nights is provided (even if 0), use it. Otherwise default to days - 1
    const nights = form.nights != null && form.nights !== ''
      ? Number(form.nights)
      : Math.max(days - 1, 0);

    return {
      tourName: form.tourName,
      slug: form.slug,
      status: form.status || 'ACTIVE',
      regionId: Number(form.regionId),
      provinceId: Number(form.provinceId),
      description: form.description || '',
      days,
      nights,
      departurePoint: form.departurePoint || '',
      mainDestination: form.mainDestination || '',
      adultPrice: Number(form.adultPrice) || 0,
      childPrice: Number(form.childPrice) || 0,
      heroImageUrl: form.heroImageUrl || '',
      schedules,
    };
  };

  const handleSubmit = async (data) => {
    setError('');
    setSubmitting(true);
    try {
      const payload = adaptPayload(data);
      await toursAPI.create(payload);
      toast.success('Tạo tour thành công');
      navigate('/tours');
    } catch (err) {
      setError(err.message || 'Tạo tour thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Tạo tour</h1>
      </div>
      {error && (
        <Card className="border-danger/30 bg-danger/10 p-4 text-danger text-sm">{error}</Card>
      )}
      <TourForm mode="create" onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
};

export default TourCreate;
