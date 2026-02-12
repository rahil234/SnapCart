import { useQuery } from '@tanstack/react-query';

import { BannerService } from '@/services/banner.service';
import BannerList from '@/components/user/Banner/BannerList';
import BannerSkeleton from '@/components/user/Banner/BannerSkeleton';

const TopBanner = () => {
  const { data: banners, isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data, error } = await BannerService.getActiveBanners();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <BannerSkeleton />;
  if (!banners || banners.length === 0) return null;

  return <BannerList banners={banners} />;
};

export default TopBanner;
