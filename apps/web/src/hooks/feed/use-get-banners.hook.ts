import { useQuery } from '@tanstack/react-query';

import { BannerService } from '@/services/banner.service';

export const useGetBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data, error } = await BannerService.getActiveBanners();
      if (error) throw error;
      return data;
    },
  });
};
