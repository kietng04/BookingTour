import React, { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ShieldCheck, Award } from 'lucide-react';
import clsx from 'clsx';
import { differenceInCalendarDays } from 'date-fns';
import GuestSelector from '../forms/GuestSelector';

interface BookingSidebarProps {
  priceFrom: number;
  duration: string;
  reviewSummary?: string;
  onBook?: (data: { startDate?: Date; endDate?: Date; guests: number }) => void;
}

const BookingSidebar: React.FC<BookingSidebarProps> = ({
  priceFrom,
  duration,
  reviewSummary,
  onBook,
}) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<{ guests: number }>({
    defaultValues: { guests: 2 },
  });
  const guests = watch('guests', 2);

  const nights = useMemo(() => {
    if (startDate && endDate) {
      const diff = differenceInCalendarDays(endDate, startDate);
      return Math.max(diff, 1);
    }
    return 1;
  }, [startDate, endDate]);

  const estimatedTotal = useMemo(() => {
    const guestMultiplier = Math.max(guests ?? 1, 1);
    return priceFrom + priceFrom * 0.12 * guestMultiplier + nights * 120;
  }, [guests, nights, priceFrom]);

  const priceFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  });

  return (
    <motion.aside
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-28 space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-card lg:p-8"
      aria-label="Tóm tắt đặt tour"
    >
      <div>
        <p className="text-sm uppercase tracking-wide text-gray-500">Giá từ</p>
        <p className="text-3xl font-semibold text-gray-900">{priceFormatter.format(priceFrom)}</p>
        <p className="text-sm text-gray-500">
          {duration}
          {reviewSummary ? ` · ${reviewSummary}` : ''}
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={handleSubmit((values) =>
          onBook?.({ startDate: startDate ?? undefined, endDate: endDate ?? undefined, guests: values.guests })
        )}
      >
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Ngày khởi hành
          </span>
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
            placeholderText="Chọn ngày khởi hành"
            className="w-full rounded-xl border border-gray-200 py-3 px-4 text-sm font-medium text-gray-900 focus:border-brand-300"
          />
        </label>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Số khách
          </span>
          <Controller
            control={control}
            name="guests"
            rules={{
              required: 'Vui lòng nhập số lượng khách tham gia.',
              min: { value: 1, message: 'Cần ít nhất 1 khách.' },
              max: { value: 12, message: 'Nhóm trên 12 khách vui lòng liên hệ tư vấn viên.' },
            }}
            render={({ field: { value, onChange } }) => (
              <GuestSelector value={value ?? 2} onChange={onChange} min={1} max={12} />
            )}
          />
          {errors.guests && (
            <p id="guests-error" className="text-xs font-medium text-error">
              {errors.guests.message}
            </p>
          )}
        </div>
        <div className="rounded-2xl bg-gray-25 p-4 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span aria-label="Giá cơ bản">Giá cơ bản</span>
            <span>{priceFormatter.format(priceFrom)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span aria-label="Phụ thu khách">Phụ thu khách ({guests ?? 1})</span>
            <span>{priceFormatter.format(priceFrom * 0.12 * (guests ?? 1))}</span>
          </div>
          <div className="flex items-center justify-between">
            <span aria-label="Số đêm">Số đêm ({nights})</span>
            <span>{priceFormatter.format(nights * 120)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-base font-semibold text-gray-900">
            <span>Tổng tạm tính</span>
            <span>{priceFormatter.format(estimatedTotal)}</span>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Giá cuối cùng được xác nhận ở bước tiếp theo. Cam kết không phụ thu ẩn.
          </p>
        </div>
        <button
          type="submit"
          className={clsx(
            'inline-flex w-full items-center justify-center rounded-full bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition',
            'hover:bg-brand-600 focus-visible:bg-brand-600'
          )}
        >
          Đặt ngay
        </button>
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-full border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-brand-300 hover:text-gray-900 focus-visible:border-brand-300"
        >
          Giữ chỗ 48 giờ
        </button>
      </form>

      <div className="rounded-2xl border border-gray-100 bg-gray-25 p-4 text-sm text-gray-600">
        <p className="flex items-center gap-2 text-gray-700">
          <ShieldCheck className="h-4 w-4 text-brand-500" aria-hidden="true" />
          Thanh toán 3DS an toàn
        </p>
        <p className="mt-3 flex items-center gap-2">
          <Award className="h-4 w-4 text-brand-500" aria-hidden="true" />
          Được hơn 25.000 du khách châu Âu tin chọn
        </p>
      </div>
    </motion.aside>
  );
};

export default BookingSidebar;
