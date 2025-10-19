import React, { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface TourGalleryProps {
  images: string[];
  alt: string;
}

const TourGallery: React.FC<TourGalleryProps> = ({ images, alt }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return null;
  }

  return (
    <section aria-label="Tour image gallery" className="space-y-4">
      <motion.div
        layout
        className="relative overflow-hidden rounded-3xl bg-gray-100 shadow-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={images[activeIndex]}
          alt={alt}
          className="h-[420px] w-full object-cover"
          loading={activeIndex === 0 ? 'eager' : 'lazy'}
        />
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/10" />
      </motion.div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={clsx(
                'relative overflow-hidden rounded-2xl border transition focus-visible:ring-2 focus-visible:ring-brand-400',
                activeIndex === index
                  ? 'border-brand-400'
                  : 'border-transparent hover:border-brand-200'
              )}
              aria-label={`View gallery image ${index + 1}`}
              aria-current={activeIndex === index}
            >
              <img
                src={image}
                alt=""
                loading="lazy"
                className={clsx(
                  'h-24 w-full object-cover transition duration-300',
                  activeIndex === index ? 'scale-105' : 'opacity-80 group-hover:opacity-100'
                )}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default TourGallery;
