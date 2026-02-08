import {
  AdminCouponsApi,
  CouponsApi,
  CreateCouponDto,
  UpdateCouponDto,
  ValidateCouponDto,
} from '@/api/generated';
import { apiClient } from '@/api/axios';
import { apiConfig } from '@/api/client';
import { handleRequest } from '@/api/utils/handleRequest';

const couponsApi = new CouponsApi(apiConfig, undefined, apiClient);
const adminCouponsApi = new AdminCouponsApi(apiConfig, undefined, apiClient);

export const CouponService = {
  getCoupons: () =>
    handleRequest(() => adminCouponsApi.adminCouponControllerFindAll()),
  createCoupon: (coupon: CreateCouponDto) =>
    handleRequest(() => adminCouponsApi.adminCouponControllerCreate(coupon)),
  updateCoupon: (id: string, coupon: UpdateCouponDto) =>
    handleRequest(() =>
      adminCouponsApi.adminCouponControllerUpdate(id, coupon)
    ),
  getAvailableCoupons: () =>
    handleRequest(() => couponsApi.couponControllerGetAvailableCoupons()),
  validateCoupon: (coupon: ValidateCouponDto) =>
    handleRequest(() => couponsApi.couponControllerValidateCoupon(coupon)),
};
