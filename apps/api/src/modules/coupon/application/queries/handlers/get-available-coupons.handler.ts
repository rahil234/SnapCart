import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAvailableCouponsQuery } from '../get-available-coupons.query';
import { Coupon } from '@/modules/coupon/domain/entities';
import { CouponRepository } from '@/modules/coupon/domain/repositories/coupon.repository';

@QueryHandler(GetAvailableCouponsQuery)
export class GetAvailableCouponsHandler
  implements IQueryHandler<GetAvailableCouponsQuery>
{
  constructor(
    @Inject('CouponRepository')
    private readonly couponRepository: CouponRepository,
  ) {}

  async execute(query: GetAvailableCouponsQuery): Promise<Coupon[]> {
    return await this.couponRepository.findAvailableForUser(query.userId);
  }
}
