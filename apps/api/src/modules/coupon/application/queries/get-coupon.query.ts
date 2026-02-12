import { Query } from '@nestjs/cqrs';
import { Coupon } from '@/modules/coupon/domain/entities';

export class GetCouponQuery extends Query<Coupon> {
  constructor(public readonly id: string) {
    super();
  }
}
