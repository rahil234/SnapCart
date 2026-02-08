import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetCouponQuery } from '../get-coupon.query';
import { Coupon } from '@/modules/coupon/domain/entities';
import { CouponRepository } from '@/modules/coupon/domain/repositories/coupon.repository';

@QueryHandler(GetCouponQuery)
export class GetCouponHandler implements IQueryHandler<GetCouponQuery> {
  constructor(
    @Inject('CouponRepository')
    private readonly couponRepository: CouponRepository,
  ) {}

  async execute(query: GetCouponQuery): Promise<Coupon> {
    const coupon = await this.couponRepository.findById(query.id);

    if (!coupon) {
      throw new NotFoundException(`Coupon with ID '${query.id}' not found`);
    }

    return coupon;
  }
}
