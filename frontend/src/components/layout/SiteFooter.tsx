import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const footerLinks = [
  {
    title: 'Về chúng tôi',
    links: [
      { label: 'Giới thiệu BookingTour', href: '#' },
      { label: 'Báo chí', href: '#' },
      { label: 'Tuyển dụng', href: '#' },
      { label: 'Chính sách bảo mật', href: '#' },
    ],
  },
  {
    title: 'Khám phá',
    links: [
      { label: 'Điểm đến nổi bật', href: '#destinations' },
      { label: 'Ưu đãi theo mùa', href: '#offers' },
      { label: 'Cẩm nang du lịch', href: '#guides' },
      { label: 'Quà tặng du lịch', href: '#gifts' },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { label: 'Trung tâm trợ giúp', href: '#support' },
      { label: 'Liên hệ tư vấn', href: '#contact' },
      { label: 'Thông tin lưu ý', href: '#advisories' },
      { label: 'Bảo hiểm du lịch', href: '#insurance' },
    ],
  },
];

const SocialIcon = ({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) => (
  <a
    href={href}
    aria-label={label}
    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-brand-200 hover:text-brand-500 focus-visible:border-brand-300 focus-visible:text-brand-500"
    target="_blank"
    rel="noreferrer"
  >
    <Icon className="h-4 w-4" aria-hidden="true" />
  </a>
);

const SiteFooter: React.FC = () => (
  <footer className="border-t border-gray-100 bg-gray-25">
    <div className="container py-16">
      <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))]">
        <div className="space-y-6">
          <a href="/" className="flex items-center gap-3 text-lg font-semibold text-gray-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white shadow-card">
              BT
            </span>
            BookingTour
          </a>
          <p className="text-sm text-gray-600">
            Chọn lọc những hành trình châu Âu đặc sắc được xây dựng bởi chuyên gia bản địa. Trải nghiệm đẳng cấp, kỷ niệm trọn vẹn.
          </p>
          <div className="flex items-center gap-3">
            <SocialIcon href="https://facebook.com" label="Theo dõi BookingTour trên Facebook" icon={Facebook} />
            <SocialIcon href="https://instagram.com" label="Theo dõi BookingTour trên Instagram" icon={Instagram} />
            <SocialIcon href="https://twitter.com" label="Theo dõi BookingTour trên Twitter" icon={Twitter} />
            <SocialIcon href="https://linkedin.com" label="Theo dõi BookingTour trên LinkedIn" icon={Linkedin} />
          </div>
        </div>
        {footerLinks.map((section) => (
          <div key={section.title} className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              {section.title}
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              {section.links.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="transition hover:text-gray-900 focus-visible:text-gray-900"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 border-t border-gray-100 pt-6 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} BookingTour. Bản quyền thuộc về công ty.</p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
