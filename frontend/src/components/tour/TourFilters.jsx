import PropTypes from 'prop-types';
import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import Card from '../common/Card.jsx';
import Button from '../common/Button.jsx';
import InputField from '../common/InputField.jsx';
import SelectField from '../common/SelectField.jsx';

const sortOptions = [
  { value: 'popular', label: 'Ph�� bi���n nh���t' },
  { value: 'price-low', label: 'GiA�: Th���p �`���n cao' },
  { value: 'price-high', label: 'GiA�: Cao �`���n th���p' },
  { value: 'duration', label: 'L��<ch trA�nh dA�i ngA�y' }
];

const defaultFilters = {
  search: '',
  destination: '',
  priceRange: 'any',
  difficulty: 'any',
  regionId: '',
  provinceId: '',
  sortBy: 'popular',
};

const TourFilters = ({ onFilter, regions = [], provinces = [] }) => {
  const [filters, setFilters] = useState(() => ({ ...defaultFilters }));

  const handleChange = (field, value) => {
    const next = {
      ...filters,
      [field]: value,
    };

    if (field === 'regionId') {
      next.provinceId = '';
    }

    setFilters(next);
    onFilter?.(next);
  };

  const handleReset = () => {
    const resetFilters = { ...defaultFilters };
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
          <h3 className="text-lg font-semibold text-slate-900">TA1y ch��%nh hA�nh trA�nh</h3>
          <p className="text-sm text-slate-500">
            B��T l��?c �`��"ng b��T v��>i tham s��` API giA�p tA-ch h���p backend m�����t mA�.
          </p>
        </div>
      </div>

      <InputField
        label="TA�m tour"
        placeholder="Nh��-p �`i���m �`���n: HA� Giang, PhA� Qu��`c..."
        value={filters.search}
        onChange={(event) => handleChange('search', event.target.value)}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="�?i���m �`���n"
          placeholder="T���t c��� �`i���m �`���n"
          value={filters.destination}
          onChange={(event) => handleChange('destination', event.target.value)}
        />
        <SelectField
          label="S��_p x���p"
          value={filters.sortBy || 'popular'}
          onChange={(event) => handleChange('sortBy', event.target.value)}
          options={sortOptions}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label="NgA�n sA�ch"
          value={filters.priceRange}
          onChange={(event) => handleChange('priceRange', event.target.value)}
          options={[
            { value: 'any', label: 'T���t c���' },
            { value: 'under-5000000', label: 'D����>i 5.000.000�`' },
            { value: '5000000-9000000', label: '5.000.000�` - 9.000.000�`' },
            { value: '9000000+', label: 'TrA�n 9.000.000�`' },
          ]}
        />
        <SelectField
          label="VA1ng"
          value={filters.regionId}
          onChange={(event) => handleChange('regionId', event.target.value)}
          options={[
            { value: '', label: 'T���t c���' },
            ...regions.map((region) => ({
              value: region.id,
              label: region.name,
            })),
          ]}
        />
        <SelectField
          label="T��%nh/ThA�nh"
          value={filters.provinceId}
          onChange={(event) => handleChange('provinceId', event.target.value)}
          options={[
            { value: '', label: 'T���t c���' },
            ...provinces.map((province) => ({
              value: province.id,
              label: province.name,
            })),
          ]}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={handleReset}>
          XoA� b��T l��?c
        </Button>
        <Button>Hi���n th��< tour</Button>
      </div>
    </Card>
  );
};

TourFilters.propTypes = {
  onFilter: PropTypes.func,
  regions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  provinces: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      regionId: PropTypes.string,
    })
  ),
};

export default TourFilters;
