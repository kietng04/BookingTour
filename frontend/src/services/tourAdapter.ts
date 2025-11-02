import slugify from '../utils/slug';
import { Tour } from '../data/tours';

type Nullable<T> = T | null | undefined;

export interface ApiTourImage {
  imageUrl: string;
  isPrimary?: Nullable<boolean>;
}

export interface ApiTourSchedule {
  dayNumber: number;
  scheduleDescription: string;
}

export interface ApiTour {
  id: number;
  tourName: string;
  slug?: string;
  description?: string;
  days?: number;
  nights?: number;
  regionId?: number;
  provinceId?: number;
  departurePoint?: string;
  mainDestination?: string;
  adultPrice?: number;
  childPrice?: number;
  status?: string;
  images?: ApiTourImage[];
  schedules?: ApiTourSchedule[];
}

const DEFAULT_OPERATOR = {
  name: 'BookingTour',
  avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&h=160&q=80',
  rating: 4.8,
  tourCount: 24,
  responseTime: 'Trong 2 giờ',
  founded: '2018',
  certifications: ['Tổng cục Du lịch', 'ISO 9001:2015'],
};

const ensureArray = <T,>(input: Nullable<T[]>, fallback: T[] = []): T[] =>
  Array.isArray(input) ? input : fallback;

const dedupeArray = <T,>(items: T[]): T[] => Array.from(new Set(items));

const buildDuration = (tour: ApiTour, fallback?: string): string => {
  if (tour.days && tour.nights !== undefined) {
    return `${tour.days} ngày${tour.nights ? ` ${tour.nights} đêm` : ''}`;
  }
  return fallback ?? 'Lịch trình linh hoạt';
};

const mapSchedulesToItinerary = (schedules: Nullable<ApiTourSchedule[]>) => {
  if (!schedules?.length) return undefined;

  return schedules
    .sort((a, b) => a.dayNumber - b.dayNumber)
    .map((item) => ({
      day: `Ngày ${item.dayNumber}`,
      title: `Hoạt động ngày ${item.dayNumber}`,
      description: item.scheduleDescription,
      image: 'https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?auto=format&fit=crop&w=800&q=80',
    }));
};

const buildQuickSummary = (tour: ApiTour, fallback?: string[]): string[] => {
  if (fallback?.length) {
    return fallback;
  }

  const summary: string[] = [];

  if (tour.departurePoint) {
    summary.push(`Khởi hành từ ${tour.departurePoint}`);
  }
  if (tour.mainDestination) {
    summary.push(`Khám phá ${tour.mainDestination}`);
  }
  if (tour.days) {
    summary.push(`Lịch trình ${tour.days} ngày ${tour.nights ?? 0} đêm`);
  }

  if (summary.length === 0 && tour.description) {
    summary.push(tour.description.slice(0, 120));
  }

  return summary;
};

const buildIncluded = (fallback?: string[]): string[] =>
  fallback?.length
    ? fallback
    : [
        'Xe đưa đón theo chương trình',
        'Hướng dẫn viên chuyên nghiệp',
        '01 bữa ăn đặc sản địa phương',
      ];

const buildExcluded = (fallback?: string[]): string[] =>
  fallback?.length
    ? fallback
    : [
        'Chi phí cá nhân ngoài chương trình',
        'Thuế VAT (nếu có yêu cầu xuất hóa đơn)',
        'Tiền tip cho hướng dẫn viên và tài xế',
      ];

const pickImages = (apiImages?: ApiTourImage[]) => {
  const apiGallery = ensureArray(apiImages).map((image) => image.imageUrl);
  const gallery = dedupeArray(apiGallery);

  const heroImage =
    apiImages?.find((image) => image.isPrimary)?.imageUrl ??
    gallery[0] ??
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80';

  return {
    heroImage,
    heroImageAlt: 'Beautiful travel landscape',
    gallery: gallery.length ? gallery : [heroImage],
  };
};

const buildHighlights = (tour: ApiTour, itinerary: ReturnType<typeof mapSchedulesToItinerary> = []) => {
  if (itinerary && itinerary.length) {
    return itinerary.slice(0, 3).map((item) => item.description.slice(0, 120));
  }
  const summary = buildQuickSummary(tour);
  return summary.slice(0, 3);
};

export const enrichTourFromApi = (apiTour: ApiTour): Tour => {
  const baseSlug = apiTour.slug ?? slugify(apiTour.tourName);
  const { heroImage, heroImageAlt, gallery } = pickImages(apiTour.images);
  const normalizedPrice = Number(apiTour.adultPrice ?? 0);

  const itinerary = mapSchedulesToItinerary(apiTour.schedules) ?? [];

  return {
    id: String(apiTour.id),
    slug: baseSlug,
    title: apiTour.tourName,
    destination: apiTour.mainDestination ?? 'Việt Nam',
    country: 'Việt Nam',
    duration: buildDuration(apiTour),
    groupSize: 'Nhóm nhỏ tối đa 20 khách',
    priceFrom: normalizedPrice,
    rating: 4.6,
    reviewCount: itinerary.length ? itinerary.length * 6 : 24,
    heroImage,
    heroImageAlt,
    gallery,
    quickSummary: buildQuickSummary(apiTour),
    highlights: buildHighlights(apiTour, itinerary),
    overview: apiTour.description ?? 'Đang cập nhật mô tả chi tiết cho hành trình này.',
    itinerary,
    included: buildIncluded(),
    excluded: buildExcluded(),
    cancellationPolicy: 'Miễn phí hủy trước 7 ngày khởi hành.',
    operator: DEFAULT_OPERATOR,
    reviews: [],
    tags: apiTour.mainDestination ? [apiTour.mainDestination] : [],
  };
};

export const enrichToursFromApi = (apiTours: ApiTour[] = []): Tour[] =>
  apiTours.map(enrichTourFromApi);
