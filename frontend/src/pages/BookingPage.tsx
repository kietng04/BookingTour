import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import GuestSelector from '../components/forms/GuestSelector';
import MoMoPaymentButton from '../components/payment/MoMoPaymentButton';
import { toursAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader2, CalendarDays, MapPin } from 'lucide-react';

interface Departure {
  id: number;
  startDate: string;
  endDate: string;
  remainingSlots: number;
  totalSlots?: number;
}

interface TourResponse {
  id: number;
  tourName: string;
  description: string;
  mainDestination: string;
  adultPrice: number;
  images: Array<{ imageUrl: string; isPrimary: boolean }>;
  departures: Departure[];
}

interface ContactFormValues {
  fullName: string;
  email: string;
  phone: string;
}

type Step = 1 | 2;

const BookingPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [tour, setTour] = useState<TourResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>(1);
  const [guests, setGuests] = useState(2);
  const [selectedDepartureId, setSelectedDepartureId] = useState<number | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactFormValues | null>(null);
  const [creatingBooking, setCreatingBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const contactForm = useForm<ContactFormValues>({
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
        setTour(response);
        if (response?.departures?.length) {
          setSelectedDepartureId(response.departures[0].id);
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

  const selectedDeparture: Departure | undefined = useMemo(() => {
    if (!tour || selectedDepartureId == null) return undefined;
    return tour.departures.find((departure) => departure.id === selectedDepartureId);
  }, [tour, selectedDepartureId]);

  const estimatedTotal = useMemo(() => {
    if (!tour) return 0;
    const basePrice = Number(tour.adultPrice) || 0;
    return Math.max(1, guests) * basePrice;
  }, [tour, guests]);

  const handleContactSubmit = (values: ContactFormValues) => {
    setContactInfo(values);
    setStep(2);
  };

  const handleCreateBooking = async () => {
    if (!tour || !selectedDeparture) {
      throw new Error('Thiếu thông tin tour hoặc ngày khởi hành.');
    }

    setBookingError(null);
    setCreatingBooking(true);
    try {
      const payload = {
        userId: user?.userId ?? 1,
        tourId: tour.id,
          departureId: selectedDeparture.id,
        seats: guests,
        totalAmount: estimatedTotal,
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
                  ? `${format(new Date(selectedDeparture.startDate), 'dd/MM/yyyy')} - ${format(
                      new Date(selectedDeparture.endDate),
                      'dd/MM/yyyy'
                    )}`
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

                <div className="space-y-4">
                      <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Ngày khởi hành</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {tour.departures?.length ? (
                        tour.departures.map((departure) => {
                          const isSelected = departure.id === selectedDepartureId;
                          return (
                            <button
                              type="button"
                              key={departure.id}
                              onClick={() => setSelectedDepartureId(departure.id)}
                              className={`rounded-2xl border px-4 py-3 text-left text-sm transition hover:border-brand-300 hover:bg-brand-50 ${
                                isSelected ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-gray-200 bg-gray-25'
                              }`}
                              aria-pressed={isSelected}
                              aria-label={`Khởi hành ${format(new Date(departure.startDate), 'dd/MM/yyyy')} đến ${format(
                                new Date(departure.endDate),
                                'dd/MM/yyyy'
                              )}`}
                            >
                              <span className="block font-semibold text-gray-900">
                                {format(new Date(departure.startDate), 'dd/MM/yyyy')} →{' '}
                                {format(new Date(departure.endDate), 'dd/MM/yyyy')}
                              </span>
                              <span className="mt-1 block text-xs text-gray-500">
                                Còn lại {departure.remainingSlots}{' '}
                                {(departure.totalSlots ?? 0) > 0 ? `/ ${(departure.totalSlots ?? 0)}` : 'chỗ'}
                        </span>
                            </button>
                          );
                        })
                      ) : (
                        <p className="rounded-2xl border border-dashed border-gray-200 bg-gray-25 p-4 text-sm text-gray-500">
                          Tour chưa có lịch khởi hành công khai.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Số khách</p>
                    <GuestSelector value={guests} onChange={setGuests} />
                    </div>

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
                      {...contactForm.register('phone', { required: 'Vui lòng nhập số điện thoại.' })}
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

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Tổng tạm tính</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {estimatedTotal.toLocaleString('vi-VN')} ₫
                    </p>
                    <p className="text-xs text-gray-500">
                      Giá dành cho {guests} khách. Phí thanh toán MoMo được miễn.
                    </p>
                    </div>
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
                      disabled={!selectedDepartureId || !contactForm.formState.isValid}
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
                        ? `${format(new Date(selectedDeparture.startDate), 'dd/MM/yyyy')} - ${format(
                            new Date(selectedDeparture.endDate),
                            'dd/MM/yyyy'
                          )}`
                        : 'Chưa chọn'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Số khách</span>
                    <span className="font-medium text-gray-900">{guests}</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                    <span>Tổng thanh toán</span>
                    <span>{estimatedTotal.toLocaleString('vi-VN')} ₫</span>
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
                      ? format(new Date(selectedDeparture.startDate), 'dd/MM/yyyy')
                      : 'Chưa chọn'}
                  </span>
                      </div>
                <div className="flex items-center justify-between">
                  <span>Số khách</span>
                  <span className="font-medium text-gray-900">{guests}</span>
                    </div>
                <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                  <span>Tạm tính</span>
                  <span>{estimatedTotal.toLocaleString('vi-VN')} ₫</span>
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
