import { ImportMeta } from '@/types';
import { useQuery } from '@tanstack/react-query';

import adminEndpoints from '@/api/adminEndpoints';
import BannerList from '@/components/user/Banner/BannerList';
import BannerSkeleton from '@/components/user/Banner/BannerSkeleton';

const imageUrl =
  (import.meta as unknown as ImportMeta).env.VITE_IMAGE_URL + '/banners/';

const TopBanner = () => {
  const { data: banners, isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: adminEndpoints.getBanners,
  });

  if (isLoading) return <BannerSkeleton />;
  if (!banners || banners.length === 0) return null;

  return <BannerList banners={banners} imageUrl={imageUrl} />;
};

export default TopBanner;
