import { Command } from '@nestjs/cqrs';
import { Coupon } from '@/modules/coupon/domain/entities';
import { CouponType, Applicability } from '@/modules/coupon/domain/enums';

export class CreateCouponCommand extends Command<Coupon> {
  constructor(
    public readonly code: string,
    public readonly type: CouponType,
    public readonly discount: number,
    public readonly minAmount: number,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly maxDiscount?: number,
    public readonly usageLimit?: number,
    public readonly maxUsagePerUser: number = 1,
    public readonly applicableTo: Applicability = Applicability.ALL,
    public readonly isStackable: boolean = false,
    public readonly description?: string,
  ) {
    super();
  }
}
