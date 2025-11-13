import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DepartureForm from '../../components/departures/DepartureForm';
import Button from '../../components/common/Button';
import { departuresAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const DepartureCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const tourIdFromQuery = searchParams.get('tourId');

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await departuresAPI.create(data.tourId, {
        startDate: data.startDate,
        endDate: data.endDate,
        totalSlots: data.totalSlots
      });

      toast.success('Departure created successfully!');

      if (tourIdFromQuery) {
        navigate(`/tours/${tourIdFromQuery}/edit`);
      } else {
        navigate('/departures');
      }
    } catch (error) {
      console.error('Failed to create departure:', error);

      let errorMessage = 'Failed to create departure';
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid departure data';
      } else if (error.response?.status === 404) {
        errorMessage = 'Tour not found';
      } else if (error.response?.status === 409) {
        errorMessage = 'A departure already exists for this date range';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (tourIdFromQuery) {
      navigate(`/tours/${tourIdFromQuery}/edit`);
    } else {
      navigate('/departures');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            onClick={handleCancel}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Create New Departure</h1>
            <p className="text-slate-600 mt-1">Add a new departure schedule for a tour</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900">Before creating a departure</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Ensure the tour is active and has all necessary details</li>
                <li>Set realistic slot numbers based on tour capacity</li>
                <li>Double-check date ranges to avoid conflicts</li>
                <li>Start date must be in the future</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <DepartureForm
        initialValues={tourIdFromQuery ? { tourId: tourIdFromQuery } : undefined}
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        disableTourSelection={!!tourIdFromQuery}
      />
    </div>
  );
};

export default DepartureCreate;

