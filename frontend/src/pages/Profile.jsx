import { Link } from 'react-router-dom';
import { CalendarDays, Crown, LogOut, PenSquare } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle.jsx';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import { currentUser } from '../data/mockUsers.js';
import { bookingHistory } from '../data/mockBookings.js';
import { formatCurrency, formatDate } from '../utils/format.js';

const Profile = () => (
  <div className="mx-auto max-w-6xl space-y-12 px-4 py-14 md:px-8">
    <SectionTitle
      eyebrow="Hồ sơ khách hàng"
      title={`Chào mừng trở lại, ${currentUser.name.split(' ')[0]}`}
      description="Hồ sơ lấy dữ liệu từ endpoint `/users/me` và `/bookings?userId=`. Dễ dàng mở rộng với hạng hội viên, phương thức thanh toán và tour đã lưu."
    />

    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <Card className="space-y-6">
        <div className="flex items-center gap-4">
          <img src={currentUser.avatar} alt={currentUser.name} className="h-16 w-16 rounded-full object-cover" />
          <div>
            <p className="text-lg font-semibold text-slate-900">{currentUser.name}</p>
            <p className="text-sm text-slate-500">{currentUser.email}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-primary-50 p-4 text-sm text-primary-600">
          <p className="flex items-center gap-2 font-medium">
            <Crown className="h-4 w-4" />
            {currentUser.tier}
          </p>
          <p className="text-xs text-primary-400">Nhận nhân đôi điểm thưởng khi đặt khách sạn boutique.</p>
        </div>
        <div className="space-y-4 text-sm text-slate-600">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Phong cách du lịch</p>
            <p>{currentUser.preferences.style}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Khu vực yêu thích</p>
            <p>{currentUser.preferences.region}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Nhịp độ ưa thích</p>
            <p>{currentUser.preferences.pace}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Button variant="secondary" to="/profile/edit">
            <PenSquare className="h-4 w-4" />
            Cập nhật hồ sơ
          </Button>
          <Button variant="ghost">
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Chuyến đi sắp tới</h3>
            <Link to="/bookings" className="text-sm font-semibold text-primary-500">Xem tất cả</Link>
          </div>

          {bookingHistory
            .filter((booking) => booking.status === 'upcoming')
            .map((booking) => (
              <div key={booking.id} className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-slate-50/70 p-4 md:flex-row">
                <img src={booking.image} alt={booking.tourName} className="h-32 w-full rounded-2xl object-cover md:w-40" />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-primary-500">
                      {booking.status === 'upcoming' ? 'SẮP KHỞI HÀNH' : booking.status}
                    </p>
                    <h4 className="mt-1 text-lg font-semibold text-slate-900">{booking.tourName}</h4>
                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(booking.startDate)} – {formatDate(booking.endDate)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{booking.guests} khách</span>
                    <span className="font-semibold text-primary-600">{formatCurrency(booking.amount)}</span>
                  </div>
                </div>
              </div>
            ))}
        </Card>

        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Hành trình đã hoàn thành</h3>
          <div className="space-y-3">
            {bookingHistory
              .filter((booking) => booking.status === 'completed')
              .map((booking) => (
                <div key={booking.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm text-slate-600">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-primary-400">Đã hoàn thành</p>
                    <p className="font-medium text-slate-800">{booking.tourName}</p>
                    <p className="text-xs text-slate-400">{formatDate(booking.startDate)} · {booking.guests} khách</p>
                  </div>
          <Button to={`/tours/${booking.tourId}`} variant="ghost" size="sm">
            Xem chi tiết tour
          </Button>
        </div>
      ))}
          </div>
        </Card>
      </div>
    </div>
  </div>
);

export default Profile;
