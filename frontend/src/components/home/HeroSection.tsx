import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { Users, MapPin, CalendarDays, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import GuestSelector from '../forms/GuestSelector';

type SearchFormValues = {
  destination: string;
  guests: number;
};

interface HeroSectionProps {
  onSearch: (search: { destination: string; dateRange: { startDate?: Date; endDate?: Date }; guests: number }) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const { register, handleSubmit, control, watch } = useForm<SearchFormValues>({
    defaultValues: {
      destination: '',
      guests: 2,
    },
  });
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  const submitSearch = handleSubmit((values) => {
    onSearch({
      destination: values.destination,
      dateRange: { startDate: startDate ?? undefined, endDate: endDate ?? undefined },
      guests: Number(values.guests),
    });
  });

  const destinationValue = watch('destination');

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gray-900 text-white shadow-card lg:h-[520px]">
      <img
        src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=2000&q=80"
        alt="Travelers overlooking a scenic European city"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gray-900/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/30 to-gray-900/40" />
      <div className="relative z-10 px-6 pb-16 pt-16 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur">
            Tuyển chọn bởi chuyên gia bản địa
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Khám phá những trải nghiệm châu Âu được yêu thích nhất.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80 sm:text-xl">
            Lịch trình linh hoạt, hướng dẫn viên đáng tin cậy và quyền lợi độc quyền dành cho thành viên. An tâm lên kế hoạch cho hành trình tiếp theo ngay hôm nay.
          </p>
          <dl className="mt-6 flex flex-wrap gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-200" aria-hidden="true" />
              <div>
                <dt className="font-medium text-white">Thanh toán an toàn</dt>
                <dd>Bảo mật theo chuẩn ngân hàng châu Âu</dd>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-brand-200" aria-hidden="true" />
              <div>
                <dt className="font-medium text-white">Được tín nhiệm</dt>
                <dd>98% đánh giá 5 sao từ du khách</dd>
              </div>
            </div>
          </dl>
        </motion.div>
      </div>
      <motion.form
        onSubmit={submitSearch}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
        className="relative z-20 mx-6 -mt-12 max-w-5xl rounded-2xl bg-white p-6 shadow-card lg:mx-auto lg:p-8"
        aria-label="Tìm kiếm tour"
      >
        <div className="grid gap-4 md:grid-cols-4">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Điểm đến</span>
            <div className="relative flex items-center">
              <MapPin className="pointer-events-none absolute left-4 h-4 w-4 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                {...register('destination')}
                placeholder="Bạn muốn đi đâu?"
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-gray-900 shadow-inner focus:border-brand-300"
                aria-label="Điểm đến"
              />
            </div>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Ngày khởi hành</span>
            <div className="relative flex items-center">
              <CalendarDays className="pointer-events-none absolute left-4 h-4 w-4 text-gray-400" aria-hidden="true" />
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  if (Array.isArray(update)) {
                    setDateRange([update[0], update[1]]);
                  }
                }}
                minDate={new Date()}
                placeholderText="Chọn khoảng ngày"
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm font-medium text-gray-900 focus:border-brand-300"
                calendarClassName="rounded-xl border border-gray-100 shadow-card"
              />
            </div>
          </label>
          <Controller
            control={control}
            name="guests"
            rules={{ required: true, min: 1, max: 12 }}
            render={({ field: { value, onChange } }) => (
              <GuestSelector value={value ?? 2} onChange={onChange} min={1} max={12} />
            )}
          />
          <div className="flex items-end">
            <button
              type="submit"
              className={clsx(
                'flex w-full items-center justify-center rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white shadow-lg transition focus-visible:bg-brand-600',
                destinationValue ? 'hover:bg-brand-600' : 'hover:bg-brand-500'
              )}
            >
              Tìm tour phù hợp
            </button>
          </div>
        </div>
      </motion.form>
    </section>
  );
};

export default HeroSection;
