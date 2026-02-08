import { Coupon, CouponUsage } from '../entities';

export interface CouponRepository {
  save(coupon: Coupon): Promise<Coupon>;
  update(coupon: Coupon): Promise<Coupon>;
  findById(id: string): Promise<Coupon | undefined>;
  findByCode(code: string): Promise<Coupon | undefined>;
  findAll(skip?: number, take?: number): Promise<{ coupons: Coupon[]; total: number }>;
  findActiveCoupons(): Promise<Coupon[]>;
  findAvailableForUser(userId: string): Promise<Coupon[]>;
  delete(id: string): Promise<void>;

  // Usage tracking
  getUserUsageCount(couponId: string, userId: string): Promise<number>;
  recordUsage(usage: CouponUsage): Promise<CouponUsage>;
  getCouponUsageHistory(couponId: string): Promise<CouponUsage[]>;
  getUserCouponUsage(userId: string): Promise<CouponUsage[]>;
}
