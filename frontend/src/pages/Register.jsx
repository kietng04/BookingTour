import { Link } from 'react-router-dom';
import { Mail, Phone, UserPlus } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import InputField from '../components/common/InputField.jsx';

const Register = () => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-slate-100 px-4 py-12">
    <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 shadow-soft">
      <div className="mb-8 space-y-3 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-500">
          <UserPlus className="h-5 w-5" />
        </span>
        <h1 className="text-2xl font-semibold text-slate-900">Create a BookingTour account</h1>
        <p className="text-sm text-slate-500">Save journeys, receive tailored recommendations, and chat with your concierge.</p>
      </div>
      <form className="grid gap-5 md:grid-cols-2">
        <InputField label="First name" placeholder="First name" required />
        <InputField label="Last name" placeholder="Last name" required />
        <InputField label="Email" type="email" icon={Mail} placeholder="you@email.com" required className="md:col-span-2" />
        <InputField label="Phone number" icon={Phone} placeholder="+1 234 567 8900" className="md:col-span-2" />
        <InputField label="Password" type="password" placeholder="Create a strong password" className="md:col-span-2" required />
        <label className="flex items-start gap-3 text-xs text-slate-500 md:col-span-2">
          <input type="checkbox" className="mt-1 rounded border-slate-300 text-primary-500 focus:ring-primary-500" />
          Subscribe to curated travel stories and early-access journeys.
        </label>
        <Button size="lg" className="w-full md:col-span-2">
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-semibold text-primary-500">Sign in</Link>
      </p>
    </div>
  </div>
);

export default Register;
