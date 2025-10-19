import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';

const Login = () => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12 text-white">
    <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur">
      <div className="mb-8 space-y-3 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/20 text-primary-200">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <h1 className="text-2xl font-semibold">BookingTour Admin</h1>
        <p className="text-sm text-slate-200">Log in to manage tours, bookings, and concierge workflows.</p>
      </div>
      <form className="space-y-5">
        <Input label="Email" type="email" placeholder="you@bookingtour.com" required />
        <Input label="Password" type="password" placeholder="••••••••" required />
        <label className="flex items-center gap-2 text-xs text-slate-200">
          <input type="checkbox" className="rounded border-slate-400/50 bg-transparent text-primary-500 focus:ring-primary-300" />
          Keep me signed in
        </label>
        <Button size="lg" className="w-full">
          Sign in
        </Button>
      </form>
      <p className="mt-6 text-center text-xs text-slate-300">
        Need access? <Link to="/auth/request" className="font-semibold text-primary-200">Request admin account</Link>
      </p>
    </div>
  </div>
);

export default Login;
