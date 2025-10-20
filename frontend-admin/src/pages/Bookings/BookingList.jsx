import { useState, useEffect } from 'react';
import BookingTable from '../../components/bookings/BookingTable.jsx';
import Card from '../../components/common/Card.jsx';
import Select from '../../components/common/Select.jsx';
import { bookingsAPI, departuresAPI } from '../../services/api.js';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeparture, setSelectedDeparture] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchDepartures();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [selectedDeparture, selectedStatus]);

  const fetchDepartures = async () => {
    try {
      const data = await departuresAPI.getAll();
      setDepartures(data);
    } catch (err) {
      console.error('Failed to fetch departures:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {};

      if (selectedDeparture) {
        params.departureId = selectedDeparture;
      }
      if (selectedStatus) {
        params.status = selectedStatus;
      }

      const data = await bookingsAPI.getAll(params);
      setBookings(data.content || data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Bookings</h1>
        <p className="text-sm text-slate-500">
          Track lifecycle states: pending → confirmed → completed. Aligns with backend `/admin/bookings` response.
        </p>
      </div>

      {/* Filters */}
      <Card className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Select
            label="Filter by Departure"
            value={selectedDeparture}
            onChange={(e) => setSelectedDeparture(e.target.value)}
          >
            <option value="">All Departures</option>
            {departures.map((dep) => (
              <option key={dep.departureId} value={dep.departureId}>
                {dep.tourName} - {new Date(dep.startDate).toLocaleDateString()}
              </option>
            ))}
          </Select>

          <Select
            label="Filter by Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </Select>
        </div>
      </Card>

      {loading ? (
        <Card className="text-center py-12">
          <p className="text-sm text-slate-500">Loading bookings...</p>
        </Card>
      ) : (
        <BookingTable bookings={bookings} />
      )}

      <Card className="space-y-3 bg-slate-900 text-slate-100">
        <h3 className="text-lg font-semibold">Operations checklist</h3>
        <ul className="space-y-2 text-sm text-slate-200">
          <li>• Confirm inventory with supplier and mark booking as `confirmed`.</li>
          <li>• Collect payment via secure invoice or on-platform gateway.</li>
          <li>• Trigger pre-trip email sequence at T-48 hours.</li>
        </ul>
      </Card>
    </div>
  );
};

export default BookingList;
