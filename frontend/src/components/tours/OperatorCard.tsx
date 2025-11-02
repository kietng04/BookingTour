import React from 'react';
import { ShieldCheck, Award, Star } from 'lucide-react';

interface OperatorCardProps {
  operator: {
    name: string;
    avatar: string;
    rating: number;
    tourCount: number;
    responseTime: string;
    founded: string;
    certifications: string[];
  };
}

const OperatorCard: React.FC<OperatorCardProps> = ({ operator }) => (
  <section
    aria-label="Thông tin đơn vị tổ chức"
    className="rounded-3xl border border-gray-100 bg-white shadow-card"
  >
    <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
      <img
        src={operator.avatar}
        alt={`Đơn vị tổ chức ${operator.name}`}
        loading="lazy"
        className="h-16 w-16 rounded-full object-cover shadow-inner"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{operator.name}</h3>
        <p className="mt-1 text-sm text-gray-500">
          Đối tác uy tín từ năm {operator.founded} · Hơn {operator.tourCount}+ hành trình được thiết kế riêng
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span className="inline-flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" aria-hidden="true" />
            {operator.rating.toFixed(2)} điểm hài lòng
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-500" aria-hidden="true" />
            Phản hồi trong {operator.responseTime}
          </span>
        </div>
      </div>
      <div className="space-y-2 text-xs font-medium uppercase tracking-wide text-gray-500">
        {operator.certifications.map((cert) => (
          <span
            key={cert}
            className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600"
          >
            <Award className="h-4 w-4 text-brand-500" aria-hidden="true" />
            {cert}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default OperatorCard;
