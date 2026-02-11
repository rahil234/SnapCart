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
  getAvailableCoupons: () =>
    handleRequest(() => couponsApi.couponControllerGetAvailableCoupons()),
  getCouponByCode: (code: string) =>
    handleRequest(() => couponsApi.couponControllerGetCouponByCode(code)),
  getAdminCoupons: () =>
    handleRequest(() => adminCouponsApi.adminCouponControllerFindAll()),
  createCoupon: (coupon: CreateCouponDto) =>
    handleRequest(() => adminCouponsApi.adminCouponControllerCreate(coupon)),
  updateCoupon: (id: string, coupon: UpdateCouponDto) =>
    handleRequest(() =>
      adminCouponsApi.adminCouponControllerUpdate(id, coupon)
    ),
  validateCoupon: (coupon: ValidateCouponDto) =>
    handleRequest(() => couponsApi.couponControllerValidateCoupon(coupon)),
};
