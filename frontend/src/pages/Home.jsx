import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle.jsx';
import Button from '../components/common/Button.jsx';
import TourGrid from '../components/tour/TourGrid.jsx';
import Card from '../components/common/Card.jsx';
import { featuredTours, curatedCollections } from '../data/mockTours.js';

const Home = () => (
  <div className="space-y-20 pb-24">
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(58,107,255,0.45),_transparent_60%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 py-24 md:px-8 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-primary-100">
            <Sparkles className="h-4 w-4" />
            Hành trình đặc tuyển khắp Việt Nam
          </div>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Trải nghiệm Việt Nam cùng chuyên gia du lịch bản địa
          </h1>
          <p className="max-w-xl text-lg text-slate-200">
            BookingTour Việt Nam giúp bạn biến kế hoạch di chuyển phức tạp thành chuyến đi trọn vẹn. Đặt tour linh hoạt, tận hưởng dịch vụ chuẩn concierge và cảm nhận bản sắc Việt ở từng điểm đến.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button to="/tours" size="lg">
              Khám phá tour
            </Button>
            <Button to="/profile" variant="secondary" size="lg">
              Quản lý đặt chỗ của tôi
            </Button>
          </div>
        </div>
        <div className="relative hidden flex-1 lg:block">
          <div className="floating-card absolute right-10 top-10 rounded-3xl bg-white/10 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-widest text-primary-100">Chỗ trống cập nhật liên tục</p>
            <p className="text-3xl font-semibold text-white">24 tour mở bán</p>
            <p className="text-sm text-slate-200">Đánh giá trung bình 4,9/5</p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80"
            alt="Hero landscape"
            className="ml-auto h-[480px] w-[540px] rounded-[36px] object-cover shadow-2xl"
          />
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 md:px-8">
      <SectionTitle
        eyebrow="Vì sao chọn BookingTour Việt Nam"
        title="Đồng hành bởi đội ngũ concierge bản địa"
        description="Hệ thống được thiết kế đồng bộ với backend: quyền lợi hội viên, hạng thành viên và đối tác uy tín được hiển thị rõ ràng giúp bạn yên tâm đặt dịch vụ."
      />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          {
            icon: Compass,
            title: 'Lịch trình tuỳ biến',
            body: 'Mỗi tour đều có module linh hoạt, tương thích phụ thu backend: dễ dàng đổi hoạt động, thêm trải nghiệm hoặc kéo dài đêm nghỉ.'
          },
          {
            icon: ShieldCheck,
            title: 'Thanh toán an toàn',
            body: 'Luồng đặt cọc – giữ chỗ – xác nhận khớp hoàn toàn với trạng thái booking backend, sẵn sàng tích hợp ví MoMo, VNPAY hoặc Stripe.'
          },
          {
            icon: Heart,
            title: 'Đối tác đã thẩm định',
            body: 'Đồng bộ với hệ thống kiểm duyệt đánh giá. Huy hiệu "Khách đã xác thực" hay "Đối tác địa phương" được hiển thị minh bạch.'
          }
        ].map((feature) => (
          <Card key={feature.title} className="space-y-4 border-slate-100">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-500">
              <feature.icon className="h-5 w-5" />
            </span>
            <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
            <p className="text-sm text-slate-500">{feature.body}</p>
          </Card>
        ))}
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 md:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <SectionTitle
          eyebrow="Nổi bật trong tháng"
          title="Những hành trình được săn đón nhất"
          description="Liên kết trực tiếp với thuộc tính featured trên backend. Phù hợp để chạy chiến dịch truyền thông hoặc đẩy mạnh tour chuyển đổi cao."
        />
        <Button variant="secondary" to="/tours">
          Xem tất cả tour
        </Button>
      </div>
      <div className="mt-10">
        <TourGrid tours={featuredTours} />
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 md:px-8">
      <SectionTitle
        eyebrow="Bộ sưu tập tuyển chọn"
        title="Nhiều góc nhìn để khám phá Việt Nam"
        description="Các collection được map với danh mục backend, giúp đội marketing tạo chương trình theo vùng miền mà không cần chỉnh code."
        align="center"
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {curatedCollections.map((collection) => (
          <Card key={collection.id} className="space-y-6 border-slate-200 bg-white/80 p-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-primary-500">Chủ đề nổi bật</p>
              <h3 className="text-2xl font-semibold text-slate-900">{collection.title}</h3>
              <p className="text-sm text-slate-500">{collection.description}</p>
            </div>
            <div className="flex gap-5">
              {collection.tours.slice(0, 3).map((tour) => (
                <Link key={tour.id} to={`/tours/${tour.id}`} className="group relative block flex-1 overflow-hidden rounded-3xl">
                  <img src={tour.thumbnail} alt={tour.name} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-sm font-semibold text-white">{tour.name}</p>
                    <p className="text-xs text-slate-200">{tour.destination}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link to={`/collections/${collection.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500">
              Khám phá bộ sưu tập
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        ))}
      </div>
    </section>
  </div>
);

export default Home;
