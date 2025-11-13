import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TourForm from '../../components/tours/TourForm.jsx';
import Card from '../../components/common/Card.jsx';
import { toursAPI } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../../components/common/Button.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';

const TourEdit = () => {
  const { tourId } = useParams();
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
    // Map backend status to frontend status
    const backendToFrontendStatus = {
      'ACTIVE': 'live',
      'UNACTIVE': 'draft',
      'END': 'archived',
      'FULL': 'live'
    };

    return {
      name: t.tourName || t.tour_name || t.name || '',
      slug: t.tourSlug || t.tour_slug || '',
      status: backendToFrontendStatus[t.status] || 'draft',
      price: t.adultPrice ?? t.adult_price ?? '',
      duration: t.days ?? '',
      seats: '',
      difficulty: 'moderate',
      heroImage: '',
      tags: [],
      highlights: [],
    };
  };

  const adaptPayload = (form) => {
    // Map frontend status to backend status
    const statusMap = {
      'draft': 'UNACTIVE',
      'live': 'ACTIVE',
      'archived': 'END'
    };

    return {
      tour_name: form.name,
      tour_slug: form.slug,
      description: tour?.description ?? '',
      days: Number(form.duration) || 1,
      nights: Math.max((Number(form.duration) || 1) - 1, 0),
      adult_price: Number(form.price) || 0,
      child_price: tour?.childPrice ?? tour?.child_price ?? 0,
      status: statusMap[form.status?.toLowerCase()] || 'ACTIVE',
      region_id: tour?.regionId ?? tour?.region_id ?? 1,
      province_id: tour?.provinceId ?? tour?.province_id ?? 1,
      departure_point: tour?.departurePoint ?? tour?.departure_point ?? '',
      main_destination: tour?.mainDestination ?? tour?.main_destination ?? '',
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
