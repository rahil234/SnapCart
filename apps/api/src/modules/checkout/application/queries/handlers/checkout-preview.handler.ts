import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { CheckoutPreviewQuery } from '../checkout-preview.query';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CouponRepository } from '@/modules/coupon/domain/repositories/coupon.repository';
import { PricingCalculationService, CartItemWithPricing } from '../../../domain/services';
import { OrderPricingSnapshot } from '../../../domain/entities';
import { CheckoutSource } from '../../../domain/enums';
import { Coupon } from '@/modules/coupon/domain/entities/coupon.entity';
import {
  CUSTOMER_IDENTITY_RESOLVER,
  CustomerIdentityResolver,
} from '@/modules/user/application/ports/customer-identity.resolver';

/**
 * CheckoutPreviewHandler
 * Handles checkout preview query
 * - Fetches cart items from database
 * - Validates coupon if provided
 * - Calculates pricing breakdown
 * - No database writes
 */
@QueryHandler(CheckoutPreviewQuery)
@Injectable()
export class CheckoutPreviewHandler implements IQueryHandler<CheckoutPreviewQuery> {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('CouponRepository')
    private readonly couponRepository: CouponRepository,
    private readonly pricingService: PricingCalculationService,
    @Inject(CUSTOMER_IDENTITY_RESOLVER)
    private readonly customerIdentityResolver: CustomerIdentityResolver,
  ) {}

  async execute(query: CheckoutPreviewQuery): Promise<OrderPricingSnapshot> {
    const { userId, source, couponCode } = query;

    // Resolve customer ID from user ID
    const customerId =
      await this.customerIdentityResolver.resolveCustomerIdByUserId(userId);

    // Step 1: Fetch cart items with pricing
    const cartItems = await this.fetchCartItemsWithPricing(customerId, source);

    if (!cartItems || cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Step 2: Fetch and validate coupon if provided
    let coupon: Coupon | null = null;
    let userCouponUsageCount = 0;

    if (couponCode) {
      const foundCoupon = await this.couponRepository.findByCode(couponCode);

      if (!foundCoupon) {
        throw new NotFoundException(`Coupon '${couponCode}' not found`);
      }

      coupon = foundCoupon;

      // Get user's usage count for this coupon
      userCouponUsageCount = await this.couponRepository.getUserUsageCount(
        coupon.getId(),
        userId,
      );
    }

    // Step 3: Calculate pricing
    const pricing = this.pricingService.calculatePricing(
      cartItems,
      coupon,
      userCouponUsageCount,
    );

    return pricing;
  }

  /**
   * Fetch cart items with pricing information
   */
  private async fetchCartItemsWithPricing(
    customerId: string,
    source: CheckoutSource,
  ): Promise<CartItemWithPricing[]> {
    // For now, only support CART source
    // PRODUCT source (Buy Now) is not implemented yet
    if (source !== CheckoutSource.CART) {
      throw new BadRequestException('Only CART checkout is supported currently');
    }

    // Fetch cart with items and variant details
    const cart = await this.prisma.cart.findUnique({
      where: { customerId },
      include: {
        items: {
          include: {
            ProductVariant: {
              select: {
                id: true,
                price: true,
                discountPercent: true,
                stock: true,
                isActive: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Transform to CartItemWithPricing
    return cart.items.map((item) => ({
      variantId: item.variantId,
      productId: item.productId,
      quantity: item.quantity,
      basePrice: item.ProductVariant.price,
      discountPercent: item.ProductVariant.discountPercent || 0,
    }));
  }
}
