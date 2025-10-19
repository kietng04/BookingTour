import React from 'react';
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div
    className={clsx(
      'animate-pulse rounded-lg bg-gray-100',
      "before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent before:content-['']",
      'relative overflow-hidden',
      className
    )}
  />
);

export default Skeleton;
