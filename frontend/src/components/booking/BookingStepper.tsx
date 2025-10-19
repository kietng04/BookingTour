import React from 'react';
import clsx from 'clsx';

const steps = [
  { id: 1, label: 'Details' },
  { id: 2, label: 'Traveler info' },
  { id: 3, label: 'Payment' },
  { id: 4, label: 'Confirmation' },
];

interface BookingStepperProps {
  currentStep: number;
}

const BookingStepper: React.FC<BookingStepperProps> = ({ currentStep }) => (
  <nav aria-label="Booking steps" className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-card">
    <ol className="flex flex-col divide-y divide-gray-100 sm:flex-row sm:divide-y-0">
      {steps.map((step) => {
        const status = step.id === currentStep ? 'current' : step.id < currentStep ? 'complete' : 'upcoming';

        return (
          <li key={step.id} className="flex flex-1">
            <div
              className={clsx(
                'flex flex-1 items-center gap-3 px-6 py-4 text-sm font-semibold transition sm:px-8 sm:py-5',
                status === 'current' && 'bg-brand-50 text-brand-600',
                status === 'complete' && 'bg-white text-gray-600',
                status === 'upcoming' && 'bg-white text-gray-400'
              )}
            >
              <span
                className={clsx(
                  'flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold',
                  status === 'complete' && 'border-brand-300 bg-brand-50 text-brand-600',
                  status === 'current' && 'border-brand-500 bg-brand-500 text-white',
                  status === 'upcoming' && 'border-gray-200 text-gray-400'
                )}
              >
                {step.id}
              </span>
              <span>{step.label}</span>
            </div>
          </li>
        );
      })}
    </ol>
  </nav>
);

export default BookingStepper;
