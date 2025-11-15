import { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import Button from '../common/Button';

const DateRangeFilter = ({ onDateRangeChange }) => {
  const [selectedPreset, setSelectedPreset] = useState('thismonth');
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const getDateRange = (preset) => {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    let startDate;

    switch (preset) {
      case 'today':
        startDate = endDate;
        break;
      case 'thismonth':
        startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
        break;
      default:
        startDate = endDate;
    }

    return { startDate, endDate };
  };

  const handlePresetClick = (preset) => {
    setSelectedPreset(preset);
    setShowCustom(false);
    const { startDate, endDate } = getDateRange(preset);
    onDateRangeChange({ startDate, endDate });
  };

  const handleCustomClick = () => {
    setShowCustom(true);
    setSelectedPreset('custom');
  };

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      onDateRangeChange({ startDate: customStart, endDate: customEnd });
    }
  };

  const handleCustomReset = () => {
    setCustomStart('');
    setCustomEnd('');
    setShowCustom(false);
    setSelectedPreset('thismonth');
    const { startDate, endDate } = getDateRange('thismonth');
    onDateRangeChange({ startDate, endDate });
  };

  const presets = [
    { id: 'today', label: 'Hôm nay' },
    { id: 'thismonth', label: 'Tháng này' },
  ];

  return (
    <Card padding="p-4">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Khoảng thời gian</h3>
          <p className="text-xs text-slate-500 mt-1">Lọc dữ liệu bảng điều khiển theo khoảng thời gian</p>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.id}
              size="sm"
              variant={selectedPreset === preset.id ? 'primary' : 'secondary'}
              onClick={() => handlePresetClick(preset.id)}
            >
              {preset.label}
            </Button>
          ))}
          <Button
            size="sm"
            variant={selectedPreset === 'custom' ? 'primary' : 'secondary'}
            onClick={handleCustomClick}
          >
            Tùy chỉnh
          </Button>
        </div>

        {/* Custom Date Range Inputs */}
        {showCustom && (
          <div className="space-y-3 pt-2 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  min={customStart}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleCustomApply}
                disabled={!customStart || !customEnd}
              >
                Áp dụng
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleCustomReset}
              >
                Đặt lại
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

DateRangeFilter.propTypes = {
  onDateRangeChange: PropTypes.func.isRequired,
};

export default DateRangeFilter;
