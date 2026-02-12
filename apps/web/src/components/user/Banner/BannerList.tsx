import { useCallback, useEffect, useRef, useState } from 'react';

import { BannerResponse } from '@/services/banner.service';
import BannerItem from '@/components/user/Banner/BannerItem';

interface BannerListProps {
  banners: BannerResponse[];
}

const BannerList = ({ banners }: BannerListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [isScrolling, setIsScrolling] = useState(false);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Calculate items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setItemsPerView(3);
      } else if (width >= 768) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, banners.length - itemsPerView);

  // Start auto-scroll
  const startAutoScroll = useCallback(() => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }

    if (banners.length > itemsPerView) {
      autoScrollInterval.current = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          return nextIndex > maxIndex ? 0 : nextIndex;
        });
      }, 4000);
    }
  }, [banners.length, itemsPerView, maxIndex]);

  // Stop auto-scroll
  const stopAutoScroll = useCallback(() => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  }, []);

  // Initial auto-scroll setup
  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [startAutoScroll, stopAutoScroll]);

  // Handle smooth scrolling to current index
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isScrolling) return;

    const containerWidth = container.clientWidth;
    const gap = parseInt(getComputedStyle(container).gap) || 0;
    let itemWidth;

    if (itemsPerView === 1) {
      itemWidth = containerWidth;
    } else if (itemsPerView === 2) {
      itemWidth = (containerWidth - gap) / 2;
    } else {
      itemWidth = (containerWidth - gap * 2) / 3;
    }

    const scrollLeft = currentIndex * (itemWidth + gap);

    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth',
    });
  }, [currentIndex, itemsPerView, isScrolling]);

  // Handle manual scroll detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container || banners.length <= itemsPerView) return;

    const handleScroll = () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      setIsScrolling(true);
      stopAutoScroll();

      // Debounce scroll end detection
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);

        // Calculate the current index based on scroll position
        const containerWidth = container.clientWidth;
        const gap = parseInt(getComputedStyle(container).gap) || 0;
        let itemWidth;

        if (itemsPerView === 1) {
          itemWidth = containerWidth;
        } else if (itemsPerView === 2) {
          itemWidth = (containerWidth - gap) / 2;
        } else {
          itemWidth = (containerWidth - gap * 2) / 3;
        }

        const scrollLeft = container.scrollLeft;
        const calculatedIndex = Math.round(scrollLeft / (itemWidth + gap));
        const clampedIndex = Math.max(0, Math.min(calculatedIndex, maxIndex));

        if (clampedIndex !== currentIndex) {
          setCurrentIndex(clampedIndex);
        }

        // Restart auto-scroll after manual interaction
        setTimeout(() => {
          startAutoScroll();
        }, 2000);
      }, 150);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [
    banners.length,
    itemsPerView,
    maxIndex,
    currentIndex,
    startAutoScroll,
    stopAutoScroll,
  ]);

  if (banners.length === 0) return null;

  return (
    <div className="w-full overflow-hidden mb-6">
      <div
        ref={containerRef}
        className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {banners.map((banner, index) => (
          <div
            key={`${banner.id}-${index}`}
            className="snap-center snap-always flex-shrink-0 w-full md:w-[calc(50%-0.5rem)] xl:w-[calc(33.333%-1rem)]"
          >
            <BannerItem imageUrl={banner.imageUrl} />
          </div>
        ))}
      </div>

      {/* Indicator dots - only show if there are more banners than visible */}
      {banners.length > itemsPerView && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => {
                stopAutoScroll();
                setCurrentIndex(index);
                setTimeout(() => {
                  startAutoScroll();
                }, 2000);
              }}
              className={`h-2 rounded-full transition-all ${
                currentIndex === index
                  ? 'w-8 bg-blue-600'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to banner set ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerList;
