import BannerList from '@/components/user/Banner/BannerList';
import { useGetBanners } from '@/hooks/feed/use-get-banners.hook';
import BannerSkeleton from '@/components/user/Banner/BannerSkeleton';

const TopBanner = () => {
  const { data: banners, isLoading } = useGetBanners();

  if (isLoading) return <BannerSkeleton />;
  if (!banners || banners.length === 0) return null;

  return <BannerList banners={banners} />;
};

export default TopBanner;
