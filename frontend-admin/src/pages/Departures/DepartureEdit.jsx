import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DepartureForm from '../../components/departures/DepartureForm';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { departuresAPI, toursAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const DepartureEdit = () => {
  const navigate = useNavigate();
  const { departureId } = useParams();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [departure, setDeparture] = useState(null);
  const [error, setError] = useState(null);

  // Fetch departure details
  useEffect(() => {
    const fetchDeparture = async () => {
      try {
        setIsLoadingData(true);
        // We need to get all departures and find the one we want
        // because the API doesn't have a single departure endpoint
        const toursData = await toursAPI.getAll();
        const tours = toursData.content || toursData || [];

        let foundDeparture = null;
        let foundTourId = null;

        for (const tour of tours) {
          const tourId = tour.id ?? tour.tourId;
          if (!tourId) continue;

          const departures = await departuresAPI.getByTour(tourId);
          const match = departures.find(d => (d.id || d.departureId) === parseInt(departureId));
          if (match) {
            foundDeparture = {
              ...match,
              departureId: match.id || match.departureId
            };
            foundTourId = tourId;
            break;
          }
        }

        if (!foundDeparture) {
          setError('Departure not found');
          toast.error('Departure not found');
          navigate('/departures');
          return;
        }

        setDeparture({
          ...foundDeparture,
          tourId: foundTourId
        });
      } catch (error) {
        console.error('Failed to fetch departure:', error);
        setError('Failed to load departure');
        toast.error('Failed to load departure details');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDeparture();
  }, [departureId, navigate, toast]);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      const updatedDeparture = await departuresAPI.update(departure.tourId, departureId, {
        startDate: data.startDate,
        endDate: data.endDate,
        totalSlots: data.totalSlots
      });

      toast.success('Đã cập nhật chuyến đi thành công!');

      // Always redirect to departures list after editing
      navigate('/departures', {
        state: {
          successMessage: 'Đã cập nhật chuyến đi thành công',
          highlightId: departureId
        }
      });
    } catch (error) {
      console.error('Failed to update departure:', error);

      // Handle specific error cases with Vietnamese messages
      let errorMessage = 'Không thể cập nhật chuyến đi';

      if (error.response?.status === 400) {
        const backendMessage = error.response.data?.message || '';

        // Check for specific error patterns and translate
        if (backendMessage.includes('duration mismatch') || backendMessage.includes('Departure duration mismatch')) {
          // Extract tour days and actual days from message if possible
          const tourDaysMatch = backendMessage.match(/Tour is (\d+) days/);
          const actualDaysMatch = backendMessage.match(/but departure is (\d+) days/);
          const expectedDateMatch = backendMessage.match(/end date should be (.+)$/);

          if (tourDaysMatch && actualDaysMatch) {
            errorMessage = `Thời lượng chuyến đi không khớp với tour. Tour yêu cầu ${tourDaysMatch[1]} ngày, nhưng bạn đã chọn ${actualDaysMatch[1]} ngày.`;
            if (expectedDateMatch) {
              errorMessage += ` Ngày kết thúc đúng phải là: ${expectedDateMatch[1]}`;
            }
          } else {
            errorMessage = 'Thời lượng chuyến đi không khớp với thời lượng của tour. Vui lòng kiểm tra lại ngày bắt đầu và kết thúc.';
          }
        } else if (backendMessage.includes('reserved seats') || backendMessage.includes('already reserved')) {
          // Extract reserved seats number if available
          const reservedMatch = backendMessage.match(/\((\d+)\)/);
          if (reservedMatch) {
            errorMessage = `Không thể giảm số chỗ xuống dưới số chỗ đã được đặt (${reservedMatch[1]} chỗ). Vui lòng nhập số lớn hơn hoặc bằng ${reservedMatch[1]}.`;
          } else {
            errorMessage = 'Tổng số chỗ không được nhỏ hơn số chỗ đã được đặt. Vui lòng kiểm tra lại.';
          }
        } else if (backendMessage.includes('totalSlots') || backendMessage.includes('slots')) {
          errorMessage = 'Số lượng chỗ không hợp lệ. Vui lòng kiểm tra lại.';
        } else if (backendMessage.includes('date') && backendMessage.includes('required')) {
          errorMessage = 'Vui lòng nhập đầy đủ ngày bắt đầu và ngày kết thúc.';
        } else {
          // Use backend message if available, otherwise generic message
          errorMessage = backendMessage || 'Dữ liệu chuyến đi không hợp lệ. Vui lòng kiểm tra lại thông tin.';
        }
      } else if (error.response?.status === 404) {
        errorMessage = 'Không tìm thấy chuyến đi. Chuyến đi có thể đã bị xóa.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Không thể cập nhật: xung đột với chuyến đi hoặc booking khác.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/departures/${departureId}`);
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-slate-600">Loading departure details...</p>
        </div>
      </div>
    );
  }

  if (error || !departure) {
    return (
      <Card>
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900">{error || 'Departure not found'}</h3>
          <div className="mt-6">
            <Button onClick={() => navigate('/departures')}>
              Back to Departures
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const reservedSlots = departure.totalSlots - departure.remainingSlots;

  return (
    <div className="space-y-6">
      {/* Header */}
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
            <h1 className="text-2xl font-bold text-slate-900">Edit Departure</h1>
            <p className="text-slate-600 mt-1">Update departure schedule details</p>
          </div>
        </div>
      </div>

      {/* Warning if departure has bookings */}
      {reservedSlots > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-amber-900">Departure has active bookings</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  This departure has {reservedSlots} slot(s) already booked.
                  You cannot reduce total slots below this number.
                  Changes may affect existing bookings.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      {departure.status === 'DAKHOIHANH' && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-slate-900">Departure has started</h3>
              <p className="mt-1 text-sm text-slate-600">
                This departure has already started. Exercise caution when making changes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <DepartureForm
        initialValues={{
          tourId: String(departure.tourId),
          startDate: departure.startDate,
          endDate: departure.endDate,
          totalSlots: departure.totalSlots,
          remainingSlots: departure.remainingSlots
        }}
        mode="edit"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        disableTourSelection={true}
      />
    </div>
  );
};

export default DepartureEdit;
