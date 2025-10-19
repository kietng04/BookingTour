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
        <p className="text-xs uppercase tracking-widest text-primary-500">Reserve your spot</p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900">Guest details</h3>
        <p className="text-sm text-slate-500">Complete this step and the concierge team will confirm within 12 hours.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <InputField
          label="Full name"
          placeholder="First & last name"
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
          label="Phone"
          placeholder="+1 234 567 8900"
          value={formData.phone}
          onChange={handleChange('phone')}
          icon={Phone}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Guests"
            value={formData.guests}
            onChange={handleChange('guests')}
            options={[
              { value: '1', label: '1 guest' },
              { value: '2', label: '2 guests' },
              { value: '3', label: '3 guests' },
              { value: '4', label: '4 guests' },
              { value: '5+', label: '5+ guests' }
            ]}
          />
          <InputField
            label="Preferred departure"
            type="date"
            value={formData.date}
            onChange={handleChange('date')}
            icon={Calendar}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <label className="flex flex-col gap-2 text-sm text-slate-600">
          <span className="font-medium text-slate-700">Special requests</span>
          <textarea
            rows={4}
            placeholder="Dietary restrictions, celebration plans, room setups..."
            value={formData.notes}
            onChange={handleChange('notes')}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 transition focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
          />
        </label>

        <Button type="submit" size="lg" className="w-full">
          Request booking
        </Button>
        <p className="text-xs text-slate-400">
          No payment yet. The team will confirm availability, send payment link ({tour?.policies?.payment}), and answer questions within 12 hours.
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
