import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, ShieldCheck, Users } from 'lucide-react';

interface BookingSidebarDeparture {
  id: number;
  startDate: string;
  endDate: string;
  remainingSlots: number;
  totalSlots: number;
  status: string;
}

interface BookingSidebarProps {
  priceFrom: number;
  childPrice?: number;
  duration?: string;
  departurePoint?: string;
  destination?: string;
  departures?: BookingSidebarDeparture[];
  onBook?: () => void;
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const STATUS_LABELS: Record<string, string> = {
  CONCHO: 'Còn chỗ',
  SAPFULL: 'Sắp đầy',
  FULL: 'Đã đầy',
  DAKHOIHANH: 'Đã khởi hành',
};

const formatDate = (value?: string) => {
  if (!value) return 'Đang cập nhật';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Đang cập nhật';
  }
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const BookingSidebar: React.FC<BookingSidebarProps> = ({
  priceFrom,
  childPrice,
  duration,
  departurePoint,
  destination,
  departures = [],
  onBook,
}) => {
  const hasDepartures = departures.length > 0;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-28 space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-card lg:p-8"
      aria-label="Thông tin tour"
    >
      <section className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Giá tour</p>
        <p className="text-3xl font-semibold text-gray-900">
          {CURRENCY_FORMATTER.format(priceFrom ?? 0)}
        </p>
        {typeof childPrice === 'number' && childPrice >= 0 && (
          <p className="text-sm text-gray-500">
            Trẻ em: {CURRENCY_FORMATTER.format(childPrice)}
          </p>
        )}
      </section>

      <section className="space-y-3 rounded-2xl bg-gray-25 p-4 text-sm text-gray-600">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Users className="h-4 w-4 text-brand-500" aria-hidden="true" />
          Thông tin hành trình
        </h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-brand-500" aria-hidden="true" />
            <span>{duration ?? 'Đang cập nhật'}</span>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand-500" aria-hidden="true" />
            <span>
              Khởi hành: {departurePoint?.trim() ? departurePoint : 'Đang cập nhật'}
            </span>
          </li>
          {destination && (
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-500" aria-hidden="true" />
              <span>Điểm đến: {destination}</span>
            </li>
          )}
        </ul>
      </section>

      <section className="space-y-3">
        <header className="flex items-center justify-between text-sm font-semibold text-gray-800">
          <span>Lịch khởi hành</span>
        </header>
        {hasDepartures ? (
          <ul className="max-h-72 space-y-3 overflow-y-auto pr-1 text-sm text-gray-600">
            {departures.map((departure) => (
              <li
                key={departure.id}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-3"
              >
                <div className="flex items-center justify-between gap-3 text-sm font-medium text-gray-900">
                  <span>
                    {formatDate(departure.startDate)} → {formatDate(departure.endDate)}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                    {STATUS_LABELS[departure.status] ?? departure.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Còn {departure.remainingSlots}/{departure.totalSlots} chỗ
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-gray-200 bg-gray-25 p-4 text-sm text-gray-500">
            Lịch khởi hành sẽ được cập nhật khi có thông tin mới.
          </p>
        )}
      </section>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onBook}
          className="inline-flex w-full items-center justify-center rounded-full bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600 focus-visible:bg-brand-600"
        >
          Đặt ngay
        </button>
        <p className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="h-4 w-4 text-brand-500" aria-hidden="true" />
          Thanh toán an toàn, xác nhận nhanh chóng
        </p>
      </div>
    </motion.aside>
  );
};

export default BookingSidebar;
