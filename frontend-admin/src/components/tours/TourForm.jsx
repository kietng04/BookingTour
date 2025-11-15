import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import Card from '../common/Card.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import Button from '../common/Button.jsx';
import ImageUpload from '../common/ImageUpload.jsx';
import { regionsAPI } from '../../services/api.js';

const statusOptions = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'UNACTIVE', label: 'Không hoạt động' },
  { value: 'FULL', label: 'Đã đầy' },
  { value: 'END', label: 'Đã kết thúc' }
];

const defaultValues = {
  tourName: '',
  slug: '',
  status: 'ACTIVE',
  regionId: '',
  provinceId: '',
  description: '',
  days: '',
  nights: '',
  departurePoint: '',
  mainDestination: '',
  adultPrice: '',
  childPrice: '',
  heroImageUrl: ''
};

const TourForm = ({ onSubmit, initialValues, mode, submitting = false }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    defaultValues: { ...defaultValues, ...initialValues }
  });

  const heroImageValue = watch('heroImageUrl');
  const selectedRegionId = watch('regionId');

  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingProvinces, setLoadingProvinces] = useState(false);

  // Fetch regions on component mount
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoadingRegions(true);
        const data = await regionsAPI.getAll();
        setRegions(data || []);
      } catch (error) {
        console.error('Failed to fetch regions:', error);
        setRegions([]);
      } finally {
        setLoadingRegions(false);
      }
    };
    fetchRegions();
  }, []);

  // Reset form when initialValues change AND regions are loaded (for edit mode)
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0 && !loadingRegions && regions.length > 0) {
      const formData = { ...defaultValues, ...initialValues };
      // Ensure regionId and provinceId are numbers (not empty string) for Select with valueAsNumber
      if (formData.regionId) {
        const regionIdNum = Number(formData.regionId);
        formData.regionId = regionIdNum;
        // Set value explicitly to ensure Select displays correctly
        setValue('regionId', regionIdNum, { shouldValidate: false });
      }
      if (formData.provinceId) {
        const provinceIdNum = Number(formData.provinceId);
        formData.provinceId = provinceIdNum;
      }
      reset(formData, { keepDefaultValues: false });
    }
  }, [initialValues, reset, loadingRegions, regions.length, setValue]);

  // Fetch provinces when region changes (either from user selection or initialValues)
  useEffect(() => {
    const fetchProvinces = async () => {
      // Use selectedRegionId from watch, or fallback to initialValues.regionId
      const regionId = selectedRegionId || (initialValues?.regionId ? Number(initialValues.regionId) : null);
      
      if (!regionId) {
        setProvinces([]);
        return;
      }

      try {
        setLoadingProvinces(true);
        const data = await regionsAPI.getProvinces(regionId);
        setProvinces(data || []);
        
        // After provinces are loaded, set provinceId from initialValues if available
        if (initialValues?.provinceId && data && data.length > 0) {
          const provinceIdNum = Number(initialValues.provinceId);
          // Set immediately - provinces are already loaded
          setValue('provinceId', provinceIdNum, { shouldValidate: false });
        }
      } catch (error) {
        console.error('Failed to fetch provinces:', error);
        setProvinces([]);
      } finally {
        setLoadingProvinces(false);
      }
    };
    
    // Only fetch if regions are loaded (to avoid race condition)
    if (!loadingRegions) {
      fetchProvinces();
    }
  }, [selectedRegionId, initialValues, setValue, loadingRegions]);

  return (
    <form className="grid gap-6 lg:grid-cols-[2fr_1fr]" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        {/* Basic Information */}
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Thông tin cơ bản</h3>

          <Input
            label="Tên tour"
            placeholder="Ví dụ: Du lịch Đà Lạt 3 ngày 2 đêm"
            {...register('tourName', { required: 'Tên tour là bắt buộc' })}
            error={errors.tourName?.message}
            disabled={submitting}
          />

          <Input
            label="Slug (URL thân thiện)"
            placeholder="du-lich-da-lat-3-ngay-2-dem"
            {...register('slug', { required: 'Slug là bắt buộc' })}
            error={errors.slug?.message}
            disabled={submitting}
          />

          {mode === 'edit' && (
            <Select
              label="Trạng thái"
              options={statusOptions}
              {...register('status')}
            />
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Vùng miền"
              {...register('regionId', {
                required: 'Vùng miền là bắt buộc',
                valueAsNumber: true
              })}
              error={errors.regionId?.message}
              disabled={submitting || loadingRegions}
              key={`region-select-${selectedRegionId || initialValues?.regionId || 'empty'}`}
            >
              <option value="">{loadingRegions ? 'Đang tải...' : 'Chọn vùng miền'}</option>
              {regions.map(region => (
                <option key={region.id} value={String(region.id)}>
                  {region.name || region.regionName || `Region ${region.id}`}
                </option>
              ))}
            </Select>

            <Select
              label="Tỉnh/Thành phố"
              {...register('provinceId', {
                required: 'Tỉnh/Thành phố là bắt buộc',
                valueAsNumber: true
              })}
              error={errors.provinceId?.message}
              disabled={submitting || (!selectedRegionId && !initialValues?.regionId) || loadingProvinces}
              key={`province-select-${watch('provinceId') || initialValues?.provinceId || 'empty'}-${provinces.length}`}
            >
              <option value="">
                {!selectedRegionId && !initialValues?.regionId 
                  ? 'Chọn vùng miền trước' 
                  : (loadingProvinces ? 'Đang tải...' : 'Chọn tỉnh/thành phố')}
              </option>
              {provinces.map(province => (
                <option key={province.id} value={String(province.id)}>
                  {province.name || province.provinceName || `Province ${province.id}`}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Mô tả tour
            </label>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-slate-50 disabled:text-slate-500"
              rows={4}
              placeholder="Mô tả chi tiết về tour..."
              {...register('description')}
              disabled={submitting}
            />
          </div>
        </Card>

        {/* Location & Duration */}
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Địa điểm & Thời gian</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Điểm khởi hành"
              placeholder="TP. Hồ Chí Minh"
              {...register('departurePoint')}
              disabled={submitting}
            />

            <Input
              label="Điểm đến chính"
              placeholder="Đà Lạt"
              {...register('mainDestination')}
              disabled={submitting}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Số ngày"
              type="number"
              min={1}
              placeholder="3"
              {...register('days', { valueAsNumber: true })}
              disabled={submitting}
            />

            <Input
              label="Số đêm"
              type="number"
              min={0}
              placeholder="2"
              {...register('nights', { valueAsNumber: true })}
              disabled={submitting}
            />
          </div>
        </Card>

        {/* Pricing */}
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Giá tour</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Giá người lớn (VND)"
              type="number"
              min={0}
              step="1000"
              placeholder="5000000"
              {...register('adultPrice', { valueAsNumber: true })}
              disabled={submitting}
            />

            <Input
              label="Giá trẻ em (VND)"
              type="number"
              min={0}
              step="1000"
              placeholder="3000000"
              {...register('childPrice', { valueAsNumber: true })}
              disabled={submitting}
            />
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Hero Image */}
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Ảnh đại diện</h3>
          <p className="text-xs text-slate-500">Tải ảnh lên Cloudinary. Ảnh sẽ được tối ưu tự động.</p>

          <ImageUpload
            onUploadSuccess={(imageUrl) => {
              setValue('heroImageUrl', imageUrl);
            }}
            multiple={false}
          />

          {heroImageValue && (
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500 mb-2 font-medium">Xem trước:</p>
              <img
                src={heroImageValue}
                alt="Ảnh xem trước"
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <p className="text-xs text-slate-600 font-mono break-all">
                {heroImageValue}
              </p>
            </div>
          )}
        </Card>

        {/* Submit */}
        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {mode === 'edit' ? 'Cập nhật tour' : 'Tạo tour mới'}
          </h3>
          <p className="text-sm text-slate-500">
            {mode === 'edit'
              ? 'Lưu thay đổi vào database.'
              : 'Tạo tour mới. Tour sẽ được lưu với trạng thái đã chọn.'}
          </p>
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? 'Đang xử lý...' : (mode === 'edit' ? 'Cập nhật' : 'Tạo mới')}
          </Button>
        </Card>
      </div>
    </form>
  );
};

TourForm.propTypes = {
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  mode: PropTypes.oneOf(['create', 'edit']),
  submitting: PropTypes.bool
};

export default TourForm;
