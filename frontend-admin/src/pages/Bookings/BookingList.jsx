import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import BookingTable from '../../components/bookings/BookingTable.jsx';
import Card from '../../components/common/Card.jsx';
import Select from '../../components/common/Select.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { bookingsAPI, departuresAPI, exportAPI, toursAPI } from '../../services/api.js';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [tours, setTours] = useState([]);
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState('');
  const [selectedDeparture, setSelectedDeparture] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    if (selectedTour) {
      fetchDeparturesForTour(selectedTour);
    } else {
      setDepartures([]);
      setSelectedDeparture('');
    }
  }, [selectedTour]);

  useEffect(() => {
    fetchBookings();
  }, [selectedDeparture, selectedStatus, startDate, endDate]);

  const fetchTours = async () => {
    try {
      const data = await toursAPI.getAll();
      // API returns pagination object { content: [...], page: 0, ... }
      const toursArray = data?.content || data || [];
      setTours(toursArray);
    } catch (err) {
      console.error('Failed to fetch tours:', err);
    }
  };

  const fetchDeparturesForTour = async (tourId) => {
    try {
      const data = await departuresAPI.getAll();
      // API may return pagination object { content: [...], ... }
      const departuresArray = data?.content || data || [];
      // Filter departures by tourId
      const filtered = Array.isArray(departuresArray)
        ? departuresArray.filter((dep) => String(dep.tourId) === String(tourId))
        : [];
      setDepartures(filtered);
    } catch (err) {
      console.error('Failed to fetch departures:', err);
      setDepartures([]);
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
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
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
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
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
      </div>

      {/* Filters */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Bộ lọc</h3>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setSelectedTour('');
              setSelectedDeparture('');
              setSelectedStatus('');
              setStartDate('');
              setEndDate('');
            }}
          >
            Xóa bộ lọc
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {/* Step 1: Select Tour */}
          <Select
            label="Tên chuyến đi"
            value={selectedTour}
            onChange={(e) => {
              setSelectedTour(e.target.value);
              setSelectedDeparture('');
              setStartDate('');
              setEndDate('');
            }}
          >
            <option value="">Chọn chuyến đi</option>
            {(Array.isArray(tours) ? tours : []).map((tour) => {
              const id = tour.tourId || tour.id;
              return (
                <option key={id} value={id}>
                  {tour.tourName || tour.name || `Tour #${id}`}
                </option>
              );
            })}
          </Select>

          {/* Step 2: Select Date (only show if tour is selected) */}
          {selectedTour && (
            <Select
              label="Ngày khởi hành"
              value={selectedDeparture}
              onChange={(e) => setSelectedDeparture(e.target.value)}
            >
              <option value="">Tất cả ngày khởi hành</option>
              {departures.map((dep) => (
                <option key={dep.departureId} value={dep.departureId}>
                  {new Date(dep.startDate).toLocaleDateString('vi-VN')}
                </option>
              ))}
            </Select>
          )}

          <Select
            label="Trạng thái"
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

        {/* Optional: Date range filter (show when departure is selected) */}
        {selectedDeparture && (
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Lọc theo ngày đặt - Từ ngày"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <Input
              label="Đến ngày"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
            />
          </div>
        )}
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
