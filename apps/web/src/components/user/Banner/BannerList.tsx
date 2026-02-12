import { useRef, useEffect, useState } from 'react';

import { BannerResponse } from '@/services/banner.service';
import BannerItem from '@/components/user/Banner/BannerItem';

interface BannerListProps {
  banners: BannerResponse[];
}

const BannerList = ({ banners }: BannerListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);

  // Triple the banners for seamless infinite scrolling
  const infiniteBanners = [...banners, ...banners, ...banners];

  useEffect(() => {
    const container = containerRef.current;
    if (!container || banners.length <= 1) return;

    // Auto-scroll every 4 seconds
    autoScrollInterval.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        // Reset to a middle set when reaching the end
        if (nextIndex >= banners.length * 2) {
          // Jump back to the equivalent position in the middle set
          container.scrollTo({
            left: banners.length * container.clientWidth,
            behavior: 'auto',
          });
          return banners.length;
        }
        return nextIndex;
      });
    }, 4000);

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [banners.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTo({
      left: currentIndex * container.clientWidth,
      behavior: 'smooth',
    });
  }, [currentIndex]);

  // Handle manual scroll to maintain infinite effect
  useEffect(() => {
    const container = containerRef.current;
    if (!container || banners.length <= 1) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.clientWidth;
      const currentPos = Math.round(scrollLeft / itemWidth);

      // If scrolled to the first set, jump to the middle set
      if (currentPos <= 0) {
        container.scrollTo({
          left: banners.length * itemWidth,
          behavior: 'auto',
        });
        setCurrentIndex(banners.length);
      }
      // If scrolled past the second set, jump back to the middle set
      else if (currentPos >= banners.length * 2) {
        container.scrollTo({
          left: banners.length * itemWidth,
          behavior: 'auto',
        });
        setCurrentIndex(banners.length);
      }
    };

    container.addEventListener('scrollend', handleScroll);
    return () => container.removeEventListener('scrollend', handleScroll);
  }, [banners.length]);

  // Initialize scroll position to middle set
  useEffect(() => {
    const container = containerRef.current;
    if (!container || banners.length <= 1) return;

    // Start from the middle set for seamless infinite scrolling
    container.scrollTo({
      left: banners.length * container.clientWidth,
      behavior: 'auto',
    });
    setCurrentIndex(banners.length);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="w-full overflow-hidden mb-6 px-4 md:px-6 lg:px-8">
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {infiniteBanners.map((banner, index) => (
          <div
            key={`${banner.id}-${index}`}
            className="snap-center snap-always min-w-full"
          >
            <BannerItem imageUrl={banner.imageUrl} />
          </div>
        ))}
      </div>

      {/* Indicator dots */}
      {banners.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(banners.length + index);
                if (autoScrollInterval.current) {
                  clearInterval(autoScrollInterval.current);
                }
              }}
              className={`h-2 rounded-full transition-all ${
                (currentIndex % banners.length) === index
                  ? 'w-8 bg-blue-600'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerList;
