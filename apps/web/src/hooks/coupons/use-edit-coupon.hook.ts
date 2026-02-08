import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Coupon } from '@/types';
import { CouponService } from '@/services/coupon.service';

export const useEditCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Coupon) => CouponService.updateCoupon(data.id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};
