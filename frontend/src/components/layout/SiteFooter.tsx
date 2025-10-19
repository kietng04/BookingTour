import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const footerLinks = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Privacy', href: '#' },
    ],
  },
  {
    title: 'Discover',
    links: [
      { label: 'Destinations', href: '#destinations' },
      { label: 'Seasonal offers', href: '#offers' },
      { label: 'Travel guides', href: '#guides' },
      { label: 'Gift cards', href: '#gifts' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help center', href: '#support' },
      { label: 'Contact', href: '#contact' },
      { label: 'Travel advisories', href: '#advisories' },
      { label: 'Travel insurance', href: '#insurance' },
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
            Boutique European journeys designed by local experts. Modern experiences, timeless memories.
          </p>
          <div className="flex items-center gap-3">
            <SocialIcon href="https://facebook.com" label="Visit our Facebook page" icon={Facebook} />
            <SocialIcon href="https://instagram.com" label="Visit our Instagram profile" icon={Instagram} />
            <SocialIcon href="https://twitter.com" label="Visit our Twitter profile" icon={Twitter} />
            <SocialIcon href="https://linkedin.com" label="Visit our LinkedIn profile" icon={Linkedin} />
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
        <p>© {new Date().getFullYear()} BookingTour. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
