import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Card from '../common/Card';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { toursAPI } from '../../services/api';

const DepartureForm = ({
  initialValues,
  mode = 'create',
  onSubmit,
  onCancel,
  isLoading = false,
  disableTourSelection = false
}) => {
  const [tours, setTours] = useState([]);
  const [loadingTours, setLoadingTours] = useState(true);
  const [selectedTour, setSelectedTour] = useState(null);
  const [loadingTourDetails, setLoadingTourDetails] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: initialValues || {
      tourId: '',
      startDate: '',
      endDate: '',
      totalSlots: ''
    }
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const totalSlots = watch('totalSlots');
  const tourId = watch('tourId');

  // Fetch tours for selection
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await toursAPI.getAll({ status: 'ACTIVE' });
        const toursArray = data.content || data || [];
        // Normalize tour data to ensure tourId field exists
        const normalizedTours = toursArray.map(tour => ({
          ...tour,
          tourId: tour.id ?? tour.tourId,
          tourName: tour.tourName || tour.tour_name
        }));
        setTours(normalizedTours);
      } catch (error) {
        console.error('Failed to fetch tours:', error);
        setTours([]);
      } finally {
        setLoadingTours(false);
      }
    };
    fetchTours();
  }, []);

  // Auto-select tour from initialValues AFTER tours are loaded
  useEffect(() => {
    // Only run when tours are loaded and we have initialValues with tourId
    if (!loadingTours && tours.length > 0 && initialValues?.tourId) {
      const tourIdStr = String(initialValues.tourId);

      // Verify tour exists in the loaded tours list
      const tourExists = tours.some(t => String(t.tourId) === tourIdStr);

      if (tourExists) {
        console.log('[DepartureForm] Auto-selecting tour:', tourIdStr);
        setValue('tourId', tourIdStr, { shouldValidate: true });
      } else {
        console.warn('[DepartureForm] Tour not found in list:', tourIdStr);
      }
    }
  }, [loadingTours, tours, initialValues, setValue]);

  // Fetch tour details when tourId changes
  useEffect(() => {
    const fetchTourDetails = async () => {
      if (!tourId) {
        setSelectedTour(null);
        return;
      }

      try {
        setLoadingTourDetails(true);
        const tourDetails = await toursAPI.getById(tourId);
        setSelectedTour(tourDetails);
      } catch (error) {
        console.error('Failed to fetch tour details:', error);
        setSelectedTour(null);
      } finally {
        setLoadingTourDetails(false);
      }
    };

    fetchTourDetails();
  }, [tourId]);

  // Auto-calculate endDate when startDate changes (based on tour duration)
  useEffect(() => {
    if (startDate && selectedTour?.days && mode === 'create') {
      const start = new Date(startDate);
      const expectedEndDate = new Date(start);
      expectedEndDate.setDate(start.getDate() + selectedTour.days - 1);

      const expectedEndDateStr = expectedEndDate.toISOString().split('T')[0];
      setValue('endDate', expectedEndDateStr);
    }
  }, [startDate, selectedTour, mode, setValue]);

  // Calculate reserved slots for edit mode
  const reservedSlots = mode === 'edit' && initialValues
    ? (initialValues.totalSlots - initialValues.remainingSlots)
    : 0;

  const validateEndDate = (value) => {
    console.log('[DepartureForm] validateEndDate called with value:', value, 'typeof:', typeof value);
    if (!value || value === '') return 'Ngày kết thúc là bắt buộc';
    if (!startDate) return true;

    const start = new Date(startDate);
    const end = new Date(value);

    // Check end date is not before start date
    if (end < start) {
      return 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu';
    }

    // Removed strict validation - allow flexible departure dates
    // This enables creating custom duration departures for business flexibility

    return true;
  };

  const validateTotalSlots = (value) => {
    console.log('[DepartureForm] validateTotalSlots called with value:', value, 'typeof:', typeof value);
    if (!value || value === '') return 'Tổng số chỗ là bắt buộc';
    const numValue = parseInt(value);
    if (numValue < 1) return 'Phải có ít nhất 1 chỗ';
    if (!Number.isInteger(Number(value))) return 'Phải là số nguyên';
    if (mode === 'edit' && numValue < reservedSlots) {
      return `Không thể nhỏ hơn số chỗ đã đặt (${reservedSlots})`;
    }
    return true;
  };

  const validateStartDate = (value) => {
    console.log('[DepartureForm] validateStartDate called with value:', value, 'typeof:', typeof value);
    if (!value || value === '') return 'Ngày bắt đầu là bắt buộc';
    if (mode === 'create') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(value);
      if (selectedDate < today) {
        return 'Không thể tạo chuyến đi trong quá khứ';
      }
    }
    return true;
  };

  const handleFormSubmit = (data) => {
    console.log('[DepartureForm] handleFormSubmit called with data:', data);
    console.log('[DepartureForm] Form errors:', errors);
    onSubmit({
      ...data,
      tourId: parseInt(data.tourId),
      totalSlots: parseInt(data.totalSlots)
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Tour Selection */}
        <div>
          <Select
            label="Tour"
            {...register('tourId', {
              required: mode === 'edit' ? false : 'Tour là bắt buộc'
            })}
            error={errors.tourId?.message}
            disabled={disableTourSelection || loadingTours || mode === 'edit'}
          >
            <option value="">
              {loadingTours ? 'Đang tải danh sách tour...' : 'Chọn một tour'}
            </option>
            {tours.map((tour) => (
              <option key={tour.tourId} value={String(tour.tourId)}>
                {tour.tourName}
              </option>
            ))}
          </Select>
          {mode === 'edit' && (
            <p className="mt-1 text-sm text-slate-500">
              Không thể thay đổi tour cho chuyến đi đã tồn tại
            </p>
          )}
          {disableTourSelection && mode === 'create' && (
            <p className="mt-1 text-sm text-blue-600">
              ℹ️ Tour đã được chọn tự động từ trang chi tiết tour
            </p>
          )}
          {selectedTour && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-900">
                <span className="font-medium">Thời lượng tour gốc:</span> {selectedTour.days} ngày {selectedTour.nights} đêm
              </p>
              {mode === 'create' && (
                <p className="text-xs text-blue-700 mt-1">
                  Ngày kết thúc sẽ được tự động điền (có thể chỉnh sửa để tạo lịch linh hoạt)
                </p>
              )}
            </div>
          )}
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Ngày bắt đầu"
              type="date"
              {...register('startDate', { validate: validateStartDate })}
              error={errors.startDate?.message}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Ngày kết thúc"
              type="date"
              {...register('endDate', { validate: validateEndDate })}
              error={errors.endDate?.message}
              disabled={isLoading}
              min={startDate}
            />
          </div>
        </div>

        {/* Duration Warning/Info */}
        {startDate && endDate && selectedTour && (() => {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const actualDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
          const expectedDays = selectedTour.days;

          if (actualDays !== expectedDays) {
            const expectedEnd = new Date(start);
            expectedEnd.setDate(start.getDate() + expectedDays - 1);
            const expectedEndStr = expectedEnd.toISOString().split('T')[0];

            return (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-amber-900">Lịch trình linh hoạt</h3>
                    <p className="mt-1 text-sm text-amber-700">
                      Tour gốc có thời lượng <strong>{expectedDays} ngày</strong>, nhưng bạn đang tạo chuyến đi <strong>{actualDays} ngày</strong>.
                      {actualDays < expectedDays && (
                        <> Đây là chuyến đi rút ngắn so với tour gốc.</>
                      )}
                      {actualDays > expectedDays && (
                        <> Đây là chuyến đi kéo dài hơn tour gốc.</>
                      )}
                    </p>
                    <p className="mt-2 text-xs text-amber-600">
                      💡 Ngày kết thúc chuẩn: <strong>{expectedEndStr}</strong> (cho chuyến đi {expectedDays} ngày)
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-green-700">
                  Thời lượng chuyến đi khớp với tour gốc ({actualDays} ngày)
                </p>
              </div>
            </div>
          );
        })()}

        {/* Total Slots */}
        <div>
          <Input
            label="Tổng số chỗ"
            type="number"
            min="1"
            step="1"
            {...register('totalSlots', { validate: validateTotalSlots })}
            error={errors.totalSlots?.message}
            disabled={isLoading}
          />
          {mode === 'edit' && reservedSlots > 0 && (
            <p className="mt-1 text-sm text-amber-600">
              ⚠️ {reservedSlots} chỗ đã được đặt. Không thể đặt thấp hơn số này.
            </p>
          )}
        </div>

        {/* Remaining Slots Info (Edit Mode) */}
        {mode === 'edit' && initialValues && (
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-medium text-slate-900 mb-2">Trạng thái hiện tại</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Tổng số chỗ</p>
                <p className="font-semibold text-slate-900">{initialValues.totalSlots}</p>
              </div>
              <div>
                <p className="text-slate-600">Đã đặt</p>
                <p className="font-semibold text-amber-600">{reservedSlots}</p>
              </div>
              <div>
                <p className="text-slate-600">Còn trống</p>
                <p className="font-semibold text-green-600">{initialValues.remainingSlots}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 md:flex-initial"
          >
            {isLoading ? 'Đang lưu...' : mode === 'edit' ? 'Cập nhật chuyến đi' : 'Tạo chuyến đi'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Hủy
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default DepartureForm;
