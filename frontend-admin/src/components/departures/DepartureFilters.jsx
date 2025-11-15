import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Select from '../common/Select';
import Input from '../common/Input';
import Button from '../common/Button';
import { toursAPI } from '../../services/api';

const DepartureFilters = ({ filters, onFiltersChange, onApply, onReset }) => {
  const [tours, setTours] = useState([]);
  const [loadingTours, setLoadingTours] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await toursAPI.getAll();
        const toursArray = data.content || data || [];
        // Normalize tour data to ensure tourId field exists
        const normalizedTours = toursArray.map(tour => ({
          ...tour,
          tourId: tour.id ?? tour.tourId,
          tourName: tour.tourName || tour.tour_name
        }));
        setTours(normalizedTours);
      } catch (error) {
        console.error('Failed to fetch tours:', error);
        setTours([]);
      } finally {
        setLoadingTours(false);
      }
    };
    fetchTours();
  }, []);

  const handleInputChange = (field, value) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const handleReset = () => {
    onReset();
  };

  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'CONCHO', label: 'Còn chỗ' },
    { value: 'SAPFULL', label: 'Sắp đầy' },
    { value: 'FULL', label: 'Đã đầy' },
    { value: 'DAKHOIHANH', label: 'Đã khởi hành' }
  ];

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Bộ lọc</h3>
        <button
          onClick={handleReset}
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tour Filter */}
        <div>
          <Select
            label="Tour"
            value={filters.tourId || ''}
            onChange={(e) => handleInputChange('tourId', e.target.value)}
            disabled={loadingTours}
          >
            <option value="">Tất cả tour</option>
            {tours.map((tour) => (
              <option key={tour.tourId} value={tour.tourId}>
                {tour.tourName}
              </option>
            ))}
          </Select>
        </div>

        {/* From Date */}
        <div>
          <Input
            label="Từ ngày"
            type="date"
            value={filters.fromDate || ''}
            onChange={(e) => handleInputChange('fromDate', e.target.value)}
          />
        </div>

        {/* To Date */}
        <div>
          <Input
            label="Đến ngày"
            type="date"
            value={filters.toDate || ''}
            onChange={(e) => handleInputChange('toDate', e.target.value)}
            min={filters.fromDate}
          />
        </div>

        {/* Status Filter */}
        <div>
          <Select
            label="Trạng thái"
            value={filters.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Apply Button */}
      <div className="mt-4 flex justify-end">
        <Button onClick={onApply}>
          Áp dụng bộ lọc
        </Button>
      </div>

      {/* Active Filters Summary */}
      {(filters.tourId || filters.fromDate || filters.toDate || filters.status) && (
        <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
          <span className="text-sm text-slate-600">Bộ lọc đang áp dụng:</span>
          {filters.tourId && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
              Tour: {tours.find(t => t.tourId === parseInt(filters.tourId))?.tourName || filters.tourId}
              <button
                onClick={() => handleInputChange('tourId', '')}
                className="ml-1 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}
          {filters.fromDate && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
              Từ: {filters.fromDate}
              <button
                onClick={() => handleInputChange('fromDate', '')}
                className="ml-1 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}
          {filters.toDate && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
              Đến: {filters.toDate}
              <button
                onClick={() => handleInputChange('toDate', '')}
                className="ml-1 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
              Trạng thái: {statusOptions.find(s => s.value === filters.status)?.label}
              <button
                onClick={() => handleInputChange('status', '')}
                className="ml-1 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </Card>
  );
};

export default DepartureFilters;
