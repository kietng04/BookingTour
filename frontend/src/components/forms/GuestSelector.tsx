import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Minus, Plus } from 'lucide-react';
import clsx from 'clsx';

interface GuestSelectorProps {
  label?: string;
  value: number;
  onChange: (totalGuests: number) => void;
  min?: number;
  max?: number;
}

type GuestCategory = 'adults' | 'youth' | 'children';

const GuestSelector: React.FC<GuestSelectorProps> = ({
  label = 'Guests',
  value,
  onChange,
  min = 1,
  max = 12,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [distribution, setDistribution] = useState(() => {
    const initialAdults = Math.min(Math.max(value || min, min), max);
    return { adults: initialAdults, youth: 0, children: 0 };
  });

  useEffect(() => {
    // If total changes from parent, adjust distribution proportionally
    setDistribution((prev) => {
      const prevTotal = prev.adults + prev.youth + prev.children;
      if (value === prevTotal) {
        return prev;
      }
      if (value <= 0) {
        return { adults: min, youth: 0, children: 0 };
      }
      // Maintain adults as baseline, adjust others to fit total.
      const adjusted = { ...prev };
      let remaining = value;
      adjusted.adults = Math.max(min, Math.min(remaining, value));
      remaining -= adjusted.adults;
      adjusted.youth = Math.max(0, Math.min(prev.youth, remaining));
      remaining -= adjusted.youth;
      adjusted.children = Math.max(0, Math.min(prev.children, remaining));
      remaining -= adjusted.children;
      if (remaining > 0) {
        adjusted.adults += remaining;
      }
      return adjusted;
    });
  }, [min, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const totalGuests = useMemo(
    () => distribution.adults + distribution.youth + distribution.children,
    [distribution]
  );

  useEffect(() => {
    onChange(totalGuests);
  }, [onChange, totalGuests]);

  const adjustGuests = (category: GuestCategory, delta: number) => {
    setDistribution((prev) => {
      const next = { ...prev };
      next[category] = Math.max(0, prev[category] + delta);
      const nextTotal = next.adults + next.youth + next.children;
      if (nextTotal < min) {
        return prev;
      }
      if (nextTotal > max) {
        return prev;
      }
      return next;
    });
  };

  const categories: Array<{ key: GuestCategory; label: string; description: string; minCount: number }> = [
    { key: 'adults', label: 'Adults', description: 'Age 18+', minCount: 1 },
    { key: 'youth', label: 'Teens', description: 'Age 13-17', minCount: 0 },
    { key: 'children', label: 'Children', description: 'Age 2-12', minCount: 0 },
  ];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          'flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900 focus:border-brand-300',
          'shadow-inner transition hover:border-brand-200'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">{label}</span>
          <span>{totalGuests} {totalGuests === 1 ? 'guest' : 'guests'}</span>
        </div>
        <ChevronDown className={clsx('h-4 w-4 text-gray-400 transition-transform', isOpen && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute z-40 mt-2 w-full rounded-2xl border border-gray-100 bg-white shadow-card"
            role="listbox"
          >
            <div className="space-y-3 p-4">
              {categories.map((category) => (
                <div key={category.key} className="flex items-center justify-between gap-3 rounded-xl bg-gray-25 p-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{category.label}</p>
                    <p className="text-xs text-gray-500">{category.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-brand-300 hover:text-gray-900 focus-visible:border-brand-300"
                      onClick={() => adjustGuests(category.key, -1)}
                      disabled={distribution[category.key] <= category.minCount}
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Decrease {category.label}</span>
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-gray-900">
                      {distribution[category.key]}
                    </span>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-brand-300 hover:text-gray-900 focus-visible:border-brand-300"
                      onClick={() => adjustGuests(category.key, 1)}
                      disabled={totalGuests >= max}
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Increase {category.label}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
              <span>Max {max} guests per booking</span>
              <button
                type="button"
                className="font-semibold text-brand-600 hover:underline"
                onClick={() => {
                  const baseAdults = Math.min(Math.max(value || min, min), max);
                  setDistribution({ adults: baseAdults, youth: 0, children: 0 });
                  setIsOpen(false);
                }}
              >
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuestSelector;
