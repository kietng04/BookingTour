import { Link } from 'react-router-dom';
import { LockKeyhole, Mail } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import InputField from '../components/common/InputField.jsx';

const Login = () => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-12">
    <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-soft">
      <div className="mb-8 space-y-3 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-500">
          <LockKeyhole className="h-5 w-5" />
        </span>
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">Access your curated itineraries, saved tours, and concierge messages.</p>
      </div>
      <form className="space-y-5">
        <InputField label="Email address" type="email" icon={Mail} placeholder="you@email.com" required />
        <InputField label="Password" type="password" placeholder="••••••••" required />
        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2 text-slate-500">
            <input type="checkbox" className="rounded border-slate-300 text-primary-500 focus:ring-primary-500" />
            Remember me
          </label>
          <Link to="/auth/forgot" className="font-medium text-primary-500">Forgot password?</Link>
        </div>
        <Button size="lg" className="w-full">
          Log in
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        New to BookingTour?{' '}
        <Link to="/auth/register" className="font-semibold text-primary-500">Create account</Link>
      </p>
    </div>
  </div>
);

export default Login;
