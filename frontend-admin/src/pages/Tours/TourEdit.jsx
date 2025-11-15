import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TourForm from '../../components/tours/TourForm.jsx';
import Card from '../../components/common/Card.jsx';
import { toursAPI } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../../components/common/Button.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';

const TourEdit = () => {
  const { id: tourId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tour, setTour] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
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

  const adaptInitial = (t) => {
    return {
      tourName: t.tourName || '',
      slug: t.slug || '',
      status: t.status || 'ACTIVE',
      // Convert to number for Select component with valueAsNumber: true
      regionId: t.regionId ? Number(t.regionId) : '',
      provinceId: t.provinceId ? Number(t.provinceId) : '',
      description: t.description || '',
      days: t.days || '',
      nights: t.nights || '',
      departurePoint: t.departurePoint || '',
      mainDestination: t.mainDestination || '',
      adultPrice: t.adultPrice || '',
      childPrice: t.childPrice || '',
      heroImageUrl: t.heroImageUrl || '',
      schedules: t.schedules || [],
    };
  };

  const adaptPayload = (form) => {
    return {
      tourName: form.tourName,
      slug: form.slug,
      status: form.status || 'ACTIVE',
      regionId: Number(form.regionId),
      provinceId: Number(form.provinceId),
      description: form.description || '',
      days: Number(form.days) || 1,
      nights: Number(form.nights) || 0,
      departurePoint: form.departurePoint || '',
      mainDestination: form.mainDestination || '',
      adultPrice: Number(form.adultPrice) || 0,
      childPrice: Number(form.childPrice) || 0,
      heroImageUrl: form.heroImageUrl || '',
      schedules: form.schedules || [],
    };
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      const payload = adaptPayload(data);
      await toursAPI.update(tourId, payload);
      toast.success('Cập nhật tour thành công');
      navigate('/tours');
    } catch (err) {
      setError(err.message || 'Cập nhật tour thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await toursAPI.delete(tourId);
      toast.success('Xóa tour thành công');
      setShowDeleteDialog(false);
      navigate('/tours');
    } catch (err) {
      toast.error(err.message || 'Xóa tour thất bại');
      setShowDeleteDialog(false);
    } finally {
      setDeleting(false);
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
        <h1 className="text-2xl font-semibold text-slate-900">Chỉnh sửa tour</h1>
        <p className="text-sm text-slate-500">Cập nhật chi tiết, giá cả hoặc trạng thái. Phản ánh hành vi PUT /tours/:id.</p>
      </div>
      <div className="flex justify-between items-center gap-2">
        <Button
          variant="danger"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          disabled={submitting || deleting}
        >
          Xóa tour
        </Button>
        <div className="flex gap-2">
          <Button to={`/departures/new?tourId=${tourId}`} variant="primary" size="sm">
            Thêm Departure
          </Button>
          <Button to={`/departures?tourId=${tourId}`} variant="secondary" size="sm">
            Quản lý chuyến đi
          </Button>
        </div>
      </div>
      <TourForm
        mode="edit"
        initialValues={adaptInitial(tour)}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Xóa tour"
        message={`Bạn có chắc muốn xóa "${tour?.tourName || tour?.tour_name || 'tour này'}"? Hành động này sẽ đánh dấu nó là không hoạt động.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
};

export default TourEdit;
