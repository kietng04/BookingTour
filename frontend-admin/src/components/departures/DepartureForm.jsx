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
  const totalSlots = watch('totalSlots');

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

  // Calculate reserved slots for edit mode
  const reservedSlots = mode === 'edit' && initialValues
    ? (initialValues.totalSlots - initialValues.remainingSlots)
    : 0;

  const validateEndDate = (value) => {
    console.log('[DepartureForm] validateEndDate called with value:', value, 'typeof:', typeof value);
    if (!value || value === '') return 'Ngày kết thúc là bắt buộc';
    if (!startDate) return true;
    return new Date(value) >= new Date(startDate) || 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu';
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
            <option value="">Chọn một tour</option>
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
