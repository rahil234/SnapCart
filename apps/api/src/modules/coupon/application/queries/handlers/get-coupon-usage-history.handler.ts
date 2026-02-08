import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetCouponUsageHistoryQuery } from '../get-coupon-usage-history.query';
import { CouponUsage } from '@/modules/coupon/domain/entities';
import { CouponRepository } from '@/modules/coupon/domain/repositories/coupon.repository';

@QueryHandler(GetCouponUsageHistoryQuery)
export class GetCouponUsageHistoryHandler
  implements IQueryHandler<GetCouponUsageHistoryQuery>
{
  constructor(
    @Inject('CouponRepository')
    private readonly couponRepository: CouponRepository,
  ) {}

  async execute(query: GetCouponUsageHistoryQuery): Promise<CouponUsage[]> {
    return await this.couponRepository.getCouponUsageHistory(query.couponId);
  }
}
