import { useEffect } from 'react';

export const useAutoScroll = (
  ref: React.RefObject<HTMLDivElement>,
  enabled: boolean,
  interval = 3000
) => {
  useEffect(() => {
    const container = ref.current;
    if (!container || !enabled) return;

    let scrollAmount = 0;
    const maxScroll = container.scrollWidth / 2;

    const timer = setInterval(() => {
      scrollAmount += container.clientWidth;
      if (scrollAmount >= maxScroll) scrollAmount = 0;

      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }, interval);

    return () => clearInterval(timer);
  }, [ref, enabled, interval]);
};
