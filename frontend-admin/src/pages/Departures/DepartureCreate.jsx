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

  // Get tourId from query params if coming from TourEdit
  const tourIdFromQuery = searchParams.get('tourId');

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await departuresAPI.create(data.tourId, {
        startDate: data.startDate,
        endDate: data.endDate,
        totalSlots: data.totalSlots
      });

      toast.success('Đã tạo chuyến đi thành công!');

      // Always redirect to departures list after creating
      navigate('/departures', {
        state: {
          successMessage: 'Đã tạo chuyến đi thành công',
          highlightId: response.departureId || response.id
        }
      });
    } catch (error) {
      console.error('Failed to create departure:', error);

      // Handle specific error cases with Vietnamese messages
      let errorMessage = 'Không thể tạo chuyến đi';

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
        } else if (backendMessage.includes('totalSlots') || backendMessage.includes('slots')) {
          errorMessage = 'Số lượng chỗ không hợp lệ. Vui lòng kiểm tra lại.';
        } else if (backendMessage.includes('date') && backendMessage.includes('required')) {
          errorMessage = 'Vui lòng nhập đầy đủ ngày bắt đầu và ngày kết thúc.';
        } else {
          // Use backend message if available, otherwise generic message
          errorMessage = backendMessage || 'Dữ liệu chuyến đi không hợp lệ. Vui lòng kiểm tra lại thông tin.';
        }
      } else if (error.response?.status === 404) {
        errorMessage = 'Không tìm thấy tour. Vui lòng chọn tour khác.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Đã tồn tại chuyến đi cho khoảng thời gian này. Vui lòng chọn ngày khác.';
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
            <h1 className="text-2xl font-bold text-slate-900">Create New Departure</h1>
            <p className="text-slate-600 mt-1">Add a new departure schedule for a tour</p>
          </div>
        </div>
      </div>

      {/* Info Card */}
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

      {/* Form */}
      <DepartureForm
        initialValues={tourIdFromQuery ? { tourId: String(tourIdFromQuery) } : undefined}
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
