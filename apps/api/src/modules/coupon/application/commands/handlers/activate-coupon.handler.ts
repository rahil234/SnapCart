import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { ActivateCouponCommand } from '../activate-coupon.command';
import { CouponRepository } from '@/modules/coupon/domain/repositories/coupon.repository';

@CommandHandler(ActivateCouponCommand)
export class ActivateCouponHandler implements ICommandHandler<ActivateCouponCommand> {
  constructor(
    @Inject('CouponRepository')
    private readonly couponRepository: CouponRepository,
  ) {}

  async execute(command: ActivateCouponCommand): Promise<void> {
    const coupon = await this.couponRepository.findById(command.id);
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID '${command.id}' not found`);
    }

    coupon.activate();
    await this.couponRepository.update(coupon);
  }
}
