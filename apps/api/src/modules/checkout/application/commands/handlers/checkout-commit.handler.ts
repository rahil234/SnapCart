import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject, Injectable, NotFoundException, } from '@nestjs/common';
import { CheckoutCommitCommand } from '../checkout-commit.command';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CouponRepository } from '@/modules/coupon/domain/repositories/coupon.repository';
import { CartItemWithPricing, PricingCalculationService, } from '../../../domain/services';
import { CheckoutSource } from '../../../domain/enums';
import { CouponUsage } from '@/modules/coupon/domain/entities';
import { Coupon } from '@/modules/coupon/domain/entities/coupon.entity';
import {
  CUSTOMER_IDENTITY_RESOLVER,
  CustomerIdentityResolver,
} from '@/modules/user/application/ports/customer-identity.resolver';

/**
 * Order Response DTO
 */
export interface OrderResponseDto {
  id: string;
  orderNumber: string;
  subtotal: number;
  discount: number;
  couponDiscount: number;
  offerDiscount: number;
  shippingCharge: number;
  tax: number;
  total: number;
  appliedCouponCode: string | null;
  items: any[];
  paymentStatus: string;
  orderStatus: string;
}

/**
 * CheckoutCommitHandler
 * Handles checkout commit command
 * - Revalidates all pricing
 * - Creates order with pricing snapshot
 * - Records coupon usage
 * - Clears cart if source is CART
 */
@CommandHandler(CheckoutCommitCommand)
@Injectable()
export class CheckoutCommitHandler implements ICommandHandler<CheckoutCommitCommand> {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('CouponRepository')
    private readonly couponRepository: CouponRepository,
    private readonly pricingService: PricingCalculationService,
    @Inject(CUSTOMER_IDENTITY_RESOLVER)
    private readonly customerIdentityResolver: CustomerIdentityResolver,
  ) {}

  async execute(command: CheckoutCommitCommand): Promise<OrderResponseDto> {
    const { userId, source, couponCode, shippingAddressId, paymentMethod } =
      command;

    // Resolve customer ID from user ID
    const customerId =
      await this.customerIdentityResolver.resolveCustomerIdByUserId(userId);

    // Step 1: Fetch cart items with pricing
    const cartItems = await this.fetchCartItemsWithPricing(customerId, source);

    if (!cartItems || cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Step 2: Revalidate coupon if provided
    let coupon: Coupon | null = null;
    let userCouponUsageCount = 0;

    if (couponCode) {
      const foundCoupon = await this.couponRepository.findByCode(couponCode);

      if (!foundCoupon) {
        throw new NotFoundException(`Coupon '${couponCode}' not found`);
      }

      coupon = foundCoupon;

      userCouponUsageCount = await this.couponRepository.getUserUsageCount(
        coupon.getId(),
        userId,
      );
    }

    // Step 3: Recalculate pricing (revalidation)
    const pricing = this.pricingService.calculatePricing(
      cartItems,
      coupon,
      userCouponUsageCount,
    );

    // Step 4: Fetch shipping address
    const shippingAddress = await this.prisma.address.findUnique({
      where: { id: shippingAddressId },
    });

    if (!shippingAddress) {
      throw new NotFoundException('Shipping address not found');
    }

    // Step 5: Create order
    const order = await this.createOrder(
      customerId,
      cartItems,
      pricing,
      shippingAddress,
      paymentMethod,
      source,
    );

    // Step 6: Record coupon usage if coupon was applied
    if (coupon && pricing.couponDiscount > 0) {
      const couponUsage = CouponUsage.create(
        coupon.getId(),
        userId,
        pricing.couponDiscount,
        order.id,
      );
      await this.couponRepository.recordUsage(couponUsage);
    }

    // Transform to response DTO
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      subtotal: order.subtotal,
      discount: order.discount,
      couponDiscount: order.couponDiscount,
      offerDiscount: order.offerDiscount,
      shippingCharge: order.shippingCharge,
      tax: order.tax,
      total: order.total,
      appliedCouponCode: order.appliedCouponCode,
      items: order.items as any[],
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
    };
  }

  /**
   * Fetch cart items with pricing information
   */
  private async fetchCartItemsWithPricing(
    customerId: string,
    source: CheckoutSource,
  ): Promise<CartItemWithPricing[]> {
    if (source !== CheckoutSource.CART) {
      throw new BadRequestException(
        'Only CART checkout is supported currently',
      );
    }

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
                variantName: true,
              },
            },
            Product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart.items.map((item) => ({
      variantId: item.variantId,
      productId: item.productId,
      quantity: item.quantity,
      basePrice: item.ProductVariant.price,
      discountPercent: item.ProductVariant.discountPercent || 0,
    }));
  }

  /**
   * Create order in database
   */
  private async createOrder(
    customerId: string,
    cartItems: any[],
    pricing: any,
    shippingAddress: any,
    paymentMethod: string,
    source: CheckoutSource,
  ) {
    // Fetch full cart items with product details for order items
    const cart = await this.prisma.cart.findUnique({
      where: { customerId },
      include: {
        items: {
          include: {
            ProductVariant: {
              select: {
                id: true,
                variantName: true,
                price: true,
                discountPercent: true,
                attributes: true,
              },
            },
            Product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Get variant IDs to fetch images
    const variantIds = cart!.items.map((item) => item.variantId);

    // Fetch variant images for all cart items in one query
    const variantImages = await this.prisma.variantImage.findMany({
      where: {
        variantId: { in: variantIds },
      },
      orderBy: {
        position: 'asc', // Get the primary image (lowest position)
      },
    });

    // Create a map of variantId -> imageUrl (first image)
    const imageUrlMap = new Map<string, string>();
    variantImages.forEach((image) => {
      if (!imageUrlMap.has(image.variantId)) {
        imageUrlMap.set(image.variantId, image.url);
      }
    });

    // Build order items array with image URLs
    const orderItems = cart!.items.map((item) => ({
      productId: item.productId,
      productName: item.Product!.name,
      variantId: item.variantId,
      variantName: item.ProductVariant.variantName,
      quantity: item.quantity,
      basePrice: item.ProductVariant.price,
      discountPercent: item.ProductVariant.discountPercent || 0,
      finalPrice:
        item.ProductVariant.price *
        (1 - (item.ProductVariant.discountPercent || 0) / 100),
      attributes: item.ProductVariant.attributes,
      imageUrl: imageUrlMap.get(item.variantId) || null, // Add image URL
    }));

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create order
    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        customerId,
        subtotal: pricing.subtotal,
        discount: pricing.productDiscount,
        couponDiscount: pricing.couponDiscount,
        offerDiscount: pricing.offerDiscount,
        shippingCharge: pricing.shippingCharge,
        tax: pricing.tax,
        total: pricing.total,
        appliedCouponCode: pricing.couponSnapshot?.code || null,
        items: orderItems,
        shippingAddressJson: shippingAddress,
        paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'pending',
        metadata: {
          source,
          couponSnapshot: pricing.couponSnapshot?.toJSON() || null,
        },
      },
    });

    return order;
  }
}
