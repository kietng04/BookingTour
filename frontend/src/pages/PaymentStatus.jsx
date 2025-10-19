import { useParams, Link } from 'react-router-dom';
import { BadgeCheck, Hourglass, ShieldAlert } from 'lucide-react';
import Button from '../components/common/Button.jsx';

const statusConfig = {
  success: {
    icon: BadgeCheck,
    title: 'Payment confirmed',
    message: 'Your booking is locked in. Expect an itinerary concierge email in the next few minutes.',
    action: { label: 'View my bookings', to: '/profile' }
  },
  failed: {
    icon: ShieldAlert,
    title: 'Payment unsuccessful',
    message: 'The transaction did not complete. Update your payment method or reach out to your concierge.',
    action: { label: 'Explore tours', to: '/tours' }
  },
  pending: {
    icon: Hourglass,
    title: 'Payment pending confirmation',
    message: 'We are waiting for the payment provider to confirm the transaction. This usually takes under two minutes.',
    action: { label: 'Check my bookings', to: '/profile' }
  }
};

const PaymentStatus = () => {
  const { status } = useParams();
  const normalizedStatus = status?.toLowerCase?.() ?? 'failed';
  const config = statusConfig[normalizedStatus] ?? statusConfig.failed;
  const Icon = config.icon;

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-20">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-soft">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-500">
          <Icon className="h-8 w-8" />
        </span>
        <h1 className="mt-6 text-2xl font-semibold text-slate-900">{config.title}</h1>
        <p className="mt-3 text-sm text-slate-500">{config.message}</p>
        <div className="mt-8">
          <Button to={config.action.to} size="lg" className="w-full">
            {config.action.label}
          </Button>
        </div>
        <Link to="/" className="mt-6 inline-block text-sm text-primary-500">Back to homepage</Link>
      </div>
    </div>
  );
};

export default PaymentStatus;
