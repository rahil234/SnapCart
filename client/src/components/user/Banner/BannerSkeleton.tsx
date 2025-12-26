import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const BannerSkeleton = () => {
  return (
    <div className="flex gap-2 mb-8">
      {[...Array(3)].map((_, i) => (
        <Skeleton
          key={i}
          className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 h-40 sm:h-48 lg:h-56 rounded-xl"
        />
      ))}
    </div>
  );
};

export default BannerSkeleton;
