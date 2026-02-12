import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const BannerSkeleton = () => {
  return (
    <div className="w-full overflow-hidden mb-6 px-4 md:px-6 lg:px-8">
      <div className="flex gap-4">
        <Skeleton className="flex-shrink-0 w-full h-[180px] sm:h-[200px] md:h-[240px] lg:h-[280px] xl:h-[320px] rounded-lg sm:rounded-xl" />
      </div>
      {/* Skeleton dots */}
      <div className="flex justify-center gap-2 mt-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-2 w-2 rounded-full" />
        ))}
      </div>
    </div>
  );
};

export default BannerSkeleton;
