import { useState } from 'react';
import PropTypes from 'prop-types';
import { Calendar, Mail, Phone, User } from 'lucide-react';
import Card from '../common/Card.jsx';
import InputField from '../common/InputField.jsx';
import SelectField from '../common/SelectField.jsx';
import Button from '../common/Button.jsx';

const BookingForm = ({ tour, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    guests: '2',
    date: '',
    notes: ''
  });

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <Card className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary-500">Giữ chỗ ngay</p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900">Thông tin liên hệ</h3>
        <p className="text-sm text-slate-500">Hoàn tất bước này, đội concierge sẽ xác nhận trong vòng 12 giờ.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <InputField
          label="Họ và tên"
          placeholder="Ví dụ: Nguyễn Văn A"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          icon={User}
          required
        />
        <InputField
          label="Email"
          type="email"
          placeholder="you@email.com"
          value={formData.email}
          onChange={handleChange('email')}
          icon={Mail}
          required
        />
        <InputField
          label="Số điện thoại"
          placeholder="Ví dụ: 0901 234 567"
          value={formData.phone}
          onChange={handleChange('phone')}
          icon={Phone}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Số khách"
            value={formData.guests}
            onChange={handleChange('guests')}
            options={[
              { value: '1', label: '1 khách' },
              { value: '2', label: '2 khách' },
              { value: '3', label: '3 khách' },
              { value: '4', label: '4 khách' },
              { value: '5+', label: '5+ khách' }
            ]}
          />
          <InputField
            label="Ngày khởi hành dự kiến"
            type="date"
            value={formData.date}
            onChange={handleChange('date')}
            icon={Calendar}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <label className="flex flex-col gap-2 text-sm text-slate-600">
          <span className="font-medium text-slate-700">Yêu cầu đặc biệt</span>
          <textarea
            rows={4}
            placeholder="Chế độ ăn kiêng, dịp kỷ niệm, nhu cầu phòng riêng..."
            value={formData.notes}
            onChange={handleChange('notes')}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 transition focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
          />
        </label>

        <Button type="submit" size="lg" className="w-full">
          Gửi yêu cầu đặt tour
        </Button>
        <p className="text-xs text-slate-400">
          Chưa thu tiền ở bước này. Đội ngũ sẽ kiểm tra chỗ, gửi liên kết thanh toán ({tour?.policies?.payment}) và giải đáp mọi thắc mắc trong 12 giờ.
        </p>
      </form>
    </Card>
  );
};

BookingForm.propTypes = {
  tour: PropTypes.object,
  onSubmit: PropTypes.func
};

export default BookingForm;
