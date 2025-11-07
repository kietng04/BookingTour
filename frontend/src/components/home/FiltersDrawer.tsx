import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';
import clsx from 'clsx';

interface FilterState {
  priceRange: [number, number];
  tags: string[];
}



interface FiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  defaultValues: FilterState;
  baseline: FilterState;
  availableTags: string[];
}

const FiltersDrawer: React.FC<FiltersDrawerProps> = ({
  isOpen,
  onClose,
  onApply,
  defaultValues,
  baseline,
  availableTags,
}) => {
  const { register, handleSubmit, watch, reset } = useForm<FilterState>({
    defaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [defaultValues, isOpen, reset]);

  const selectedTags = watch('tags');
  const selectedPriceRange = watch('priceRange');

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(Number.isFinite(value) ? value : 0);

  const handleReset = () => {
    reset(baseline);
    onApply(baseline);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-white shadow-card md:rounded-l-3xl"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ type: 'spring', duration: 0.4 }}
            role="dialog"
            aria-modal="true"
            aria-label="Bộ lọc tour"
          >
            <form
              className="flex h-full flex-col gap-6 p-6"
              onSubmit={handleSubmit((values) => {
                onApply({
                  ...values,
                  priceRange: [Number(values.priceRange[0]), Number(values.priceRange[1])],
                });
                onClose();
              })}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Tùy chỉnh kết quả</h2>
                  <p className="text-sm text-gray-500">Lọc nhanh để tìm đúng hành trình phù hợp với phong cách của bạn.</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-gray-200 p-2 text-gray-500 transition hover:border-brand-200 hover:text-brand-500 focus-visible:border-brand-300 focus-visible:text-brand-500"
                  aria-label="Đóng bộ lọc"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="space-y-6">
                <fieldset className="space-y-3 rounded-2xl border border-gray-100 p-4">
                  <legend className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                    Khoảng giá (mỗi khách)
                  </legend>
                  <div className="grid gap-3 text-sm text-gray-600">
                    <label className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-brand-500" aria-hidden="true" />
                      <span className="flex-1">Từ</span>
                      <input
                        type="number"
                        min={0}
                        max={20000000}
                        step={500000}
                        {...register('priceRange.0')}
                        className="w-24 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 focus:border-brand-300"
                      />
                    </label>
                    <label className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-brand-500" aria-hidden="true" />
                      <span className="flex-1">Đến</span>
                      <input
                        type="number"
                        min={0}
                        max={30000000}
                        step={500000}
                        {...register('priceRange.1')}
                        className="w-24 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 focus:border-brand-300"
                      />
                    </label>
                    <p className="rounded-xl bg-gray-25 px-3 py-2 text-xs font-medium text-gray-500">
                      Khoảng giá hiện tại:{' '}
                      <span className="text-gray-900">
                        {formatCurrency(Number(selectedPriceRange?.[0] ?? defaultValues.priceRange[0]))}
                      </span>{' '}
                      –{' '}
                      <span className="text-gray-900">
                        {formatCurrency(Number(selectedPriceRange?.[1] ?? defaultValues.priceRange[1]))}
                      </span>
                    </p>
                  </div>
                </fieldset>

                <fieldset className="space-y-3 rounded-2xl border border-gray-100 p-4">
                  <legend className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                    Trải nghiệm
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <label
                        key={tag}
                        className={clsx(
                          'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition',
                          selectedTags?.includes(tag)
                            ? 'border-brand-300 bg-brand-50 text-brand-600'
                            : 'border-gray-200 text-gray-600 hover:border-brand-300 hover:text-gray-900'
                        )}
                      >
                        <input
                          type="checkbox"
                          value={tag}
                          {...register('tags')}
                          className="sr-only"
                        />
                        #{tag}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-200 hover:text-gray-900 focus-visible:border-brand-300"
                >
                  Đặt lại
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-200 hover:text-gray-900 focus-visible:border-brand-300"
                  >
                    Thoát
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600 focus-visible:bg-brand-600"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FiltersDrawer;


