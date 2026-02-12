import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetCartPricingQuery } from '../get-cart-pricing.query';
import { CartRepository } from '@/modules/cart/domain/repositories/cart.repository';
import { OfferRepository } from '@/modules/offer/domain/repositories/offer.repository';
import { CouponRepository } from '@/modules/coupon/domain/repositories/coupon.repository';
import { DiscountCalculatorService } from '@/modules/cart/domain/services/discount-calculator.service';
import {
  CUSTOMER_IDENTITY_RESOLVER,
  CustomerIdentityResolver,
} from '@/modules/user/application/ports/customer-identity.resolver';
import { PrismaService } from '@/shared/prisma/prisma.service';

@QueryHandler(GetCartPricingQuery)
export class GetCartPricingHandler implements IQueryHandler<GetCartPricingQuery> {
  constructor(
    @Inject('CartRepository')
    private readonly cartRepository: CartRepository,
    @Inject('OfferRepository')
    private readonly offerRepository: OfferRepository,
    @Inject('CouponRepository')
    private readonly couponRepository: CouponRepository,
    private readonly discountCalculator: DiscountCalculatorService,
    private readonly prisma: PrismaService,
    @Inject(CUSTOMER_IDENTITY_RESOLVER)
    private readonly customerIdentityResolver: CustomerIdentityResolver,
  ) {}

  async execute(query: GetCartPricingQuery): Promise<any> {
    const { userId, couponCode } = query;

    const customerId =
      await this.customerIdentityResolver.resolveCustomerIdByUserId(userId);

    // Get cart with items
    const cart = await this.cartRepository.findByCustomerId(customerId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (cart.isEmpty()) {
      return {
        subtotal: 0,
        offerDiscount: 0,
        couponDiscount: 0,
        totalDiscount: 0,
        finalTotal: 0,
        appliedOfferIds: [],
        savings: 0,
        appliedOffers: [],
        discountedItems: [],
      };
    }

    // Fetch product/variant details with categories
    const cartItems = cart.getItems();

    const variantIds = cartItems.map((item) => item.getProductVariantId());

    const variants = await this.prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: {
        product: {
          select: {
            id: true,
            categoryId: true,
          },
        },
      },
    });

    // Build items array for discount calculator
    const items = cartItems.map((cartItem) => {
      const variant = variants.find(
        (v) => v.id === cartItem.getProductVariantId(),
      );
      return {
        productId: cartItem.getProductId(),
        variantId: cartItem.getProductVariantId(),
        categoryId: variant?.product.categoryId || '',
        price: variant?.price || 0,
        quantity: cartItem.getQuantity(),
      };
    });

    // Get active offers
    const offers = await this.offerRepository.findActiveOffers();

    // Get coupon if provided
    let coupon;
    let userCouponUsageCount = 0;

    if (couponCode) {
      coupon = await this.couponRepository.findByCode(couponCode);
      if (coupon) {
        userCouponUsageCount = await this.couponRepository.getUserUsageCount(
          coupon.getId(),
          customerId,
        );
      }
    }

    // Calculate pricing
    const pricing = this.discountCalculator.calculateFinalPricing(
      items,
      offers,
      coupon,
      userCouponUsageCount,
    );

    // Map applied offers to DTO format
    const appliedOffers = offers
      .filter((o) => pricing.appliedOfferIds.includes(o.getId()))
      .map((o) => ({
        id: o.getId(),
        name: o.getName(),
        discount: pricing.discountedItems
          .filter((item) => item.appliedOffer?.id === o.getId())
          .reduce((sum, item) => sum + item.offerDiscount, 0),
      }));

    return {
      ...pricing,
      appliedOffers,
    };
  }
}
