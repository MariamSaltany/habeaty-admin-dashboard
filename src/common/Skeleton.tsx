import React from 'react';
import type { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rectangular', ...props }) => {
  const baseClasses = "animate-pulse bg-slate-200";
  const variantClasses = {
    text: "rounded h-4",
    rectangular: "rounded-lg",
    circular: "rounded-full"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props} />
  );
};