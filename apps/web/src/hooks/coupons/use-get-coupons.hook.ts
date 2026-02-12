import { useQuery } from '@tanstack/react-query';
import { CouponService } from '@/services/coupon.service';

export const useGetAvailableCoupons = () => {
  return useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data, error } = await CouponService.getAvailableCoupons();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
