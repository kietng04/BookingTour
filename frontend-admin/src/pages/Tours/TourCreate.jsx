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
    const days = Number(form.duration) || 1;
    const schedules = Array.from({ length: days }, (_, idx) => ({
      dayNumber: idx + 1,
      scheduleDescription: `Lịch trình ngày ${idx + 1}: trải nghiệm và tham quan`,
    }));

    return {
      tourName: form.name,
      // Backend sẽ tự generate slug từ tourName nếu không truyền, nhưng giữ trường hợp có nhập
      // slug: form.slug,
      description: 'Tour được tạo từ trang quản trị',
      days,
      nights: Math.max(days - 1, 0),
      adultPrice: Number(form.price) || 0,
      childPrice: 0,
      // TourStatus mặc định ACTIVE ở backend, có thể bỏ nếu không cần
      // status: 'ACTIVE',
      regionId: 1,
      provinceId: 11,
      departurePoint: 'Hà Nội',
      mainDestination: 'Vịnh Hạ Long',
      schedules,
    };
  };

  const handleSubmit = async (data) => {
    setError('');
    setSubmitting(true);
    try {
      const payload = adaptPayload(data);
      await toursAPI.create(payload);
      toast.success('Tour created successfully');
      navigate('/tours');
    } catch (err) {
      setError(err.message || 'Create tour failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Create tour</h1>
        <p className="text-sm text-slate-500">This form mirrors backend validation. On submit sends to POST /tours.</p>
      </div>
      {error && (
        <Card className="border-danger/30 bg-danger/10 p-4 text-danger text-sm">{error}</Card>
      )}
      <TourForm mode="create" onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
};

export default TourCreate;
