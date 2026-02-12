import { Query } from '@nestjs/cqrs';
import { CouponUsage } from '@/modules/coupon/domain/entities';

export class GetCouponUsageHistoryQuery extends Query<CouponUsage[]> {
  constructor(public readonly couponId: string) {
    super();
  }
}
