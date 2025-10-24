import PropTypes from 'prop-types';
import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import Card from '../common/Card.jsx';
import Button from '../common/Button.jsx';
import InputField from '../common/InputField.jsx';
import SelectField from '../common/SelectField.jsx';

const sortOptions = [
  { value: 'popular', label: 'Phổ biến nhất' },
  { value: 'price-low', label: 'Giá: Thấp đến cao' },
  { value: 'price-high', label: 'Giá: Cao đến thấp' },
  { value: 'duration', label: 'Lịch trình dài ngày' }
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
          <h3 className="text-lg font-semibold text-slate-900">Tùy chỉnh hành trình</h3>
          <p className="text-sm text-slate-500">Bộ lọc đồng bộ với tham số API giúp tích hợp backend mượt mà.</p>
        </div>
      </div>

      <InputField
        label="Tìm tour"
        placeholder="Nhập điểm đến: Hà Giang, Phú Quốc..."
        value={filters.search}
        onChange={(event) => handleChange('search', event.target.value)}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Điểm đến"
          placeholder="Tất cả điểm đến"
          value={filters.destination}
          onChange={(event) => handleChange('destination', event.target.value)}
        />
        <SelectField
          label="Sắp xếp"
          value={filters.sortBy || 'popular'}
          onChange={(event) => handleChange('sortBy', event.target.value)}
          options={sortOptions}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label="Ngân sách"
          value={filters.priceRange}
          onChange={(event) => handleChange('priceRange', event.target.value)}
          options={[
            { value: 'any', label: 'Tất cả' },
            { value: 'under-5000000', label: 'Dưới 5.000.000đ' },
            { value: '5000000-9000000', label: '5.000.000đ - 9.000.000đ' },
            { value: '9000000+', label: 'Trên 9.000.000đ' }
          ]}
        />
        <SelectField
          label="Phong cách"
          value={filters.difficulty}
          onChange={(event) => handleChange('difficulty', event.target.value)}
          options={[
            { value: 'any', label: 'Mọi phong cách' },
            { value: 'easy', label: 'Thư giãn' },
            { value: 'moderate', label: 'Khám phá nhẹ nhàng' },
            { value: 'adventure', label: 'Phiêu lưu' }
          ]}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={handleReset}>
          Xoá bộ lọc
        </Button>
        <Button>
          Hiển thị tour
        </Button>
      </div>
    </Card>
  );
};

TourFilters.propTypes = {
  onFilter: PropTypes.func
};

export default TourFilters;
