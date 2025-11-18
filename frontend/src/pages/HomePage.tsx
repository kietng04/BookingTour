import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Award, Clock3, Compass, Map, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import TourGrid from '../components/tours/TourGrid';
import { Tour } from '../data/tours';
import { toursAPI } from '../services/api';
import { enrichToursFromApi, ApiTour } from '../services/tourAdapter';

interface SearchState {
  destination: string;
  dateRange: { startDate?: Date; endDate?: Date };
  guests: number;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchState, setSearchState] = useState<SearchState>({
    destination: '',
    dateRange: {},
    guests: 2,
  });
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastKeyword, setLastKeyword] = useState<string>('');
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const loadTours = useCallback(
    async (keyword?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await toursAPI.getAll(keyword ? { keyword } : undefined);
        const items: ApiTour[] = Array.isArray(response?.content)
          ? response.content
          : Array.isArray(response)
            ? response
            : [];
        setTours(enrichToursFromApi(items));
      } catch (err) {
        console.error('Failed to fetch tours', err);
        setError('Không thể tải danh sách tour. Vui lòng thử lại sau.');
        setTours([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadTours();
  }, [loadTours]);

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchesDestination = searchState.destination
        ? [tour.destination, tour.country, tour.title]
            .join(' ')
            .toLowerCase()
            .includes(searchState.destination.toLowerCase())
        : true;

      return matchesDestination;
    });
  }, [searchState.destination, tours]);

  const handleWishlist = (tourId: string) => {
    setWishlist((prev) => ({ ...prev, [tourId]: !prev[tourId] }));
  };

  const handleSearch = (values: SearchState) => {
    const keyword = values.destination?.trim() ? values.destination.trim() : '';
    setSearchState(values);
    setLastKeyword(keyword);
    loadTours(keyword || undefined);
  };

  return (
    <main id="main-content" className="bg-white">
      <section className="container py-10 lg:py-16">
  <HeroSection />
      </section>

      <section className="border-y border-gray-100 bg-gray-25">
        <div className="container py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="grid gap-6 lg:grid-cols-4"
          >
            {[
              {
                icon: Shield,
                title: 'Đối tác uy tín',
                description: 'Mỗi hành trình đều được kiểm định kỹ lưỡng về độ an toàn và trách nhiệm môi trường.',
              },
              {
                icon: Award,
                title: 'Hướng dẫn viên bản địa',
                description: 'Đội ngũ được chứng nhận với kiến thức địa phương sâu sắc và phong cách chuyên nghiệp.',
              },
              {
                icon: Clock3,
                title: 'Lịch trình linh hoạt',
                description: 'Miễn phí hủy tới 48 giờ trước khởi hành đối với đa số tour trong hệ thống.',
              },
              {
                icon: Sparkles,
                title: 'Trải nghiệm tuyển chọn',
                description: 'Nhóm nhỏ giới hạn, tiếp cận độc quyền và dịch vụ cá nhân hóa cho từng khách.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
              >
                <feature.icon className="h-8 w-8 text-brand-500" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="tours" className="container space-y-10 py-14 lg:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 md:text-4xl">Hành trình gợi ý dành riêng cho bạn</h2>
            <p className="mt-2 max-w-2xl text-base text-gray-500">
              Những tuyến tour được thiết kế bởi chuyên gia địa phương, chi phí minh bạch cùng trải nghiệm chân thực và đánh giá xác thực.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/tours')}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-brand-300 hover:text-gray-900 focus-visible:border-brand-300"
          >
            <ArrowRight className="h-4 w-4 text-brand-500" aria-hidden="true" />
            Xem thêm tour
          </button>
        </div>

        {error && !isLoading && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
            <div className="flex items-center justify-between gap-4">
              <span>{error}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => loadTours(lastKeyword || undefined)}
                  className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700 focus-visible:bg-red-700"
                >
                  Thử tải lại
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                  }}
                  className="rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-700 transition hover:border-red-400 focus-visible:border-red-400"
                >
                  Ẩn thông báo
                </button>
              </div>
            </div>
          </div>
        )}

        <TourGrid
          tours={filteredTours}
          isLoading={isLoading}
          onWishlist={handleWishlist}
          wishlistState={wishlist}
        />

        {filteredTours.length === 0 && !isLoading && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-25 p-10 text-center">
            <h3 className="text-xl font-semibold text-gray-900">Chưa có tour phù hợp</h3>
            <p className="mt-2 text-sm text-gray-600">
              Bạn hãy thử điều chỉnh tìm kiếm hoặc khám phá những điểm đến nổi bật được gợi ý bên dưới.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {['Hà Nội', 'Đà Nẵng', 'Phú Quốc', 'Sa Pa'].map((destination) => (
                <button
                  key={destination}
                  type="button"
                  onClick={() =>
                    handleSearch({ destination, dateRange: searchState.dateRange, guests: searchState.guests })
                  }
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-brand-300 hover:text-gray-900 focus-visible:border-brand-300"
                >
                  {destination}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="border-t border-gray-100 bg-white">
        <div className="container grid gap-10 py-14 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-6"
          >
            <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-600">
              Cách thức hoạt động
            </span>
            <h2 className="text-3xl font-semibold text-gray-900">Lên kế hoạch với sự tự tin</h2>
            <p className="text-base text-gray-600">
              BookingTour kết hợp công nghệ với chuyên môn con người. Các nhà thiết kế du lịch của chúng tôi tạo ra những trải nghiệm cân bằng giữa chiều sâu văn hóa, sự thoải mái và tính linh hoạt.
            </p>
            <div className="space-y-6">
              {[
                {
                  icon: Map,
                  title: 'Hành trình được cá nhân hóa',
                  description: 'Chúng tôi cá nhân hóa từng tour dựa trên phong cách du lịch, sở thích về nhịp độ và sở thích của bạn.',
                },
                {
                  icon: Compass,
                  title: 'Hướng dẫn viên & chủ nhà được xác minh',
                  description: 'Các chuyên gia được chứng nhận sống tại địa phương và biết những viên ngọc ẩn ngoài sách hướng dẫn.',
                },
                {
                  icon: Shield,
                  title: 'Bảo vệ linh hoạt',
                  description: 'Thay đổi ngày miễn phí lên đến 14 ngày trước khởi hành cho hầu hết các trải nghiệm.',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 shadow-inner">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-3xl bg-gray-900 text-white shadow-card"
          >
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80"
              alt="Couple enjoying a scenic European coastline on a boat"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 p-10">
              <h3 className="text-2xl font-semibold">Nói chuyện với nhà thiết kế du lịch</h3>
              <p className="mt-3 max-w-md text-sm text-white/80">
                Chia sẻ kế hoạch du lịch của bạn với các chuyên gia để có hành trình được tùy chỉnh, quyền truy cập độc quyền và các khuyến nghị từ người trong cuộc.
              </p>
              <Link
                to="/custom-tour-request"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-white/90 px-5 py-3 text-sm font-semibold text-gray-900 shadow-lg transition hover:bg-white focus-visible:bg-white"
              >
                Lên kế hoạch chuyến đi tùy chỉnh
              </Link>
            </div>
          </motion.div>
        </div>
      </section>\n</main>
  );
};

export default HomePage;



