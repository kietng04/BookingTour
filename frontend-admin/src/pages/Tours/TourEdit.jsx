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
      regionId: t.regionId || '',
      provinceId: t.provinceId || '',
      description: t.description || '',
      days: t.days || '',
      nights: t.nights || '',
      departurePoint: t.departurePoint || '',
      mainDestination: t.mainDestination || '',
      adultPrice: t.adultPrice || '',
      childPrice: t.childPrice || '',
      heroImageUrl: t.heroImageUrl || '',
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
    };
  };

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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await toursAPI.delete(tourId);
      toast.success('Tour deleted successfully');
      setShowDeleteDialog(false);
      navigate('/tours');
    } catch (err) {
      toast.error(err.message || 'Failed to delete tour');
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
        <h1 className="text-2xl font-semibold text-slate-900">Edit tour</h1>
        <p className="text-sm text-slate-500">Update details, pricing, or availability. Reflects PUT /tours/:id behavior.</p>
      </div>
      <div className="flex justify-between items-center">
        <Button
          variant="danger"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          disabled={submitting || deleting}
        >
          Delete tour
        </Button>
        <Button to={`/departures?tourId=${tourId}`} variant="secondary" size="sm">
          Manage departures
        </Button>
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
        title="Delete Tour"
        message={`Are you sure you want to delete "${tour?.tourName || tour?.tour_name || 'this tour'}"? This action will mark it as inactive.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
};

export default TourEdit;
