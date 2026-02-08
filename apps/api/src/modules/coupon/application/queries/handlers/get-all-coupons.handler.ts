import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllCouponsQuery } from '../get-all-coupons.query';
import { Coupon } from '@/modules/coupon/domain/entities';
import { CouponRepository } from '@/modules/coupon/domain/repositories/coupon.repository';

@QueryHandler(GetAllCouponsQuery)
export class GetAllCouponsHandler
  implements IQueryHandler<GetAllCouponsQuery>
{
  constructor(
    @Inject('CouponRepository')
    private readonly couponRepository: CouponRepository,
  ) {}

  async execute(query: GetAllCouponsQuery): Promise<{
    coupons: Coupon[];
    total: number;
  }> {
    return await this.couponRepository.findAll(query.skip, query.take);
  }
}
