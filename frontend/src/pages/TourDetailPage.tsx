import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock3, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import TourGallery from '../components/tours/TourGallery';
import TourInfoTabs from '../components/tours/TourInfoTabs';
import BookingSidebar from '../components/tours/BookingSidebar';
import OperatorCard from '../components/tours/OperatorCard';
import ReviewList from '../components/tours/ReviewList';
import { Tour } from '../data/tours';
import { toursAPI } from '../services/api';
import { enrichTourFromApi, ApiTour } from '../services/tourAdapter';
import Skeleton from '../components/ui/Skeleton';

interface DepartureSummary {
  id: number;
  startDate: string;
  endDate: string;
  remainingSlots: number;
  totalSlots: number;
  status: string;
}

const DEPARTURE_STATUS_LABELS: Record<string, string> = {
  CONCHO: 'Còn chỗ',
  SAPFULL: 'Sắp đầy',
  FULL: 'Đã đầy',
  DAKHOIHANH: 'Đã khởi hành',
};

const mapDepartures = (items: any[]): DepartureSummary[] =>
  Array.isArray(items)
    ? items.map((item) => ({
        id: item.id ?? item.departureId ?? 0,
        startDate: item.startDate,
        endDate: item.endDate,
        remainingSlots: item.remainingSlots ?? 0,
        totalSlots: item.totalSlots ?? 0,
        status: item.status ?? 'CONCHO',
      }))
    : [];

const TourDetailPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [departures, setDepartures] = useState<DepartureSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = useCallback((value?: string) => {
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
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      if (!slug) {
        setError('Thông tin tour không hợp lệ.');
        setTour(null);
        setDepartures([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const tourResponse = (await toursAPI.getBySlug(slug)) as ApiTour & {
          departures?: any[];
        };

        if (cancelled) {
          return;
        }

        setTour(enrichTourFromApi(tourResponse as ApiTour));

        let mappedDepartures: DepartureSummary[] = mapDepartures(tourResponse.departures ?? []);

        if (!mappedDepartures.length && tourResponse.id) {
          try {
            const fallbackDepartures = await toursAPI.getDepartures(tourResponse.id);
            mappedDepartures = mapDepartures(fallbackDepartures as any[]);
          } catch (departureErr) {
            console.warn('Không thể tải lịch khởi hành:', departureErr);
          }
        }

        if (!cancelled) {
          setDepartures(mappedDepartures);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to fetch tour detail', err);
          setError('Không thể tải chi tiết tour. Vui lòng thử lại.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const reviewSummary = useMemo(() => {
    if (!tour) return '';
    const totalReviews = tour.reviewCount ?? tour.reviews?.length ?? 0;
    return totalReviews > 0 ? `${totalReviews} đánh giá từ du khách` : '';
  }, [tour]);

  if (isLoading) {
    return (
      <main id="main-content" className="container min-h-[60vh] py-24">
        <div className="mx-auto max-w-2xl space-y-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </main>
    );
  }

  if (!tour) {
    return (
      <main id="main-content" className="container min-h-[60vh] py-24">
        <div className="mx-auto max-w-xl text-center space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Không tìm thấy tour</p>
          <h1 className="text-3xl font-semibold text-gray-900">Chúng tôi chưa tìm được trải nghiệm phù hợp</h1>
          <p className="text-sm text-gray-600">
            {error ?? 'Tour có thể đã được cập nhật hoặc tạm ngừng mở bán. Bạn hãy khám phá những gợi ý khác nhé!'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-600 focus-visible:bg-brand-600"
          >
            Quay lại trang chủ
          </button>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="bg-gray-25 pb-16">
      <div className="container space-y-10 py-10 lg:py-16">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-gray-900 focus-visible:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Quay lại
        </button>

        <div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="space-y-4"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">
            {tour.destination}, {tour.country}
          </p>
          <h1 className="text-4xl font-semibold text-gray-900">{tour.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-500" aria-hidden="true" />
              Nhóm nhỏ · {tour.groupSize}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-brand-500" aria-hidden="true" />
              {tour.duration}
            </span>
            {reviewSummary && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-700 shadow-inner">
                {reviewSummary}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
            {tour.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white px-3 py-1 text-[11px] text-gray-600 shadow-inner">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <TourGallery images={tour.gallery} alt={tour.heroImageAlt} />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-card">
              <h2 className="text-2xl font-semibold text-gray-900">Điểm nhấn hành trình</h2>
              <p className="mt-3 text-sm text-gray-600">{tour.overview}</p>
              <ul className="mt-6 grid gap-4 lg:grid-cols-2">
                {tour.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <Sparkles className="mt-1 h-5 w-5 text-brand-500" aria-hidden="true" />
                    <p className="text-sm text-gray-700">{highlight}</p>
                  </li>
                ))}
              </ul>
            </section>

            {departures.length > 0 && (
              <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
                <h2 className="text-lg font-semibold text-gray-900">Lịch khởi hành sắp tới</h2>
                <ul className="mt-4 space-y-3">
                  {departures.map((departure) => (
                    <li
                      key={departure.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {formatDate(departure.startDate)} → {formatDate(departure.endDate)}
                        </p>
                        <p className="text-xs uppercase tracking-widest text-gray-500">
                          {DEPARTURE_STATUS_LABELS[departure.status] ?? departure.status}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          Còn {departure.remainingSlots}/{departure.totalSlots} chỗ
                        </p>
                        <p className="text-xs text-gray-500">Giữ chỗ miễn phí trong 24h</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <TourInfoTabs
              defaultTabId="overview"
              tabs={[
                {
                  id: 'overview',
                  label: 'Tổng quan',
                  content: (
                    <div className="grid gap-6 lg:grid-cols-2">
                      {tour.quickSummary.map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  id: 'itinerary',
                  label: 'Lịch trình',
                  content: (
                    <div className="space-y-6">
                      {tour.itinerary.map((item) => (
                        <article
                          key={item.day}
                          className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:p-5"
                        >
                          <img
                            src={item.image}
                            alt=""
                            loading="lazy"
                            className="h-32 w-full rounded-2xl object-cover sm:h-28 sm:w-40"
                          />
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">
                              {item.day}
                            </p>
                            <h3 className="mt-1 text-lg font-semibold text-gray-900">{item.title}</h3>
                            <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  ),
                },
                {
                  id: 'included',
                  label: 'Dịch vụ',
                  content: (
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">Giá tour đã bao gồm</h3>
                        <ul className="mt-3 space-y-2 text-sm text-gray-600">
                          {tour.included.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">Không bao gồm</h3>
                        <ul className="mt-3 space-y-2 text-sm text-gray-600">
                          {tour.excluded.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="mt-1 h-2 w-2 rounded-full bg-gray-300" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'reviews',
                  label: 'Đánh giá',
                  content: <ReviewList reviews={tour.reviews} />,
                  description: 'Nhận xét xác thực từ du khách đã trải nghiệm cùng BookingTour.',
                },
              ]}
            />

            <OperatorCard operator={tour.operator} />

            <section className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-card lg:p-8">
              <h2 className="text-lg font-semibold text-gray-900">Chính sách hủy</h2>
              <p className="text-sm text-gray-600">{tour.cancellationPolicy}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <ShieldCheck className="h-5 w-5 text-brand-500" aria-hidden="true" />
                Điều khoản linh hoạt, xác nhận ngay · Không phụ thu ẩn
              </div>
            </section>
          </div>

          <BookingSidebar
            priceFrom={tour.priceFrom}
            duration={tour.duration}
            reviewSummary={reviewSummary}
            onBook={() => navigate(`/booking/${tour.slug}`)}
          />
        </div>
      </div>
    </main>
  );
};

export default TourDetailPage;
