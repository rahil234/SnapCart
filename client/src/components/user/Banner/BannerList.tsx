import { useRef } from 'react';

import BannerItem from '@/components/user/Banner/BannerItem';
import { useAutoScroll } from '@/hooks/useAutoScroll';

interface IBanner {
  _id: number;
  image: string;
  order: number;
}

interface BannerListProps {
  banners: IBanner[];
  imageUrl: string;
}

const BannerList = ({ banners, imageUrl }: BannerListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useAutoScroll(containerRef, banners.length > 1);

  const loopedBanners = [...banners, ...banners];

  return (
    <div className="overflow-hidden mb-8">
      <div
        ref={containerRef}
        className="flex gap-2 overflow-x-auto hide-scroll"
      >
        {loopedBanners.map((banner, index) => (
          <BannerItem
            key={`${banner._id}-${index}`}
            imageUrl={imageUrl}
            image={banner.image}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerList;
