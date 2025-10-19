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
      results = results.filter((tour) =>
        tour.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
      );
    }
    if (filters.priceRange && filters.priceRange !== 'any') {
      results = results.filter((tour) => {
        if (filters.priceRange === 'under-2000') return tour.price < 2000;
        if (filters.priceRange === '2000-4000') return tour.price >= 2000 && tour.price <= 4000;
        return tour.price > 4000;
      });
    }
    return results;
  }, [filters]);

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-14 md:px-8">
      <SectionTitle
        eyebrow="Find your next escape"
        title="Browse curated tours and private experiences"
        description="Filters mirror backend query params (`/tours?destination=` `?priceRange=` etc.) so swapping to live data is effortless."
      />

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <TourFilters onFilter={setFilters} />
        {filteredTours.length > 0 ? (
          <TourGrid tours={filteredTours} />
        ) : (
          <EmptyState
            title="No tours match your filters"
            description="Reset filters or try another destination. Our concierge team can also design a custom itinerary."
            actionLabel="Talk to concierge"
            actionTo="/contact"
            icon={MapPin}
          />
        )}
      </div>
    </div>
  );
};

export default Tours;
