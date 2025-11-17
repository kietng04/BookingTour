import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Card from '../common/Card.jsx';

/**
 * Sync schedules with target days:
 * - If more days needed: add empty schedules
 * - If fewer days: keep existing schedules up to target
 */
const syncSchedulesWithDays = (existingSchedules, targetDays) => {
  const currentLength = existingSchedules.length;

  // Already matches
  if (currentLength === targetDays) {
    return existingSchedules;
  }

  // Need to add more schedules
  if (currentLength < targetDays) {
    const additional = Array.from(
      { length: targetDays - currentLength },
      (_, i) => ({
        dayNumber: currentLength + i + 1,
        scheduleDescription: ''
      })
    );
    return [...existingSchedules, ...additional];
  }

  // Need to remove schedules (keep first N)
  return existingSchedules.slice(0, targetDays);
};

const TourSchedules = ({ days, initialSchedules = [], onChange, disabled = false }) => {
  const [schedules, setSchedules] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // Initialize schedules only once when component mounts or when days changes
  useEffect(() => {
    if (days && days > 0) {
      if (!initialized && initialSchedules && initialSchedules.length > 0) {
        // First time: use initial schedules
        const synced = syncSchedulesWithDays(initialSchedules, days);
        setSchedules(synced);
        setInitialized(true);
      } else if (initialized || (initialSchedules.length === 0)) {
        // Already initialized or no initial data: sync with days count
        setSchedules(prev => {
          // If we already have schedules, sync them with new days count
          if (prev.length > 0) {
            return syncSchedulesWithDays(prev, days);
          }
          // Otherwise create new empty schedules
          return Array.from({ length: days }, (_, index) => ({
            dayNumber: index + 1,
            scheduleDescription: ''
          }));
        });
        setInitialized(true);
      }
    } else {
      setSchedules([]);
      setInitialized(false);
    }
  }, [days]); // Only depend on days, not initialSchedules

  // Handle initial schedules (for edit mode) - run only once
  useEffect(() => {
    if (!initialized && initialSchedules && initialSchedules.length > 0 && days > 0) {
      const synced = syncSchedulesWithDays(initialSchedules, days);
      setSchedules(synced);
      setInitialized(true);
    }
  }, []); // Run only once on mount

  // Notify parent when schedules change
  useEffect(() => {
    onChange(schedules);
  }, [schedules, onChange]);

  const handleDescriptionChange = (dayNumber, value) => {
    setSchedules(prev => prev.map(schedule =>
      schedule.dayNumber === dayNumber
        ? { ...schedule, scheduleDescription: value }
        : schedule
    ));
  };

  if (!days || days <= 0) {
    return (
      <Card className="p-6">
        <p className="text-sm text-slate-500">
          Vui lòng nhập số ngày của tour trước để tạo lịch trình
        </p>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Lịch trình theo ngày</h3>
          <p className="text-sm text-slate-500">Mô tả chi tiết hoạt động cho từng ngày trong tour</p>
        </div>
      </div>

      <div className="space-y-4">
        {schedules.map((schedule, index) => (
          <div key={schedule.dayNumber} className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Ngày {schedule.dayNumber}
            </label>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-slate-50 disabled:text-slate-500"
              rows={3}
              placeholder={`Mô tả lịch trình ngày ${schedule.dayNumber}...`}
              value={schedule.scheduleDescription}
              onChange={(e) => handleDescriptionChange(schedule.dayNumber, e.target.value)}
              disabled={disabled}
            />
          </div>
        ))}
      </div>

      {schedules.length === 0 && (
        <p className="text-sm text-slate-500">Không có lịch trình nào</p>
      )}
    </Card>
  );
};

TourSchedules.propTypes = {
  days: PropTypes.number,
  initialSchedules: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    dayNumber: PropTypes.number,
    scheduleDescription: PropTypes.string
  })),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default TourSchedules;
