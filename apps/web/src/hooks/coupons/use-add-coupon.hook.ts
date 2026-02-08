import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Coupon } from '@/types';
import { CouponService } from '@/services/coupon.service';

export const useAddCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Coupon, 'id'>) => CouponService.createCoupon(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};
