import { useMemo, useState } from 'react';
import SectionTitle from '../components/common/SectionTitle.jsx';
import TourFilters from '../components/tour/TourFilters.jsx';
import TourGrid from '../components/tour/TourGrid.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { tours } from '../data/mockTours.js';
import { MapPin } from 'lucide-react';

const Tours = () => {
  const [filters, setFilters] = useState({});

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
  }, [filters]);

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-14 md:px-8">
      <SectionTitle
        eyebrow="Tìm hành trình kế tiếp"
        title="Khám phá tour chọn lọc và trải nghiệm riêng tư"
        description="Bộ lọc khớp hoàn toàn với query backend (`/tours?destination=&priceRange=`...) giúp chuyển sang dữ liệu thật dễ dàng."
      />

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <TourFilters onFilter={setFilters} />
        {filteredTours.length > 0 ? (
          <TourGrid tours={filteredTours} />
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
