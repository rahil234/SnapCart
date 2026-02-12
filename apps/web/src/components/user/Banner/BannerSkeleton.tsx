import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const BannerSkeleton = () => {
  return (
    <div className="w-full overflow-hidden mb-6">
      <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
        {/* Mobile: 1 banner, Tablet: 2 banners, Desktop: 3 banners */}
        <Skeleton className="w-full md:w-[calc(50%-0.5rem)] xl:w-[calc(33.333%-1rem)] h-[173px] sm:h-[80px] md:h-[120px] lg:h-[150px] xl:h-[180px] 2xl:h-[200px] rounded-lg sm:rounded-xl" />

        {/* Second banner - visible on tablet and desktop */}
        <Skeleton className="hidden md:block md:w-[calc(50%-0.5rem)] xl:w-[calc(33.333%-1rem)] h-[173px] sm:h-[80px] md:h-[120px] lg:h-[150px] xl:h-[180px] 2xl:h-[200px] rounded-lg sm:rounded-xl" />

        {/* Third banner - visible only on desktop */}
        <Skeleton className="hidden xl:block xl:w-[calc(33.333%-1rem)] h-[173px] sm:h-[80px] md:h-[120px] lg:h-[150px] xl:h-[180px] 2xl:h-[200px] rounded-lg sm:rounded-xl" />
      </div>

      {/* Skeleton dots */}
      <div className="flex justify-center gap-2 mt-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton
            key={i}
            className={`h-2 rounded-full ${i === 0 ? 'w-8' : 'w-2'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSkeleton;
