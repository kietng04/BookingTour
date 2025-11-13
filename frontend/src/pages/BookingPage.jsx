import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format, isBefore, startOfDay } from 'date-fns';
import GuestSelector from '../components/forms/GuestSelector';
import MoMoPaymentButton from '../components/payment/MoMoPaymentButton';
import { toursAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader2, CalendarDays, MapPin } from 'lucide-react';

const CURRENCY_FORMATTER = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const STATUS_LABELS = {
  CONCHO: 'Còn chỗ',
  SAPFULL: 'Sắp đầy',
  FULL: 'Đã đầy',
  DAKHOIHANH: 'Đã khởi hành',
};

const STATUS_STYLES = {
  CONCHO: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  SAPFULL: 'bg-amber-50 text-amber-600 border border-amber-100',
  FULL: 'bg-gray-100 text-gray-500 border border-gray-200',
  DAKHOIHANH: 'bg-gray-100 text-gray-500 border border-gray-200',
};

const formatDate = (value) => {
  if (!value) {
    return 'Đang cập nhật';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Đang cập nhật';
  }
  return format(date, 'dd/MM/yyyy');
};

const getRemainingSeats = (departure) => {
  if (!departure) return undefined;
  const candidates = [
    departure.remainingSlots,
    departure.availableSeats,
    departure.remainingSeats,
    departure.seatsAvailable,
    departure.seatAvailable,
    departure.remaining,
  ];
  return candidates.find((value) => typeof value === 'number' && !Number.isNaN(value)) ?? undefined;
};

const getTotalSeats = (departure) => {
  if (!departure) return undefined;
  const candidates = [
    departure.totalSlots,
    departure.totalSeats,
    departure.capacity,
    departure.seatCapacity,
  ];
  return candidates.find((value) => typeof value === 'number' && !Number.isNaN(value)) ?? undefined;
};

const BookingPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [guestCounts, setGuestCounts] = useState({ adults: 2, children: 0 });
  const [selectedDepartureId, setSelectedDepartureId] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [creatingBooking, setCreatingBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  const today = useMemo(() => startOfDay(new Date()), []);

  const contactForm = useForm({
    mode: 'onChange',
    defaultValues: {
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      phone: '',
    },
  });

  useEffect(() => {
    const fetchTour = async () => {
      if (!slug) {
        setError('Không tìm thấy tour phù hợp.');
        setLoading(false);
          return;
        }

      try {
        setLoading(true);
        const response = await toursAPI.getBySlug(slug);

        const normalizedTour = {
          ...response,
          departures: Array.isArray(response?.departures) ? response.departures : [],
        };

        if (!normalizedTour.departures.length && response?.id) {
          try {
            const fallbackDepartures = await toursAPI.getDepartures(response.id);
            normalizedTour.departures = Array.isArray(fallbackDepartures)
              ? fallbackDepartures
              : [];
          } catch (departureError) {
            console.warn('Không thể tải lịch khởi hành bổ sung:', departureError);
          }
        }

        setTour(normalizedTour);
        if (normalizedTour.departures.length) {
          const firstAvailable = normalizedTour.departures.find((departure) => {
            if (departure.status === 'FULL' || departure.status === 'DAKHOIHANH') {
              return false;
            }
            const departureEndDate = departure.endDate ? startOfDay(new Date(departure.endDate)) : null;
            if (departureEndDate && isBefore(departureEndDate, today)) {
              return false;
            }
            return (departure.remainingSlots ?? 0) > 0;
          });

          setSelectedDepartureId(firstAvailable?.id ?? null);
        }
      } catch (err) {
        console.error('Failed to fetch tour', err);
        setError('Không tải được thông tin tour. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [slug]);

  const selectedDeparture = useMemo(() => {
    if (!tour || selectedDepartureId == null) return undefined;
    return tour.departures.find((departure) => departure.id === selectedDepartureId);
  }, [tour, selectedDepartureId]);

  const totalGuests = useMemo(() => guestCounts.adults + guestCounts.children, [guestCounts]);

  const seatsRemaining = useMemo(() => {
    const remaining = getRemainingSeats(selectedDeparture);
    console.log('BookingPage - seatsRemaining:', {
      selectedDeparture,
      remaining,
      remainingSlots: selectedDeparture?.remainingSlots,
      availableSeats: selectedDeparture?.availableSeats
    });
    return remaining;
  }, [selectedDeparture]);

  const maxSelectableGuests = useMemo(() => {
    console.log('BookingPage - maxSelectableGuests calculation:', {
      seatsRemaining,
      result: typeof seatsRemaining === 'number' ? Math.max(0, seatsRemaining) : undefined
    });
    if (typeof seatsRemaining === 'number') {
      return Math.max(0, seatsRemaining);
    }
    return undefined;
  }, [seatsRemaining]);

  useEffect(() => {
    if (typeof maxSelectableGuests !== 'number') {
      return;
    }

    if (maxSelectableGuests <= 0) {
      setGuestCounts(() => {
        return { adults: 1, children: 0 };
      });
      return;
    }

    if (totalGuests <= maxSelectableGuests) {
      return;
    }

    setGuestCounts((prev) => {
      const cappedAdults = Math.max(1, Math.min(prev.adults, maxSelectableGuests));
      const cappedChildren = Math.max(0, Math.min(prev.children, maxSelectableGuests - cappedAdults));
      if (cappedAdults === prev.adults && cappedChildren === prev.children) {
        return prev;
      }
      return {
        adults: cappedAdults,
        children: cappedChildren,
      };
    });
  }, [maxSelectableGuests, totalGuests]);

  const estimatedTotal = useMemo(() => {
    if (!tour) return 0;
    const adultPrice = Number(tour.adultPrice) || 0;
    const childPrice = Number(tour.childPrice ?? adultPrice);
    return guestCounts.adults * adultPrice + guestCounts.children * childPrice;
  }, [tour, guestCounts]);

  const exceedsAvailability = useMemo(() => {
    if (!selectedDeparture || typeof selectedDeparture.remainingSlots !== 'number') {
      return false;
    }
    return totalGuests > selectedDeparture.remainingSlots;
  }, [selectedDeparture, totalGuests]);

  const handleContactSubmit = (values) => {
    setContactInfo(values);
    setStep(2);
  };

  const handleCreateBooking = async () => {
    if (!tour || !selectedDeparture) {
      throw new Error('Thiếu thông tin tour hoặc ngày khởi hành.');
    }

    const seatsRequested = Math.max(1, totalGuests);
    if (
      typeof selectedDeparture.remainingSlots === 'number' &&
      seatsRequested > selectedDeparture.remainingSlots
    ) {
      const message = 'Số khách vượt quá số chỗ còn lại cho lịch khởi hành này.';
      setBookingError(message);
      throw new Error(message);
    }

    setBookingError(null);
    setCreatingBooking(true);
    try {
      const payload = {
        userId: user?.userId ?? 1,
        tourId: tour.id,
        departureId: selectedDeparture.id,
        seats: seatsRequested,
        totalAmount: estimatedTotal,
        guestDetails: {
          adults: guestCounts.adults,
          children: guestCounts.children,
        },
      };

      console.log('[BookingPage] Creating booking payload', payload);

      const response = await bookingsAPI.create(payload, token ?? undefined);
      setCreatingBooking(false);
      return { bookingId: response.bookingId };
    } catch (err) {
      setCreatingBooking(false);
      console.error('Failed to create booking', err);
      const message = err instanceof Error ? err.message : 'Không thể tạo booking. Vui lòng thử lại.';
      setBookingError(message);
      throw err instanceof Error ? err : new Error(message);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-gray-25">
        <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin text-brand-500" />
          Đang tải thông tin tour...
        </div>
      </main>
    );
  }

  if (error || !tour) {
    return (
      <main className="container min-h-[60vh] py-20">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Không tìm thấy tour</p>
          <h1 className="mt-3 text-3xl font-semibold text-gray-900">Trải nghiệm này hiện không khả dụng</h1>
          <p className="mt-3 text-sm text-gray-600">
            {error || 'Tour có thể đã thay đổi hoặc bị gỡ bỏ. Bạn có thể quay về trang danh sách để chọn tour khác.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 inline-flex items-center rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-600 focus-visible:bg-brand-600"
          >
            Quay về trang chủ
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-25 pb-16">
      <div className="container space-y-8 py-10 lg:space-y-12 lg:py-16">
        <section className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm font-semibold text-brand-600 transition hover:text-brand-700"
          >
            ← Quay lại
          </button>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">
                {tour.mainDestination}
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900 lg:text-4xl">{tour.tourName}</h1>
              <p className="mt-4 max-w-3xl text-sm text-gray-600">{tour.description}</p>
            </div>
            <div className="flex gap-4 text-sm text-gray-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-card">
                <CalendarDays className="h-4 w-4 text-brand-500" />
                {selectedDeparture
                  ? `${formatDate(selectedDeparture.startDate)} - ${formatDate(selectedDeparture.endDate)}`
                  : 'Chọn ngày khởi hành'}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-card">
                <MapPin className="h-4 w-4 text-brand-500" /> {tour.mainDestination}
              </span>
            </div>
        </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="space-y-8">
            {step === 1 ? (
              <form
                onSubmit={contactForm.handleSubmit(handleContactSubmit)}
                className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-card lg:p-8"
              >
                <header className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">1. Thông tin liên hệ</h2>
                  <p className="text-sm text-gray-600">
                    Nhập thông tin liên hệ chính và chọn ngày khởi hành để tiếp tục thanh toán MoMo.
                  </p>
                </header>

                <div className="space-y-5">
                  <section className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Ngày khởi hành</p>
                    {tour.departures?.length ? (
                      <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                        {tour.departures.map((departure) => {
                          const isSelected = departure.id === selectedDepartureId;
                          const endDateValue = departure.endDate ? startOfDay(new Date(departure.endDate)) : null;
                          const isPastDeparture = endDateValue ? isBefore(endDateValue, today) : false;
                          const rawStatus = departure.status ?? '';
                          const normalizedStatus = isPastDeparture && rawStatus !== 'DAKHOIHANH' ? 'DAKHOIHANH' : rawStatus;
                          const statusLabel = STATUS_LABELS[normalizedStatus] ?? 'Đang cập nhật';
                          const statusStyle =
                            STATUS_STYLES[normalizedStatus] ?? 'border border-gray-200 bg-gray-100 text-gray-500';
                          const departureRemaining = getRemainingSeats(departure);
                          const departureTotal = getTotalSeats(departure);
                          const remainingInfo =
                            typeof departureTotal === 'number'
                              ? `${departureRemaining ?? 0}/${departureTotal} chỗ`
                              : typeof departureRemaining === 'number'
                                ? `${departureRemaining} chỗ`
                                : 'Đang cập nhật';
                          const isUnavailable =
                            (departureRemaining ?? 0) <= 0 ||
                            normalizedStatus === 'FULL' ||
                            normalizedStatus === 'DAKHOIHANH';
                          return (
                            <button
                              type="button"
                              key={departure.id}
                              onClick={() => {
                                if (!isUnavailable) {
                                  setSelectedDepartureId(departure.id);
                                }
                              }}
                              disabled={isUnavailable}
                              className={`w-full rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 hover:border-brand-300 hover:bg-brand-50 ${
                                isSelected
                                  ? 'border-brand-400 bg-brand-50 text-brand-700 shadow-inner'
                                  : 'border-gray-200 bg-white text-gray-700'
                              } ${isUnavailable ? 'cursor-not-allowed opacity-60 hover:bg-white hover:border-gray-200' : ''}`}
                              aria-pressed={isSelected}
                              aria-label={`Khởi hành ${formatDate(departure.startDate)} đến ${formatDate(
                                departure.endDate
                              )}`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {formatDate(departure.startDate)} → {formatDate(departure.endDate)}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-500">Còn lại {remainingInfo}</p>
                                  {typeof departure.price === 'number' && departure.price >= 0 && (
                                    <p className="mt-1 text-xs font-semibold text-brand-600">
                                      {CURRENCY_FORMATTER.format(departure.price)} / khách
                                    </p>
                                  )}
                                  {isPastDeparture && (
                                    <p className="mt-1 text-xs font-medium text-gray-500">
                                      Lịch khởi hành này đã kết thúc.
                                    </p>
                                  )}
                                </div>
                                <span
                                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${statusStyle}`}
                                >
                                  {statusLabel}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                        Tour chưa có lịch khởi hành công khai.
                      </p>
                    )}
                  </section>

                  <section className="space-y-3">
                    <header className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Số khách</p>
                      <span className="text-xs font-medium text-gray-400">
                        Giá người lớn: {CURRENCY_FORMATTER.format(Number(tour.adultPrice ?? 0))}
                        {typeof tour.childPrice === 'number' && tour.childPrice >= 0 && (
                          <> · Trẻ em: {CURRENCY_FORMATTER.format(Number(tour.childPrice))}</>
                        )}
                      </span>
                    </header>
                    <GuestSelector
                      value={guestCounts}
                      onChange={setGuestCounts}
                      maxTotal={typeof maxSelectableGuests === 'number' && maxSelectableGuests > 0 ? maxSelectableGuests : undefined}
                    />
                    {selectedDeparture && (typeof seatsRemaining === 'number' || typeof getTotalSeats(selectedDeparture) === 'number') && (
                      <p className="text-xs text-gray-500">
                        {typeof seatsRemaining === 'number' ? `Còn tối đa ${seatsRemaining} chỗ` : 'Số chỗ đang cập nhật'}
                        {typeof seatsRemaining === 'number' && typeof getTotalSeats(selectedDeparture) === 'number'
                          ? ` (còn ${seatsRemaining}/${getTotalSeats(selectedDeparture)} chỗ)`
                          : ''}
                        .
                      </p>
                    )}
                    {exceedsAvailability && (
                      <p className="text-xs font-semibold text-error">
                        Số khách bạn chọn vượt quá số chỗ còn lại.
                      </p>
                    )}
                  </section>

                  <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                        Họ và tên
                        </label>
                        <input
                          type="text"
                        {...contactForm.register('fullName', { required: 'Vui lòng nhập họ tên.' })}
                        className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900 focus:border-brand-300"
                        placeholder="Nguyễn Văn A"
                        />
                      {contactForm.formState.errors.fullName && (
                          <p className="mt-1 text-xs font-medium text-error">
                          {contactForm.formState.errors.fullName.message}
                          </p>
                        )}
                      </div>
                      <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                        Email
                        </label>
                        <input
                        type="email"
                        {...contactForm.register('email', {
                          required: 'Vui lòng nhập email.',
                          pattern: { value: /\S+@\S+\.\S+/, message: 'Email không hợp lệ.' },
                        })}
                        className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900 focus:border-brand-300"
                        placeholder="ban@example.com"
                      />
                      {contactForm.formState.errors.email && (
                          <p className="mt-1 text-xs font-medium text-error">
                          {contactForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                      <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                      Số điện thoại
                        </label>
                          <input
                            type="tel"
                      {...contactForm.register('phone', {
                        required: 'Vui lòng nhập số điện thoại.',
                        setValueAs: (value) => (typeof value === 'string' ? value.replace(/\s+/g, '') : value),
                        pattern: {
                          value: /^(?:\+?84|0)(?:\d{9,10})$/,
                          message: 'Số điện thoại không hợp lệ. Vui lòng sử dụng định dạng Việt Nam.',
                        },
                      })}
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900 focus:border-brand-300"
                      placeholder="(+84) 123 456 789"
                    />
                    {contactForm.formState.errors.phone && (
                          <p className="mt-1 text-xs font-medium text-error">
                        {contactForm.formState.errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>

                <div className="flex items-center justify-end border-t border-gray-100 pt-4 text-sm">
                  <div className="flex gap-3">
                      <button
                        type="button"
                      onClick={() => navigate(-1)}
                      className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-brand-300 hover:text-gray-900"
                      >
                      Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={
                          !selectedDepartureId ||
                          !contactForm.formState.isValid ||
                          guestCounts.adults < 1 ||
                          totalGuests < 1 ||
                          exceedsAvailability ||
                          (selectedDeparture && maxSelectableGuests <= 0)
                        }
                        className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 focus-visible:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Tiếp tục thanh toán
                      </button>
                  </div>
                    </div>
                  </form>
            ) : (
              <div className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-card lg:p-8">
                <header className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">Bước cuối</p>
                  <h2 className="text-xl font-semibold text-gray-900">2. Thanh toán MoMo</h2>
                  <p className="text-sm text-gray-600">
                    Kiểm tra lại thông tin và chọn "Thanh toán qua MoMo" để nhận mã QR chính thức.
                  </p>
                </header>

                <div className="space-y-4 rounded-2xl bg-gray-25 p-5 text-sm text-gray-700">
                  <div className="flex items-center justify-between">
                    <span>Khách liên hệ</span>
                    <span className="font-medium text-gray-900">{contactInfo?.fullName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Email</span>
                    <span className="font-medium text-gray-900">{contactInfo?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Số điện thoại</span>
                    <span className="font-medium text-gray-900">{contactInfo?.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ngày khởi hành</span>
                    <span className="font-medium text-gray-900">
                      {selectedDeparture
                        ? `${formatDate(selectedDeparture.startDate)} - ${formatDate(selectedDeparture.endDate)}`
                        : 'Chưa chọn'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Số khách</span>
                    <span className="font-medium text-gray-900">
                      {totalGuests} (NL {guestCounts.adults} · TE {guestCounts.children})
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                    <span>Tổng thanh toán</span>
                    <span>{CURRENCY_FORMATTER.format(estimatedTotal)}</span>
                  </div>
                    </div>

                <div className="space-y-3">
                    <MoMoPaymentButton
                      amount={estimatedTotal}
                      tourName={tour.tourName}
                      onCreateBooking={handleCreateBooking}
                      userId={user?.userId}
                      onProcessingChange={setCreatingBooking}
                      onError={(message) => setBookingError(message)}
                    />
                  {bookingError && (
                    <p className="rounded-2xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
                      {bookingError}
                      </p>
                    )}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
                      <button
                        type="button"
                    onClick={() => setStep(1)}
                    className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-300 hover:text-gray-900"
                      >
                    ← Quay lại chỉnh sửa
                      </button>
                  {creatingBooking && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
                      Đang tạo booking...
                      </div>
                  )}
                    </div>
                  </div>
            )}
          </div>

          <aside className="space-y-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-card lg:p-8">
            <div className="space-y-4">
              <img
                src={tour.images?.find((img) => img.isPrimary)?.imageUrl ?? tour.images?.[0]?.imageUrl ?? ''}
                alt={tour.tourName}
                className="h-48 w-full rounded-2xl object-cover"
                loading="lazy"
              />
              <div className="space-y-2 text-sm text-gray-600">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">Tổng quan</p>
                <div className="flex items-center justify-between">
                  <span>Điểm đến</span>
                  <span className="font-medium text-gray-900">{tour.mainDestination}</span>
                        </div>
                <div className="flex items-center justify-between">
                  <span>Khởi hành</span>
                  <span className="font-medium text-gray-900">
                    {selectedDeparture
                      ? `${formatDate(selectedDeparture.startDate)} → ${formatDate(selectedDeparture.endDate)}`
                      : 'Chưa chọn'}
                  </span>
                      </div>
                {selectedDeparture?.status && (
                  <div className="flex items-center justify-between">
                    <span>Tình trạng</span>
                    <span className="font-medium text-gray-900">
                      {STATUS_LABELS[selectedDeparture.status] ?? selectedDeparture.status}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Số khách</span>
                  <span className="font-medium text-gray-900">
                    {totalGuests} (NL {guestCounts.adults} · TE {guestCounts.children})
                  </span>
                    </div>
                <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                  <span>Tạm tính</span>
                    <span>{CURRENCY_FORMATTER.format(estimatedTotal)}</span>
                    </div>
                <p className="text-xs text-gray-500">
                  Miễn phí hủy trong 24h, hoàn tiền nhanh nếu thanh toán thất bại.
                </p>
                    </div>
                  </div>
          </aside>
        </section>
      </div>
    </main>
  );
};

export default BookingPage;