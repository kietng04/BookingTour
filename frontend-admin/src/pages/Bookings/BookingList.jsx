import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import BookingTable from '../../components/bookings/BookingTable.jsx';
import Card from '../../components/common/Card.jsx';
import Select from '../../components/common/Select.jsx';
import Button from '../../components/common/Button.jsx';
import { bookingsAPI, departuresAPI, exportAPI } from '../../services/api.js';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeparture, setSelectedDeparture] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [exporting, setExporting] = useState(false);

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
      const bookingsData = data.content || data || [];

      // Transform bookings to ensure consistent field names
      const transformedBookings = (Array.isArray(bookingsData) ? bookingsData : []).map(booking => ({
        id: booking.id || booking.bookingId,
        guestName: booking.guestName || booking.guest_name || `Guest #${booking.userId || '?'}`,
        tourName: booking.tourName || booking.tour_name || `Tour #${booking.tourId || '?'}`,
        travelDate: booking.travelDate || booking.travel_date || booking.departureDate || booking.departure_date || booking.createdAt,
        guests: booking.guests || booking.guest_count || booking.guestCount || 0,
        amount: booking.amount || booking.totalAmount || booking.total_amount || 0,
        status: booking.status || 'PENDING',
        assignedTo: booking.assignedTo || booking.assigned_to || '—'
      }));

      setBookings(transformedBookings);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportToExcel = async () => {
    try {
      setExporting(true);
      const params = {};

      if (selectedDeparture) {
        params.departureId = selectedDeparture;
      }
      if (selectedStatus) {
        params.status = selectedStatus;
      }

      await exportAPI.downloadBookingsExcel(params);
      alert('Bookings exported successfully!');
    } catch (err) {
      console.error('Failed to export bookings:', err);
      alert('Failed to export bookings. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Danh sách đặt chỗ</h1>
        <p className="text-sm text-slate-500">
          Theo dõi các trạng thái: chờ xử lý → đã xác nhận → hoàn tất. Tương ứng với endpoint `/admin/bookings`.
        </p>
      </div>

      {/* Filters */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Bộ lọc</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportToExcel}
            disabled={exporting || loading || bookings.length === 0}
          >
            <Download className="h-4 w-4" />
            {exporting ? 'Đang xuất...' : 'Xuất Excel'}
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Select
            label="Lọc theo chuyến đi"
            value={selectedDeparture}
            onChange={(e) => setSelectedDeparture(e.target.value)}
          >
            <option value="">Tất cả chuyến đi</option>
            {departures.map((dep) => (
              <option key={dep.departureId} value={dep.departureId}>
                {dep.tourName} - {new Date(dep.startDate).toLocaleDateString()}
              </option>
            ))}
          </Select>

          <Select
            label="Lọc theo trạng thái"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="CANCELLED">Đã hủy</option>
            <option value="FAILED">Thất bại</option>
          </Select>
        </div>
      </Card>

      {loading ? (
        <Card className="text-center py-12">
          <p className="text-sm text-slate-500">Đang tải danh sách đặt chỗ...</p>
        </Card>
      ) : (
        <BookingTable bookings={bookings} onRefresh={fetchBookings} />
      )}

      <Card className="space-y-3 bg-slate-900 text-slate-100">
        <h3 className="text-lg font-semibold">Quy trình xử lý</h3>
        <ul className="space-y-2 text-sm text-slate-200">
          <li>• Xác nhận tồn kho với nhà cung cấp và đánh dấu đặt chỗ là "đã xác nhận".</li>
          <li>• Thu thanh toán qua hóa đơn an toàn hoặc cổng thanh toán trực tuyến.</li>
          <li>• Gửi email nhắc nhở trước chuyến đi 48 giờ.</li>
        </ul>
      </Card>
    </div>
  );
};

export default BookingList;
