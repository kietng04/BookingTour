import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { differenceInCalendarDays } from 'date-fns';
import { CheckCircle2, Download, Mail, Phone, Sparkles } from 'lucide-react';
import BookingStepper from '../components/booking/BookingStepper';
import BookingSummary from '../components/booking/BookingSummary';
import GuestSelector from '../components/forms/GuestSelector';
import { tours } from '../data/tours';

interface DetailsFormValues {
  guests: number;
  dateRange: [Date | null, Date | null];
  specialRequests?: string;
}

interface TravelerFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  termsAccepted: boolean;
}

interface PaymentFormValues {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  billingAddress: string;
}

const BookingPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const tour = tours.find((item) => item.slug === slug);
  const [currentStep, setCurrentStep] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [reservation, setReservation] = useState<{ guests: number; startDate?: Date; endDate?: Date }>({
    guests: 2,
  });
  const [traveler, setTraveler] = useState<TravelerFormValues | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const detailsForm = useForm<DetailsFormValues>({
    defaultValues: {
      guests: reservation.guests,
      dateRange: [reservation.startDate ?? null, reservation.endDate ?? null],
      specialRequests: '',
    },
  });

  const travelerForm = useForm<TravelerFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      nationality: '',
      termsAccepted: false,
    },
  });

  const paymentForm = useForm<PaymentFormValues>({
    defaultValues: {
      cardHolder: '',
      cardNumber: '',
      expiry: '',
      cvc: '',
      billingAddress: '',
    },
  });

  const nights = useMemo(() => {
    if (reservation.startDate && reservation.endDate) {
      const diff = differenceInCalendarDays(reservation.endDate, reservation.startDate);
      return Math.max(diff, 1);
    }
    return 1;
  }, [reservation.endDate, reservation.startDate]);

  const estimatedTotal = useMemo(() => {
    if (!tour) return 0;
    return tour.priceFrom + tour.priceFrom * 0.12 * reservation.guests + nights * 120;
  }, [nights, reservation.guests, tour]);

  const handleToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const onSubmitDetails: SubmitHandler<DetailsFormValues> = (values) => {
    const [start, end] = values.dateRange;
    setReservation({
      guests: values.guests,
      startDate: start ?? undefined,
      endDate: end ?? undefined,
    });
    setCurrentStep(2);
    handleToast('Great choice! Tell us who is joining this trip.');
  };

  const onSubmitTraveler: SubmitHandler<TravelerFormValues> = (values) => {
    setTraveler(values);
    setCurrentStep(3);
    handleToast('Traveler details saved. Secure your booking with payment.');
  };

  const onSubmitPayment: SubmitHandler<PaymentFormValues> = (values) => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      handleToast('Payment authorized. You are all set!');
      setCurrentStep(4);
    }, 2000);
  };

  if (!tour) {
    return (
    <main id="main-content" className="container min-h-[60vh] py-20">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Tour not found</p>
          <h1 className="mt-3 text-3xl font-semibold text-gray-900">This experience is unavailable</h1>
          <p className="mt-3 text-sm text-gray-600">
            The tour may have been updated or removed. Discover our handpicked alternatives.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 inline-flex items-center rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-600 focus-visible:bg-brand-600"
          >
            Browse tours
          </button>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="bg-gray-25 pb-16">
      <div className="container space-y-10 py-10 lg:py-16">
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm font-semibold text-gray-600 transition hover:text-gray-900 focus-visible:text-gray-900"
          >
            ← Back to details
          </button>
          <h1 className="text-3xl font-semibold text-gray-900 md:text-4xl">Secure your booking</h1>
          <p className="max-w-2xl text-sm text-gray-600">
            Complete the checkout in a few guided steps. Your reservation is held for the next 15 minutes.
          </p>
        </div>

        <BookingStepper currentStep={currentStep} />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.section
                  key="step-1"
                  className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card lg:p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900">1. Trip details</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Choose your preferred travel dates and tell us how many guests are attending.
                  </p>
                  <form onSubmit={detailsForm.handleSubmit(onSubmitDetails)} className="mt-6 space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                          Travel dates
                        </label>
                        <Controller
                          control={detailsForm.control}
                          name="dateRange"
                          rules={{
                            validate: ([start, end]) => {
                              if (!start || !end) {
                                return 'Please select both check-in and check-out dates.';
                              }
                              return true;
                            },
                          }}
                          render={({ field: { onChange, value } }) => (
                            <DatePicker
                              selectsRange
                              startDate={value?.[0] ?? null}
                              endDate={value?.[1] ?? null}
                              onChange={(update) => {
                                if (Array.isArray(update)) {
                                  onChange(update);
                                }
                              }}
                              minDate={new Date()}
                              placeholderText="Select dates"
                              className="w-full rounded-xl border border-gray-200 py-3 px-4 text-sm font-medium text-gray-900 focus:border-brand-300"
                            />
                          )}
                        />
                        {detailsForm.formState.errors.dateRange && (
                          <p className="text-xs font-medium text-error">
                            {detailsForm.formState.errors.dateRange.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                          Guests
                        </span>
                        <Controller
                          control={detailsForm.control}
                          name="guests"
                          rules={{
                            required: 'Let us know how many guests will travel.',
                            min: { value: 1, message: 'At least one guest is required.' },
                            max: { value: 12, message: 'For groups larger than 12, contact our team.' },
                          }}
                          render={({ field: { value, onChange } }) => (
                            <GuestSelector value={value ?? 2} onChange={onChange} min={1} max={12} />
                          )}
                        />
                        {detailsForm.formState.errors.guests && (
                          <p className="text-xs font-medium text-error">
                            {detailsForm.formState.errors.guests.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="specialRequests"
                        className="text-xs font-semibold uppercase tracking-widest text-gray-500"
                      >
                        Special requests (optional)
                      </label>
                      <textarea
                        id="specialRequests"
                        rows={4}
                        {...detailsForm.register('specialRequests')}
                        className="w-full rounded-xl border border-gray-200 py-3 px-4 text-sm font-medium text-gray-900 focus:border-brand-300"
                        placeholder="Food allergies, celebrations, mobility requests..."
                      />
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/tours/${tour.slug}`)}
                        className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-300 hover:text-gray-900 focus-visible:border-brand-300"
                      >
                        Review itinerary
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600 focus-visible:bg-brand-600"
                      >
                        Continue to traveler info →
                      </button>
                    </div>
                  </form>
                </motion.section>
              )}

              {currentStep === 2 && (
                <motion.section
                  key="step-2"
                  className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card lg:p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900">2. Traveler information</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    We need main traveler details to secure reservations and share your travel documents.
                  </p>
                  <form onSubmit={travelerForm.handleSubmit(onSubmitTraveler)} className="mt-6 space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="text-xs font-semibold uppercase tracking-widest text-gray-500"
                        >
                          First name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          {...travelerForm.register('firstName', { required: 'Please provide your first name.' })}
                          className="mt-2 w-full rounded-xl border border-gray-200 py-3 px-4 text-sm font-medium text-gray-900 focus:border-brand-300"
                        />
                        {travelerForm.formState.errors.firstName && (
                          <p className="mt-1 text-xs font-medium text-error">
                            {travelerForm.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="text-xs font-semibold uppercase tracking-widest text-gray-500"
                        >
                          Last name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          {...travelerForm.register('lastName', { required: 'Please provide your surname.' })}
                          className="mt-2 w-full rounded-xl border border-gray-200 py-3 px-4 text-sm font-medium text-gray-900 focus:border-brand-300"
                        />
                        {travelerForm.formState.errors.lastName && (
                          <p className="mt-1 text-xs font-medium text-error">
                            {travelerForm.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="email"
                          className="text-xs font-semibold uppercase tracking-widest text-gray-500"
                        >
                          Email address
                        </label>
                        <div className="relative mt-2">
                          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            id="email"
                            type="email"
                            {...travelerForm.register('email', {
                              required: 'We use your email to send confirmations.',
                              pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email address.' },
                            })}
                            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm font-medium text-gray-900 focus:border-brand-300"
                          />
                        </div>
                        {travelerForm.formState.errors.email && (
                          <p className="mt-1 text-xs font-medium text-error">
                            {travelerForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="text-xs font-semibold uppercase tracking-widest text-gray-500"
                        >
                          Phone number
                        </label>
                        <div className="relative mt-2">
                          <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            id="phone"
                            type="tel"
                            {...travelerForm.register('phone', {
                              required: 'We need a phone number for travel updates.',
                            })}
                            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm font-medium text-gray-900 focus:border-brand-300"
                          />
                        </div>
                        {travelerForm.formState.errors.phone && (
                          <p className="mt-1 text-xs font-medium text-error">
                            {travelerForm.formState.errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="nationality"
                        className="text-xs font-semibold uppercase tracking-widest text-gray-500"
                      >
                        Nationality
                      </label>
                      <input
                        id="nationality"
                        type="text"
                        {...travelerForm.register('nationality', {
                          required: 'Nationality helps us advise on travel documentation.',
                        })}
                        className="mt-2 w-full rounded-xl border border-gray-200 py-3 px-4 text-sm font-medium text-gray-900 focus:border-brand-300"
                        placeholder="e.g., German"
                      />
                      {travelerForm.formState.errors.nationality && (
                        <p className="mt-1 text-xs font-medium text-error">
                          {travelerForm.formState.errors.nationality.message}
                        </p>
                      )}
                    </div>
                    <label className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        {...travelerForm.register('termsAccepted', {
                          required: 'Please confirm you accept our booking terms.',
                        })}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
                      />
                      I confirm that the provided traveler information is accurate and I agree to the BookingTour{' '}
                      <a href="#terms" className="font-semibold text-brand-600 hover:underline">
                        booking terms.
                      </a>
                    </label>
                    {travelerForm.formState.errors.termsAccepted && (
                      <p className="text-xs font-medium text-error">
                        {travelerForm.formState.errors.termsAccepted.message}
                      </p>
                    )}
                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-300 hover:text-gray-900 focus-visible:border-brand-300"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600 focus-visible:bg-brand-600"
                      >
                        Continue to payment →
                      </button>
                    </div>
                  </form>
                </motion.section>
              )}

              {currentStep === 3 && (
                <motion.section
                  key="step-3"
                  className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card lg:p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900">3. Secure payment</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    We accept all major credit cards. Your payment is encrypted and protected by European banks.
                  </p>
                  <form onSubmit={paymentForm.handleSubmit(onSubmitPayment)} className="mt-6 space-y-5">
                    <div>
                      <label
                        htmlFor="cardHolder"
                        className="text-xs font-semibold uppercase tracking-widest text-gray-500"
                      >
                        Cardholder name
                      </label>
                      <input
                        id="cardHolder"
                        type="text"
                        {...paymentForm.register('cardHolder', { required: 'Name as displayed on your card.' })}
                        className="mt-2 w-full rounded-xl border border-gray-200 py-3 px-4 text-sm font-medium text-gray-900 focus:border-brand-300"
                      />
                      {paymentForm.formState.errors.cardHolder && (
                        <p className="mt-1 text-xs font-medium text-error">
                          {paymentForm.formState.errors.cardHolder.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="cardNumber"
                        className="text-xs font-semibold uppercase tracking-widest text-gray-500"
                      >
                        Card number
                      </label>
                      <input
                        id="cardNumber"
                        type="text"
                        inputMode="numeric"
                        {...paymentForm.register('cardNumber', {
                          required: 'Card number is required.',
                          pattern: {
                            value: /^[0-9]{12,19}$/,
                            message: 'Enter a valid card number.',
                          },
                        })}
                        className="mt-2 w-full rounded-xl border border-gray-200 py-3 px-4 text-sm font-medium text-gray-900 focus:border-brand-300"
                        placeholder="4242 4242 4242 4242"
                      />
                      {paymentForm.formState.errors.cardNumber && (
                        <p className="mt-1 text-xs font-medium text-error">
                          {paymentForm.formState.errors.cardNumber.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="expiry"
                          className="text-xs font-semibold uppercase tracking-widest text-gray-500"
                        >
                          Expiry date
                        </label>
                        <input
                          id="expiry"
                          type="text"
                          {...paymentForm.register('expiry', {
                            required: 'Expiry date is required.',
                            pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Use MM/YY format.' },
                          })}
                          className="mt-2 w-full rounded-xl border border-gray-200 py-3 px-4 text-sm font-medium text-gray-900 focus:border-brand-300"
                          placeholder="MM/YY"
                        />
                        {paymentForm.formState.errors.expiry && (
                          <p className="mt-1 text-xs font-medium text-error">
                            {paymentForm.formState.errors.expiry.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="cvc"
                          className="text-xs font-semibold uppercase tracking-widest text-gray-500"
                        >
                          CVC
                        </label>
                        <input
                          id="cvc"
                          type="password"
                          inputMode="numeric"
                          {...paymentForm.register('cvc', {
                            required: 'Security code is required.',
                            minLength: { value: 3, message: 'CVC must be 3-4 digits.' },
                            maxLength: { value: 4, message: 'CVC must be 3-4 digits.' },
                          })}
                          className="mt-2 w-full rounded-xl border border-gray-200 py-3 px-4 text-sm font-medium text-gray-900 focus:border-brand-300"
                          placeholder="123"
                        />
                        {paymentForm.formState.errors.cvc && (
                          <p className="mt-1 text-xs font-medium text-error">
                            {paymentForm.formState.errors.cvc.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="billingAddress"
                        className="text-xs font-semibold uppercase tracking-widest text-gray-500"
                      >
                        Billing address
                      </label>
                      <textarea
                        id="billingAddress"
                        rows={3}
                        {...paymentForm.register('billingAddress', {
                          required: 'Billing address is required for receipts.',
                        })}
                        className="mt-2 w-full rounded-xl border border-gray-200 py-3 px-4 text-sm font-medium text-gray-900 focus:border-brand-300"
                        placeholder="Street, city, postal code, country"
                      />
                      {paymentForm.formState.errors.billingAddress && (
                        <p className="mt-1 text-xs font-medium text-error">
                          {paymentForm.formState.errors.billingAddress.message}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-300 hover:text-gray-900 focus-visible:border-brand-300"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessingPayment}
                        className="inline-flex items-center rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600 focus-visible:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isProcessingPayment ? 'Processing…' : 'Confirm & pay →'}
                      </button>
                    </div>
                  </form>
                </motion.section>
              )}

              {currentStep === 4 && (
                <motion.section
                  key="step-4"
                  className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card lg:p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 rounded-2xl bg-brand-50 p-4 text-brand-700">
                    <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                    <div>
                      <h2 className="text-xl font-semibold">Booking confirmed</h2>
                      <p className="text-sm text-brand-600">
                        A confirmation email with your itinerary is on its way.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-4 text-sm text-gray-600">
                    <p>
                      Thank you {traveler?.firstName}! Your trip to {tour.destination} is now secure for{' '}
                      {reservation.guests} {reservation.guests === 1 ? 'guest' : 'guests'}. Our concierge team will reach
                      out within 24 hours to help with any refinements or additional arrangements.
                    </p>
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                        Next steps
                      </h3>
                      <ul className="mt-3 space-y-2">
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-brand-500" aria-hidden="true" />
                          Meet your expert travel designer to finalise the itinerary.
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-brand-500" aria-hidden="true" />
                          Access your digital travel guide with insider recommendations.
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-brand-500" aria-hidden="true" />
                          Add travel insurance or extra services if needed.
                        </li>
                      </ul>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600 focus-visible:bg-brand-600"
                        onClick={() => navigate('/')}
                      >
                        Explore more tours
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-300 hover:text-gray-900 focus-visible:border-brand-300"
                      >
                        <Download className="h-4 w-4" aria-hidden="true" />
                        Download itinerary PDF
                      </button>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          <BookingSummary
            tour={tour}
            startDate={reservation.startDate}
            endDate={reservation.endDate}
            guests={reservation.guests}
            step={currentStep}
          />
        </div>

        <section className="rounded-3xl border border-gray-100 bg-white p-6 text-sm text-gray-600 shadow-card lg:p-8">
          <h2 className="text-lg font-semibold text-gray-900">Need assistance?</h2>
          <p className="mt-2">
            Our concierge team is available 24/7 via live chat or WhatsApp. We can arrange private transfers, pre and
            post-stays, and bespoke experiences tailored to your journey.
          </p>
        </section>
      </div>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-card"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default BookingPage;
