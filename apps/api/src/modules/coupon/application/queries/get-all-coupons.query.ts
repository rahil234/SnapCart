import { Query } from '@nestjs/cqrs';
import { Coupon } from '@/modules/coupon/domain/entities';

export class GetAllCouponsQuery extends Query<{
  coupons: Coupon[];
  total: number;
}> {
  constructor(
    public readonly skip?: number,
    public readonly take?: number,
  ) {
    super();
  }
}
