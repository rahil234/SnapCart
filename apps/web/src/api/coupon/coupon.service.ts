import { CouponApi } from '@/api/generated';
import { apiConfig } from '@/api/client';
import { ICoupon } from '@/types/coupon';

const couponApi = new CouponApi(apiConfig);

export const CouponService = {
  getCoupons: () => couponApi.couponControllerFindAll(),
  addCoupon: (coupon: ICoupon) => couponApi.couponControllerCreate(coupon),
  updateCoupon: (coupon: ICoupon) =>
    couponApi.couponControllerUpdateCoupon(coupon._id, coupon),
  getAvailableCoupons: () => couponApi.couponControllerFindAvailable(),
  applyCoupon: (applyCouponDto: any) =>
    couponApi.couponControllerApply(applyCouponDto),
};
