import React from 'react';
import { Users, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gray-900 text-white shadow-card lg:h-[520px]">
      <img
        src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=2000&q=80"
        alt="Travelers overlooking a scenic European city"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gray-900/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/30 to-gray-900/40" />
      <div className="relative z-10 px-6 pb-16 pt-16 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur">
            Tuyển chọn bởi chuyên gia bản địa
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Khám phá những trải nghiệm Việt Nam được yêu thích nhất.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80 sm:text-xl">
            Lịch trình linh hoạt, hướng dẫn viên đáng tin cậy và quyền lợi độc quyền dành cho thành viên. An tâm lên kế hoạch cho hành trình tiếp theo ngay hôm nay.
          </p>
          <dl className="mt-6 flex flex-wrap gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-200" aria-hidden="true" />
              <div>
                <dt className="font-medium text-white">Thanh toán an toàn</dt>
                <dd>Bảo mật theo chuẩn ngân hàng châu Âu</dd>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-brand-200" aria-hidden="true" />
              <div>
                <dt className="font-medium text-white">Được tín nhiệm</dt>
                <dd>98% đánh giá 5 sao từ du khách</dd>
              </div>
            </div>
          </dl>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
