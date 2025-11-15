import { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MapPin, Shield, Users, Calendar, UsersIcon } from 'lucide-react';
import TourHighlights from '../components/tour/TourHighlights.jsx';
import TourGallery from '../components/tour/TourGallery.jsx';
import TourItinerary from '../components/tour/TourItinerary.jsx';
import ReviewsPanel from '../components/tour/ReviewsPanel.jsx';
import ReviewForm from '../components/reviews/ReviewForm.jsx';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import SectionTitle from '../components/common/SectionTitle.jsx';
import { formatCurrency } from '../utils/format.js';
import { toursAPI, reviewsAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.tsx';

const DEFAULT_TOUR_IMAGE =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80';

const transformScheduleToItinerary = (schedules = []) =>
  schedules
    .sort((a, b) => (a.dayNumber ?? 0) - (b.dayNumber ?? 0))
    .map((schedule) => {
      const rawItems = schedule.scheduleDescription
        ? schedule.scheduleDescription
            .split(/\r?\n/)
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

      const items = rawItems.length > 0 ? rawItems : [schedule.scheduleDescription].filter(Boolean);
      const fallbackTitle = items[0] ?? `Ngày ${schedule.dayNumber ?? ''}`.trim();

      return {
        day: schedule.dayNumber ?? 0,
        title: fallbackTitle,
        items
      };
    });

const buildHighlights = (data) => {
  const highlights = [];
  if (data.mainDestination) {
    highlights.push(`Hành trình khám phá ${data.mainDestination}`);
  }
  if (data.departurePoint) {
    highlights.push(`Khởi hành từ ${data.departurePoint}`);
  }
  if (data.days) {
    highlights.push(`${data.days} ngày ${data.nights ?? 0} đêm trải nghiệm chọn lọc`);
  }
  return highlights.length > 0 ? highlights : ['Hành trình được concierge tuyển chọn kỹ lưỡng'];
};

const transformTourDetail = (data) => {
  const primaryImage = data.images?.find((image) => image.isPrimary) ?? data.images?.[0];
  const gallery = (data.images ?? [])
    .filter((image) => image.imageUrl !== primaryImage?.imageUrl)
    .map((image) => image.imageUrl);

  const includes = data.includes ?? [
    'Concierge đồng hành trước - trong - sau chuyến đi',
    'Hỗ trợ điều chỉnh lịch trình linh hoạt theo nhu cầu',
    data.departurePoint ? `Đón tại ${data.departurePoint}` : null
  ].filter(Boolean);

  const excludes = data.excludes ?? [
    'Chi phí cá nhân và dịch vụ phát sinh ngoài chương trình',
    'Nâng hạng phòng và dịch vụ cao cấp theo yêu cầu riêng'
  ];

  return {
    id: data.slug ?? `tour-${data.id}`,
    slug: data.slug ?? `tour-${data.id}`,
    tourId: data.id,
    name: data.tourName ?? 'Tour chưa đặt tên',
    destination: data.mainDestination ?? data.departurePoint ?? 'Đang cập nhật',
    duration: data.days ?? 0,
    nights: data.nights ?? 0,
    groupSize: data.groupSize ?? 'Liên hệ concierge',
    price: data.adultPrice ? Number(data.adultPrice) : 0,
    description: data.description ?? 'Thông tin chi tiết sẽ được concierge bổ sung.',
    thumbnail: primaryImage?.imageUrl ?? DEFAULT_TOUR_IMAGE,
    gallery: gallery.length > 0 ? gallery : [primaryImage?.imageUrl ?? DEFAULT_TOUR_IMAGE],
    highlights: buildHighlights(data),
    itinerary: transformScheduleToItinerary(data.schedules),
    includes,
    excludes,
    policies: {
      cancellation:
        data.policies?.cancellation ?? 'Chính sách huỷ linh hoạt, liên hệ concierge để được hướng dẫn.',
      requirements:
        data.policies?.requirements ?? 'Concierge sẽ tư vấn chi tiết về sức khoẻ và giấy tờ cần thiết.',
      payment:
        data.policies?.payment ?? 'Thanh toán linh hoạt: đặt cọc giữ chỗ, phần còn lại trước ngày khởi hành.'
    }
  };
};

const TourDetail = () => {
  const { tourId } = useParams();
  const { isAuthenticated, token, user } = useAuth();
  const [tour, setTour] = useState(null);
  const [loadingTour, setLoadingTour] = useState(true);
  const [tourError, setTourError] = useState(null);
  const [departures, setDepartures] = useState([]);
  const [loadingDepartures, setLoadingDepartures] = useState(false);
  const [departuresError, setDeparturesError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    let isMounted = true;

    const fetchTour = async () => {
      if (!tourId) {
        setTourError('Không xác định được tour.');
        setLoadingTour(false);
        return;
      }

      try {
        setLoadingTour(true);
        setTourError(null);
        const data = await toursAPI.getBySlug(tourId);
        if (!isMounted) return;
        setTour(transformTourDetail(data));
      } catch (error) {
        console.error('Failed to load tour by slug:', error);
        let finalError = error;
        if (/^\d+$/.test(tourId)) {
          try {
            const fallback = await toursAPI.getById(Number(tourId));
            if (!isMounted) return;
            setTour(transformTourDetail(fallback));
            setTourError(null);
            return;
          } catch (fallbackError) {
            console.error('Fallback load tour by id failed:', fallbackError);
            finalError = fallbackError;
          }
        }
        if (isMounted) {
          setTour(null);
          setTourError(finalError.message || 'Không tìm thấy tour.');
        }
      } finally {
        if (isMounted) {
          setLoadingTour(false);
        }
      }
    };

    fetchTour();

    return () => {
      isMounted = false;
    };
  }, [tourId]);

  useEffect(() => {
    if (!tour?.tourId) {
      return;
    }

    let isMounted = true;

    const fetchDepartures = async () => {
      try {
        setLoadingDepartures(true);
        setDeparturesError(null);
        const data = await toursAPI.getDepartures(tour.tourId);
        if (!isMounted) return;
        setDepartures(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load departures:', error);
        if (isMounted) {
          setDepartures([]);
          setDeparturesError(error.message || 'Không thể tải lịch khởi hành.');
        }
      } finally {
        if (isMounted) {
          setLoadingDepartures(false);
        }
      }
    };

    fetchDepartures();

    return () => {
      isMounted = false;
    };
  }, [tour?.tourId]);

  useEffect(() => {
    if (!tour?.tourId) {
      return;
    }

    let isMounted = true;

    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        setReviewsError(null);
        const data = await reviewsAPI.getByTourId(tour.tourId);
        if (!isMounted) return;

        // Transform backend format to frontend format
        const transformedReviews = (Array.isArray(data) ? data : []).map((review) => ({
          id: `rv-${review.reviewId}`,
          tourId: tour.id,
          guest: review.guestName || 'Khách hàng',
          avatar: review.guestAvatar || `https://i.pravatar.cc/100?u=${review.userId}`,
          rating: parseFloat(review.rating),
          title: review.title,
          comment: review.comment,
          createdAt: review.createdAt,
          badges: review.badges || []
        }));

        setReviews(transformedReviews);
      } catch (error) {
        console.error('Failed to load reviews:', error);
        if (isMounted) {
          setReviews([]);
          setReviewsError(error.message || 'Không thể tải đánh giá.');
        }
      } finally {
        if (isMounted) {
          setLoadingReviews(false);
        }
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [tour?.tourId, tour?.id]);

  const handleSubmitReview = async (reviewData) => {
    if (!isAuthenticated || !token || !user) {
      throw new Error('Bạn cần đăng nhập để gửi đánh giá');
    }

    try {
      await reviewsAPI.create(tour.tourId, reviewData, token);
      setSubmitSuccess(true);
      setShowReviewForm(false);

      // Refresh reviews list
      const updatedReviews = await reviewsAPI.getByTourId(tour.tourId);
      const transformedReviews = (Array.isArray(updatedReviews) ? updatedReviews : []).map((review) => ({
        id: `rv-${review.reviewId}`,
        tourId: tour.id,
        guest: review.guestName || 'Khách hàng',
        avatar: review.guestAvatar || `https://i.pravatar.cc/100?u=${review.userId}`,
        rating: parseFloat(review.rating),
        title: review.title,
        comment: review.comment,
        createdAt: review.createdAt,
        badges: review.badges || []
      }));
      setReviews(transformedReviews);

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to submit review:', error);
      throw error;
    }
  };

  if (loadingTour) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-sm text-slate-500">Đang tải thông tin tour...</p>
      </div>
    );
  }

  if (tourError || !tour) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-sm text-slate-500">{tourError || 'Không tìm thấy tour.'}</p>
        <Button to="/tours" className="mt-4">
          Quay lại danh sách tour
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-14 md:px-8">
      <Link to="/tours" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500">
        <ArrowLeft className="h-4 w-4" />
        Quay về tất cả tour
      </Link>

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-primary-500">Hành trình riêng tư</p>
            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">{tour.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-500" />
                {tour.destination}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary-500" />
                {tour.duration} ngày
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-primary-500" />
                {tour.groupSize}
              </span>
            </div>
          </div>
          <div className="space-y-2 rounded-3xl bg-primary-50 px-6 py-4 text-right text-primary-700">
            <p className="text-xs uppercase tracking-widest">Giá trọn gói</p>
            <p className="text-2xl font-semibold">
              {formatCurrency(tour.price)} <span className="text-sm font-medium text-primary-500">/ khách</span>
            </p>
            <Button to={`/booking/${tour.slug}`} size="sm">
              Đặt tour ngay
            </Button>
          </div>
        </div>

        <TourGallery gallery={tour.gallery} thumbnail={tour.thumbnail} />
      </section>

      {/* Available Departures Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Lịch khởi hành còn chỗ</h2>
          <p className="mt-2 text-sm text-slate-600">Chọn ngày phù hợp để giữ chỗ ngay lập tức</p>
        </div>

        {loadingDepartures ? (
          <div className="text-center py-12">
            <p className="text-sm text-slate-500">Đang tải lịch khởi hành...</p>
          </div>
        ) : departuresError ? (
          <Card className="text-center py-12">
            <p className="text-sm font-semibold text-red-600">Không thể tải lịch khởi hành</p>
            <p className="mt-2 text-xs text-red-500">{departuresError}</p>
          </Card>
        ) : departures.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-sm text-slate-500">Hiện chưa có ngày khởi hành phù hợp.</p>
            <p className="mt-2 text-xs text-slate-400">Vui lòng quay lại sau hoặc liên hệ concierge để được sắp xếp lịch riêng.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departures.map((departure) => {
              const startDate = new Date(departure.startDate);
              const endDate = new Date(departure.endDate);
              const isAvailable = departure.remainingSlots > 0 && departure.status === 'CONCHO';
              const availabilityPercent = (departure.remainingSlots / departure.totalSlots) * 100;

              return (
                <Card key={departure.departureId} className="flex flex-col space-y-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-primary-600">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {startDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        đến {endDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      isAvailable
                        ? availabilityPercent > 50
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isAvailable ? 'Còn chỗ' : 'Hết chỗ'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <UsersIcon className="h-4 w-4 text-slate-400" />
                    <span>
                      Còn {departure.remainingSlots}/{departure.totalSlots} chỗ
                    </span>
                  </div>

                  {/* Availability bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        availabilityPercent > 50 ? 'bg-green-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${availabilityPercent}%` }}
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <Button
                      to={`/booking/${tour.slug}?departureId=${departure.departureId}`}
                      size="sm"
                      className="w-full"
                      disabled={!isAvailable}
                    >
                      {isAvailable ? 'Đặt suất này' : 'Đã hết chỗ'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Tabs Navigation */}
      <section className="border-b border-slate-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'reviews'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Đánh giá ({reviews.length})
          </button>
        </div>
      </section>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Trải nghiệm nổi bật</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{tour.description}</p>
              <div className="rounded-2xl bg-slate-100/70 p-4 text-sm text-slate-600">
                <p>
                  {`Dữ liệu được lấy trực tiếp từ backend qua endpoint \`/tours/by-slug/${tour.slug}\` thông qua API Gateway. Các khối nội dung (điểm nhấn, lịch trình, chính sách) phản ánh đúng response.`}
                </p>
              </div>
            </Card>

            <TourHighlights highlights={tour.highlights} />
            <TourItinerary itinerary={tour.itinerary} />
          </div>

          <div className="space-y-6">
            <Card className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Bao gồm trong giá</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                {tour.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Shield className="mt-1 h-4 w-4 text-primary-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-sm font-semibold text-slate-700">Không bao gồm</h4>
                <ul className="mt-2 space-y-2 text-sm text-slate-500">
                  {tour.excludes.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">Chính sách</h3>
              <div>
                <h4 className="text-sm font-semibold text-slate-700">Chính sách huỷ linh hoạt</h4>
                <p className="text-sm text-slate-500">{tour.policies.cancellation}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-700">Yêu cầu dành cho khách</h4>
                <p className="text-sm text-slate-500">{tour.policies.requirements}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-700">Điều kiện thanh toán</h4>
                <p className="text-sm text-slate-500">{tour.policies.payment}</p>
              </div>
            </Card>
          </div>
        </section>
      )}

      {activeTab === 'reviews' && (
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Nhận xét xác thực từ du khách</h2>
            <p className="text-sm text-slate-600">
              Tất cả đánh giá đều được kiểm duyệt bởi đội ngũ của chúng tôi
            </p>
          </div>

          {loadingReviews ? (
            <Card className="text-center py-12">
              <p className="text-sm text-slate-500">Đang tải đánh giá...</p>
            </Card>
          ) : reviewsError ? (
            <Card className="text-center py-12">
              <p className="text-sm text-red-600">Không thể tải đánh giá</p>
              <p className="text-xs text-red-500">{reviewsError}</p>
            </Card>
          ) : reviews.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-sm text-slate-500">Chưa có đánh giá cho tour này</p>
              <p className="text-xs text-slate-400 mt-2">Hãy là người đầu tiên đánh giá!</p>
            </Card>
          ) : (
            <div className="max-w-4xl mx-auto">
              <ReviewsPanel reviews={reviews} />
            </div>
          )}
        </section>
      )}

      {/* Review Form Section */}
      <section className="space-y-6">
        {submitSuccess && (
          <Card className="bg-green-50 border-green-200">
            <div className="text-center py-6">
              <p className="text-green-800 font-medium">Đánh giá của bạn đã được gửi thành công!</p>
              <p className="text-sm text-green-600 mt-2">
                Đánh giá sẽ được kiểm duyệt và hiển thị sau khi được duyệt.
              </p>
            </div>
          </Card>
        )}

        {isAuthenticated ? (
          !showReviewForm ? (
            <Card className="text-center py-12">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Bạn đã trải nghiệm tour này?
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Chia sẻ đánh giá của bạn để giúp người khác có thêm thông tin!
              </p>
              <Button onClick={() => setShowReviewForm(true)}>
                Viết đánh giá
              </Button>
            </Card>
          ) : (
            <ReviewForm
              tourId={tour.tourId}
              tourName={tour.name}
              onSuccess={handleSubmitReview}
              onCancel={() => setShowReviewForm(false)}
            />
          )
        ) : (
          <Card className="text-center py-12">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Đăng nhập để viết đánh giá
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Bạn cần đăng nhập để chia sẻ trải nghiệm của mình
            </p>
            <Button to="/login">
              Đăng nhập ngay
            </Button>
          </Card>
        )}
      </section>

      <SectionTitle
        align="center"
        eyebrow="Cần lịch trình riêng?"
        title="Thiết kế chuyến đi cùng concierge của chúng tôi"
        description="Dẫn form tới endpoint `/inquiries` để đội ngũ xử lý yêu cầu cao cấp, nhóm khách đoàn hay doanh nghiệp."
        actions={<Button to="/contact">Nhờ tư vấn riêng</Button>}
      />
    </div>
  );
};

export default TourDetail;
