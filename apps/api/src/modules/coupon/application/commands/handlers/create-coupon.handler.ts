import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, ConflictException } from '@nestjs/common';
import { CreateCouponCommand } from '../create-coupon.command';
import { Coupon } from '@/modules/coupon/domain/entities';
import { CouponRepository } from '@/modules/coupon/domain/repositories/coupon.repository';

@CommandHandler(CreateCouponCommand)
export class CreateCouponHandler implements ICommandHandler<CreateCouponCommand> {
  constructor(
    @Inject('CouponRepository')
    private readonly couponRepository: CouponRepository,
  ) {}

  async execute(command: CreateCouponCommand): Promise<Coupon> {
    const {
      code,
      type,
      discount,
      minAmount,
      startDate,
      endDate,
      maxDiscount,
      usageLimit,
      maxUsagePerUser,
      applicableTo,
      isStackable,
      description,
    } = command;

    // Check if coupon code already exists
    const existingCoupon = await this.couponRepository.findByCode(code);
    if (existingCoupon) {
      throw new ConflictException(
        `Coupon with code '${code}' already exists`,
      );
    }

    // Create domain entity using factory method (with business validation)
    const coupon = Coupon.create(
      code,
      type,
      discount,
      minAmount,
      startDate,
      endDate,
      maxDiscount,
      usageLimit,
      maxUsagePerUser,
      applicableTo,
      isStackable,
      description,
    );

    // Persist the coupon
    const createdCoupon = await this.couponRepository.save(coupon);

    return createdCoupon;
  }
}
