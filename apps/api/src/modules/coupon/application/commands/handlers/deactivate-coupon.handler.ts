import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeactivateCouponCommand } from '../deactivate-coupon.command';
import { CouponRepository } from '@/modules/coupon/domain/repositories/coupon.repository';

@CommandHandler(DeactivateCouponCommand)
export class DeactivateCouponHandler
  implements ICommandHandler<DeactivateCouponCommand>
{
  constructor(
    @Inject('CouponRepository')
    private readonly couponRepository: CouponRepository,
  ) {}

  async execute(command: DeactivateCouponCommand): Promise<void> {
    const coupon = await this.couponRepository.findById(command.id);
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID '${command.id}' not found`);
    }

    coupon.deactivate();
    await this.couponRepository.update(coupon);
  }
}
