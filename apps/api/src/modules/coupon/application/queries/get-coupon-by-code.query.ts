import { Query } from '@nestjs/cqrs';
import { Coupon } from '@/modules/coupon/domain/entities';

export class GetCouponByCodeQuery extends Query<Coupon> {
  constructor(public readonly code: string) {
    super();
  }
}
