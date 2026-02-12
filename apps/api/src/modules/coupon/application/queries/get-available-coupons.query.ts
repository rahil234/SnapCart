import { Query } from '@nestjs/cqrs';
import { Coupon } from '@/modules/coupon/domain/entities';

export class GetAvailableCouponsQuery extends Query<Coupon[]> {
  constructor(public readonly userId: string) {
    super();
  }
}
