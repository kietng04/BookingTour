import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import Card from '../common/Card.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import Button from '../common/Button.jsx';
import ImageUpload from '../common/ImageUpload.jsx';

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'UNACTIVE', label: 'Inactive' },
  { value: 'FULL', label: 'Full' },
  { value: 'END', label: 'Ended' }
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
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: { ...defaultValues, ...initialValues }
  });

  const heroImageValue = watch('heroImageUrl');

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

          <Select
            label="Trạng thái"
            options={statusOptions}
            {...register('status')}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Region ID"
              type="number"
              min={1}
              placeholder="1"
              {...register('regionId', {
                required: 'Region ID là bắt buộc',
                valueAsNumber: true
              })}
              error={errors.regionId?.message}
              disabled={submitting}
            />

            <Input
              label="Province ID"
              type="number"
              min={1}
              placeholder="1"
              {...register('provinceId', {
                required: 'Province ID là bắt buộc',
                valueAsNumber: true
              })}
              error={errors.provinceId?.message}
              disabled={submitting}
            />
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
              <p className="text-xs text-slate-500 mb-2 font-medium">Preview:</p>
              <img
                src={heroImageValue}
                alt="Hero preview"
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
