import React, { useEffect, useRef } from 'react';
import adminEndpoints from '@/api/adminEndpoints';
import { ImportMeta } from '@types';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

const imageUrl =
  (import.meta as unknown as ImportMeta).env.VITE_IMAGE_URL + '/banners/';

interface IBanner {
  _id: number;
  image: string;
  order: number;
}

const TopBanner = () => {
  const { data: banners, isLoading } = useQuery<IBanner[]>({
    queryKey: ['banners'],
    queryFn: adminEndpoints.getBanners,
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer || !banners) return;

    let scrollAmount = 0;
    const scrollWidth = scrollContainer.scrollWidth / 2;

    const slideTimer = setInterval(() => {
      scrollAmount += scrollContainer.clientWidth / 3 + 4;

      if (scrollAmount >= scrollWidth) {
        scrollAmount = 0;
      }

      scrollContainer.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }, 3000);

    return () => clearInterval(slideTimer);
  }, [banners]);

  if (isLoading)
    return (
      <div className="flex overflow-x-auto hide-scroll gap-2 lg:gap-1 mb-8">
        <Skeleton className="flex-shrink-0 w-full lg:w-1/3 h-50 lg:h-60 rounded-lg lg:rounded-xl" />
        <Skeleton className="flex-shrink-0 w-full lg:w-1/3 h-50 lg:h-60 rounded-lg lg:rounded-xl" />
        <Skeleton className="flex-shrink-0 w-full lg:w-1/3 h-50 lg:h-60 rounded-lg lg:rounded-xl" />
      </div>
    );

  if (!banners) return null;

  const loopBanners = [...banners, ...banners];

  return (
    <div className="overflow-hidden mb-8">
      <div
        className="flex gap-2 lg:gap-1 hide-scroll"
        ref={scrollContainerRef}
        style={{ overflowX: 'auto', scrollBehavior: 'smooth' }}
      >
        {loopBanners.map((banner, index) => (
          <div
            key={`${banner._id}-${index}`}
            className="text-white flex-shrink-0 w-full lg:w-1/3 h-50 lg:h-60"
          >
            {banner.image ? (
              <img
                src={imageUrl + banner.image}
                alt="Banner"
                className="w-full h-full object-cover rounded-lg lg:rounded-xl"
              />
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-2">Special Offer</h2>
                <p className="text-sm">Save big on selected items!</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBanner;
