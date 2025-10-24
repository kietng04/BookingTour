import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4 md:px-8">
      <div>
        <h3 className="text-lg font-semibold text-primary-600">BookingTour Việt Nam</h3>
        <p className="mt-3 text-sm text-slate-600">
          Hệ thống tour chọn lọc khắp Việt Nam với dịch vụ tư vấn tận tâm. Khám phá trải nghiệm bản địa, lịch trình linh hoạt và hướng dẫn viên uy tín.
        </p>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Về BookingTour</h4>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          <li><Link to="/about">Giới thiệu</Link></li>
          <li><Link to="/blog">Nhật ký hành trình</Link></li>
          <li><Link to="/careers">Cơ hội nghề nghiệp</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Hỗ trợ</h4>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          <li><Link to="/support">Trung tâm trợ giúp</Link></li>
          <li><Link to="/cancellation">Chính sách huỷ tour</Link></li>
          <li><Link to="/contact">Liên hệ</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Kết nối</h4>
        <div className="mt-4 flex gap-3 text-slate-500">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
            <Youtube className="h-5 w-5" />
          </a>
        </div>
        <p className="mt-4 text-xs text-slate-400">© {new Date().getFullYear()} BookingTour Việt Nam. Bảo lưu mọi quyền.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
