import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { ValidateCouponCommand } from '../validate-coupon.command';
import { CouponRepository } from '@/modules/coupon/domain/repositories/coupon.repository';

@CommandHandler(ValidateCouponCommand)
export class ValidateCouponHandler
  implements
    ICommandHandler<
      ValidateCouponCommand,
      { valid: boolean; reason?: string; discount?: number }
    >
{
  constructor(
    @Inject('CouponRepository')
    private readonly couponRepository: CouponRepository,
  ) {}

  async execute(command: ValidateCouponCommand): Promise<{
    valid: boolean;
    reason?: string;
    discount?: number;
  }> {
    const { code, userId, cartTotal } = command;

    // Find coupon by code
    const coupon = await this.couponRepository.findByCode(code);
    if (!coupon) {
      return {
        valid: false,
        reason: 'Coupon not found',
      };
    }

    // Get user usage count
    const userUsageCount = await this.couponRepository.getUserUsageCount(
      coupon.getId(),
      userId,
    );

    // Validate coupon
    const validation = coupon.validateForCart(cartTotal, userUsageCount);

    if (validation.valid) {
      const discount = coupon.calculateDiscount(cartTotal);
      return {
        valid: true,
        discount,
      };
    }

    return {
      valid: false,
      reason: validation.reason,
    };
  }
}
