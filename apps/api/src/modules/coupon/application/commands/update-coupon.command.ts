import { Command } from '@nestjs/cqrs';
import { Coupon } from '@/modules/coupon/domain/entities';
import { CouponType, Applicability } from '@/modules/coupon/domain/enums';

export class UpdateCouponCommand extends Command<Coupon> {
  constructor(
    public readonly id: string,
    public readonly code?: string,
    public readonly type?: CouponType,
    public readonly discount?: number,
    public readonly minAmount?: number,
    public readonly maxDiscount?: number,
    public readonly startDate?: Date,
    public readonly endDate?: Date,
    public readonly usageLimit?: number,
    public readonly maxUsagePerUser?: number,
    public readonly applicableTo?: Applicability,
    public readonly isStackable?: boolean,
    public readonly description?: string,
  ) {
    super();
  }
}
