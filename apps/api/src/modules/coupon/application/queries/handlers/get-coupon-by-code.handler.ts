import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetCouponByCodeQuery } from '../get-coupon-by-code.query';
import { Coupon } from '@/modules/coupon/domain/entities';
import { CouponRepository } from '@/modules/coupon/domain/repositories/coupon.repository';

@QueryHandler(GetCouponByCodeQuery)
export class GetCouponByCodeHandler
  implements IQueryHandler<GetCouponByCodeQuery>
{
  constructor(
    @Inject('CouponRepository')
    private readonly couponRepository: CouponRepository,
  ) {}

  async execute(query: GetCouponByCodeQuery): Promise<Coupon> {
    const coupon = await this.couponRepository.findByCode(
      query.code.toUpperCase(),
    );

    if (!coupon) {
      throw new NotFoundException(`Coupon with code '${query.code}' not found`);
    }

    return coupon;
  }
}
