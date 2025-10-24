import { useMemo, useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import SectionTitle from '../components/common/SectionTitle.jsx';
import BookingForm from '../components/booking/BookingForm.jsx';
import BookingSummary from '../components/booking/BookingSummary.jsx';
import BookingTimeline from '../components/booking/BookingTimeline.jsx';
import { tours } from '../data/mockTours.js';
import { toursAPI } from '../services/api.js';

const Booking = () => {
  const { tourId } = useParams();
  const [searchParams] = useSearchParams();
  const departureId = searchParams.get('departureId');

  const [snapshot, setSnapshot] = useState({ guests: '2', date: '' });
  const [departure, setDeparture] = useState(null);
  const [loadingDeparture, setLoadingDeparture] = useState(!!departureId);

  const tour = useMemo(() => tours.find((item) => item.id === tourId), [tourId]);

  useEffect(() => {
    if (!departureId || !tourId) return;

    const fetchDeparture = async () => {
      try {
        setLoadingDeparture(true);
        const departures = await toursAPI.getDepartures(tourId);
        const selected = departures.find(d => d.departureId === parseInt(departureId));
        setDeparture(selected);

        if (selected) {
          setSnapshot(prev => ({ ...prev, date: selected.startDate }));
        }
      } catch (error) {
        console.error('Failed to load departure:', error);
      } finally {
        setLoadingDeparture(false);
      }
    };

    fetchDeparture();
  }, [departureId, tourId]);

  if (!tour) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-sm text-slate-500">Không tìm thấy tour bạn yêu cầu.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-14 md:px-8">
      <SectionTitle
        eyebrow="Giữ chỗ chuyến đi"
        title={`Hoàn tất đặt chỗ tour ${tour.name}`}
        description="Khi gửi biểu mẫu, hệ thống gọi endpoint `POST /bookings` của backend. Giá, chính sách và metadata được điền sẵn để bước thanh toán diễn ra nhanh gọn."
      />

      {departure && (
        <div className="rounded-2xl bg-primary-50 border border-primary-200 p-4">
          <h3 className="text-sm font-semibold text-primary-900">Lịch khởi hành đã chọn</h3>
          <p className="mt-1 text-sm text-primary-700">
            {new Date(departure.startDate).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
            {' - '}
            {new Date(departure.endDate).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <p className="mt-1 text-xs text-primary-600">
            Còn {departure.remainingSlots} chỗ
          </p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-8">
          <BookingForm
            tour={tour}
            departure={departure}
            departureId={departureId}
            onSubmit={(formValues) => setSnapshot({ guests: formValues.guests, date: formValues.date })}
          />
          <BookingTimeline
            steps={[
              {
                label: 'Đã gửi yêu cầu',
                description: 'Tạo booking trạng thái `pending` trên backend, đội concierge nhận thông báo ngay.',
                timestamp: new Date().toISOString(),
                completed: true
              },
              {
                label: 'Concierge xác nhận',
                description: 'Kiểm tra chỗ, xử lý nâng hạng, ghi nhận yêu cầu đặc biệt trước khi chuyển trạng thái confirmed.'
              },
              {
                label: 'Thanh toán & hồ sơ',
                description: 'Gửi link thanh toán an toàn, biểu mẫu thông tin khách và gợi ý bảo hiểm tự động.'
              },
              {
                label: 'Chăm sóc trước khởi hành',
                description: 'Gọi nhắc 48 giờ trước chuyến đi, xác nhận đưa đón và kết nối host địa phương.'
              }
            ]}
          />
        </div>
        <BookingSummary tour={tour} guests={snapshot.guests} date={snapshot.date} />
      </div>
    </div>
  );
};

export default Booking;
