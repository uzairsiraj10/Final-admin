
import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerCardProps {
  className?: string;
}

export const ShimmerCard: React.FC<ShimmerCardProps> = ({ className }) => {
  return (
    <div className={cn("animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden", className)}>
      <div className="h-32 bg-gray-300 dark:bg-gray-600 shimmer"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded shimmer w-3/4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded shimmer w-1/2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded shimmer w-5/6"></div>
      </div>
    </div>
  );
};
