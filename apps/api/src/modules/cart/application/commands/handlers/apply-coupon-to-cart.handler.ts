import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';

import { ApplyCouponToCartCommand } from '../apply-coupon-to-cart.command';
import { CartRepository } from '@/modules/cart/domain/repositories/cart.repository';
import { CouponRepository } from '@/modules/coupon/domain/repositories/coupon.repository';
import {
  CUSTOMER_IDENTITY_RESOLVER,
  CustomerIdentityResolver,
} from '@/modules/user/application/ports/customer-identity.resolver';

@CommandHandler(ApplyCouponToCartCommand)
export class ApplyCouponToCartHandler implements ICommandHandler<ApplyCouponToCartCommand> {
  constructor(
    @Inject('CartRepository')
    private readonly cartRepository: CartRepository,
    @Inject('CouponRepository')
    private readonly couponRepository: CouponRepository,
    @Inject(CUSTOMER_IDENTITY_RESOLVER)
    private readonly customerIdentityResolver: CustomerIdentityResolver,
  ) {}

  async execute(command: ApplyCouponToCartCommand): Promise<void> {
    const { userId, couponCode } = command;

    const customerId =
      await this.customerIdentityResolver.resolveCustomerIdByUserId(userId);

    // Get cart
    const cart = await this.cartRepository.findByCustomerId(customerId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (cart.isEmpty()) {
      throw new BadRequestException('Cannot apply coupon to empty cart');
    }

    // Validate coupon exists
    const coupon = await this.couponRepository.findByCode(couponCode);
    if (!coupon) {
      throw new NotFoundException(`Coupon '${couponCode}' not found`);
    }

    // Store coupon code in cart metadata or session
    // For now we'll just validate it exists
    // Full integration would store this in cart entity or session
  }
}
