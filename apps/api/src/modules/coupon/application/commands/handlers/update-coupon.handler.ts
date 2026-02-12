import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateCouponCommand } from '../update-coupon.command';
import { Coupon } from '@/modules/coupon/domain/entities';
import { CouponRepository } from '@/modules/coupon/domain/repositories/coupon.repository';

@CommandHandler(UpdateCouponCommand)
export class UpdateCouponHandler implements ICommandHandler<UpdateCouponCommand> {
  constructor(
    @Inject('CouponRepository')
    private readonly couponRepository: CouponRepository,
  ) {}

  async execute(command: UpdateCouponCommand): Promise<Coupon> {
    const {
      id,
      code,
      type,
      discount,
      minAmount,
      maxDiscount,
      startDate,
      endDate,
      usageLimit,
      maxUsagePerUser,
      applicableTo,
      isStackable,
      description,
    } = command;

    // Find existing coupon
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID '${id}' not found`);
    }

    // Check if code is being changed and if it conflicts
    if (code && code !== coupon.getCode()) {
      const existingCoupon = await this.couponRepository.findByCode(code);
      if (existingCoupon && existingCoupon.getId() !== id) {
        throw new ConflictException(
          `Coupon with code '${code}' already exists`,
        );
      }
    }

    // Update domain entity (with business validation)
    coupon.updateDetails(
      code,
      type,
      discount,
      minAmount,
      maxDiscount,
      startDate,
      endDate,
      usageLimit,
      maxUsagePerUser,
      applicableTo,
      isStackable,
      description,
    );

    // Persist the updated coupon
    const updatedCoupon = await this.couponRepository.update(coupon);

    return updatedCoupon;
  }
}
