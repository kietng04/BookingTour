import { useEffect, useMemo, useState } from 'react';
import SectionTitle from '../components/common/SectionTitle.jsx';
import TourFilters from '../components/tour/TourFilters.jsx';
import TourGrid from '../components/tour/TourGrid.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { MapPin } from 'lucide-react';
import { toursAPI, regionsAPI } from '../services/api.js';

const DEFAULT_TOUR_IMAGE =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80';

const transformTour = (tour) => {
  const primaryImage = tour.images?.find((image) => image.isPrimary) ?? tour.images?.[0];

  return {
    id: tour.slug ?? `tour-${tour.id}`,
    slug: tour.slug,
    tourId: tour.id,
    name: tour.tourName ?? 'Tour chưa đặt tên',
    destination: tour.mainDestination ?? tour.departurePoint ?? 'Đang cập nhật',
    duration: tour.days ?? 0,
    groupSize: tour.groupSize ?? 'Liên hệ concierge',
    difficulty: (tour.difficulty ?? 'moderate').toLowerCase(),
    difficultyLabel: tour.difficultyLabel,
    price: tour.adultPrice ? Number(tour.adultPrice) : 0,
    reviewsCount: tour.reviewsCount ?? 0,
    description: tour.description ?? '',
    thumbnail: primaryImage?.imageUrl ?? DEFAULT_TOUR_IMAGE
  };
};

const Tours = () => {
  const [filters, setFilters] = useState({});
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);


  // helper gom params
  const buildTourParams = (filters) => {
    const params = { page: 0, size: 100, status: 'ACTIVE' };
    if (filters.search)
      params.keyword = filters.search.trim();
    if (filters.destination)
      params.destination = filters.destination.trim();
    if (filters.regionId)
      params.regionId = filters.regionId;
    if (filters.provinceId)
      params.provinceId = filters.provinceId;
    if (filters.priceRange && filters.priceRange !== 'any')
      params.priceRange = filters.priceRange;
    if (filters.startDate)
      params.startDate = filters.startDate;
    if (filters.endDate)
      params.endDate = filters.endDate;
    return params;
  };

  // tải toàn bộ vùng tỉnh thành
  useEffect(() => {
    let cancelled = false;
    const loadRegions = async () => {
      try {
        const data = await regionsAPI.getAll();
        if (cancelled) return;
        setRegions((Array.isArray(data) ? data : []).map((region) => ({
          id: String(region.id ?? region.regionId),
          name: region.name ?? 'Không tên',
        }))
        );
      } catch (error) {
        console.error('Không lấy được danh sách vùng', error);
      }
    };

    loadRegions();
    return () => {
      cancelled = true;
    };
  }, []);

  // Handle khi user click region thì gọi api
  useEffect(() => {
    if (!filters.regionId) {
      setProvinces([]);
      return;
    }
    let cancelled = false;
    const loadProvinces = async () => {
      try {
        const data = await regionsAPI.getProvinces(filters.regionId);
        if (cancelled) return;
        setProvinces(
          (Array.isArray(data) ? data : []).map((province) => ({
            id: String(province.id ?? province.provinceId),
            name: province.name ?? 'Không tên',
            regionId: String(
              province.regionId ??
              province.region?.id ??
              province.region?.regionId ??
              filters.regionId
            ),
          }))
        );
      } catch (error) {
        console.error('Không lấy được danh sách tỉnh', error);
      }
    };

    loadProvinces();
    return () => {
      cancelled = true;
    };
  }, [filters.regionId]);

  // useEffect chạy filter
  useEffect(() => {
    let cancelled = false;

    const fetchTours = async () => {
      setLoading(true);
      try {
        const response = await toursAPI.getAll(buildTourParams(filters));
        const list = Array.isArray(response?.content) ? response.content : response ?? [];

        if (!cancelled)
          setTours(list.map(transformTour));
      } catch (err) {
        if (!cancelled)
          setError(err.message || 'Không thể tải danh sách tour. Vui lòng thử lại sau.');

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchTours();

    return () => {
      cancelled = true;
    };
  }, [filters]);

  const filteredTours = useMemo(() => {
    let results = [...tours];
    if (filters.search) {
      results = results.filter((tour) =>
        tour.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.destination) {
      results = results.filter((tour) =>
        tour.destination.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }
    if (filters.difficulty && filters.difficulty !== 'any') {
      results = results.filter(
        (tour) => tour.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
      );
    }
    if (filters.priceRange && filters.priceRange !== 'any') {
      results = results.filter((tour) => {
        if (filters.priceRange === 'under-5000000') return tour.price < 5000000;
        if (filters.priceRange === '5000000-9000000')
          return tour.price >= 5000000 && tour.price <= 9000000;
        return tour.price > 9000000;
      });
    }
    return results;
  }, [filters, tours]);

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-14 md:px-8">
      <SectionTitle
        eyebrow="Tìm hành trình kế tiếp"
        title="Khám phá tour chọn lọc và trải nghiệm riêng tư"
        description="Bộ lọc khớp hoàn toàn với query backend (`/tours?destination=&priceRange=`...) giúp chuyển sang dữ liệu thật dễ dàng."
      />

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <TourFilters onFilter={setFilters} regions={regions} provinces={provinces}/>
        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-8 text-center">
            <p className="text-sm font-semibold text-red-700">Lỗi tải dữ liệu</p>
            <p className="mt-2 text-sm text-red-500">{error}</p>
          </div>
        ) : filteredTours.length > 0 || loading ? (
          <TourGrid tours={filteredTours} loading={loading} />
        ) : (
          <EmptyState
            title="Không có tour phù hợp với bộ lọc"
            description="Hãy thử điều chỉnh tiêu chí hoặc chọn điểm đến khác. Đội concierge luôn sẵn sàng thiết kế lịch trình riêng cho bạn."
            actionLabel="Trao đổi với concierge"
            actionTo="/contact"
            icon={MapPin}
          />
        )}
      </div>
    </div>
  );
};

export default Tours;
