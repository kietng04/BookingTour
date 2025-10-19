import PropTypes from 'prop-types';
import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import Card from '../common/Card.jsx';
import Button from '../common/Button.jsx';
import InputField from '../common/InputField.jsx';
import SelectField from '../common/SelectField.jsx';

const sortOptions = [
  { value: 'popular', label: 'Most popular' },
  { value: 'price-low', label: 'Price: Low to high' },
  { value: 'price-high', label: 'Price: High to low' },
  { value: 'duration', label: 'Longest adventure' }
];

const TourFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    search: '',
    destination: '',
    priceRange: 'any',
    difficulty: 'any'
  });

  const handleChange = (field, value) => {
    const next = { ...filters, [field]: value };
    setFilters(next);
    onFilter?.(next);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      destination: '',
      priceRange: 'any',
      difficulty: 'any'
    };
    setFilters(resetFilters);
    onFilter?.(resetFilters);
  };

  return (
    <Card className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary-500">
          <SlidersHorizontal className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Tailor your journey</h3>
          <p className="text-sm text-slate-500">Filters sync with backend params for seamless integration.</p>
        </div>
      </div>

      <InputField
        label="Search tours"
        placeholder="Try Iceland, Safari, Wellness..."
        value={filters.search}
        onChange={(event) => handleChange('search', event.target.value)}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Destination"
          placeholder="All destinations"
          value={filters.destination}
          onChange={(event) => handleChange('destination', event.target.value)}
        />
        <SelectField
          label="Sort by"
          value={filters.sortBy || 'popular'}
          onChange={(event) => handleChange('sortBy', event.target.value)}
          options={sortOptions}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label="Budget"
          value={filters.priceRange}
          onChange={(event) => handleChange('priceRange', event.target.value)}
          options={[
            { value: 'any', label: 'Any' },
            { value: 'under-2000', label: 'Under $2,000' },
            { value: '2000-4000', label: '$2,000 - $4,000' },
            { value: '4000+', label: '$4,000+' }
          ]}
        />
        <SelectField
          label="Pace"
          value={filters.difficulty}
          onChange={(event) => handleChange('difficulty', event.target.value)}
          options={[
            { value: 'any', label: 'All levels' },
            { value: 'easy', label: 'Easy & family friendly' },
            { value: 'moderate', label: 'Moderate explorations' },
            { value: 'challenging', label: 'High adventure' }
          ]}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={handleReset}>
          Clear filters
        </Button>
        <Button>
          Show tours
        </Button>
      </div>
    </Card>
  );
};

TourFilters.propTypes = {
  onFilter: PropTypes.func
};

export default TourFilters;
