import PropTypes from 'prop-types';
import { CalendarDays, CreditCard, LifeBuoy, Users } from 'lucide-react';
import Card from '../common/Card.jsx';
import { formatCurrency, formatDate } from '../../utils/format.js';

const BookingSummary = ({ tour, guests, date }) => {
  const totalAmount = tour.price * Number(guests || 1);
  const deposit = totalAmount * 0.2;

  return (
    <Card className="space-y-6 bg-slate-900 text-slate-100">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary-200">Summary</p>
        <h3 className="mt-1 text-lg font-semibold text-white">{tour.name}</h3>
        <p className="text-sm text-slate-300">{tour.destination}</p>
      </div>

      <div className="space-y-4 text-sm text-slate-200">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-800 px-4 py-3">
          <Users className="h-5 w-5 text-primary-300" />
          <div>
            <p className="font-medium">Guests</p>
            <p className="text-slate-400">{guests} travelers</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-slate-800 px-4 py-3">
          <CalendarDays className="h-5 w-5 text-primary-300" />
          <div>
            <p className="font-medium">Preferred date</p>
            <p className="text-slate-400">{date ? formatDate(date) : 'Flexible'}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-800 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300">Total investment</span>
          <span className="text-base font-semibold text-white">{formatCurrency(totalAmount)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-slate-400">
          <span>Secure deposit (20%)</span>
          <span>{formatCurrency(deposit)}</span>
        </div>
      </div>

      <div className="space-y-3 text-xs text-slate-400">
        <div className="flex items-start gap-2">
          <CreditCard className="mt-0.5 h-4 w-4 text-primary-300" />
          <p>{tour.policies.payment}</p>
        </div>
        <div className="flex items-start gap-2">
          <LifeBuoy className="mt-0.5 h-4 w-4 text-primary-300" />
          <p>Dedicated concierge curates transfers, experiences, and special touches once confirmed.</p>
        </div>
      </div>
    </Card>
  );
};

BookingSummary.propTypes = {
  tour: PropTypes.shape({
    name: PropTypes.string.isRequired,
    destination: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    policies: PropTypes.object.isRequired
  }).isRequired,
  guests: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  date: PropTypes.string
};

export default BookingSummary;
