export * from './get-coupon.handler';
export * from './get-coupon-by-code.handler';
export * from './get-available-coupons.handler';
export * from './get-all-coupons.handler';
export * from './get-coupon-usage-history.handler';
export * from './get-coupon-analytics.handler';

import { GetCouponHandler } from './get-coupon.handler';
import { GetCouponByCodeHandler } from './get-coupon-by-code.handler';
import { GetAvailableCouponsHandler } from './get-available-coupons.handler';
import { GetAllCouponsHandler } from './get-all-coupons.handler';
import { GetCouponUsageHistoryHandler } from './get-coupon-usage-history.handler';
import { GetCouponAnalyticsHandler } from './get-coupon-analytics.handler';

const QueryHandlers = [
  GetCouponHandler,
  GetCouponByCodeHandler,
  GetAvailableCouponsHandler,
  GetAllCouponsHandler,
  GetCouponUsageHistoryHandler,
  GetCouponAnalyticsHandler,
];

export default QueryHandlers;
