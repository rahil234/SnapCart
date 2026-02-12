import { v4 as uuidv4 } from 'uuid';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject, Injectable, NotFoundException, } from '@nestjs/common';

import { CheckoutSource } from '../../../domain/enums';
import { CouponUsage } from '@/modules/coupon/domain/entities';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CheckoutCommitCommand } from '../checkout-commit.command';
import {
  WalletTransaction,
  WalletTransactionStatus,
  WalletTransactionType,
} from '@/modules/wallet/domain/entities/wallet-transaction.entity';
import {
  CUSTOMER_IDENTITY_RESOLVER,
  CustomerIdentityResolver,
} from '@/modules/user/application/ports/customer-identity.resolver';
import { Coupon } from '@/modules/coupon/domain/entities/coupon.entity';
import { CouponRepository } from '@/modules/coupon/domain/repositories/coupon.repository';
import { WalletRepository } from '@/modules/wallet/domain/repositories/wallet.repository';
import { CartItemWithPricing, PricingCalculationService, } from '../../../domain/services';

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
 * - Handles wallet payment
 * - Clears cart if source is CART
 */
@CommandHandler(CheckoutCommitCommand)
@Injectable()
export class CheckoutCommitHandler implements ICommandHandler<CheckoutCommitCommand> {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('CouponRepository')
    private readonly couponRepository: CouponRepository,
    @Inject('WalletRepository')
    private readonly walletRepository: WalletRepository,
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

    // Step 4.5: Validate and process wallet payment if payment method is wallet
    if (paymentMethod === 'wallet') {
      const wallet = await this.walletRepository.findByCustomerId(customerId);

      if (!wallet) {
        throw new BadRequestException(
          'Wallet not found. Please add money to your wallet first.',
        );
      }

      if (!wallet.getIsActive()) {
        throw new BadRequestException('Wallet is not active');
      }

      if (!wallet.hasSufficientBalance(pricing.total)) {
        throw new BadRequestException(
          `Insufficient wallet balance. Required: ₹${pricing.total.toFixed(2)}, Available: ₹${wallet.getBalance().toFixed(2)}`,
        );
      }
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

    // Step 6.5: Process wallet payment after order creation
    if (paymentMethod === 'wallet') {
      const wallet = await this.walletRepository.findByCustomerId(customerId);

      if (wallet) {
        const newBalance = wallet.getBalance() - pricing.total;

        // Create wallet transaction
        const transaction = WalletTransaction.create(
          uuidv4(),
          wallet.getId(),
          pricing.total,
          WalletTransactionType.DEBIT,
          WalletTransactionStatus.COMPLETED,
          `Payment for order ${order.orderNumber}`,
          null,
          order.id,
          null,
        );

        // Save transaction and update balance atomically
        await this.walletRepository.createTransactionWithBalanceUpdate(
          transaction,
          newBalance,
        );

        // Update order payment status to paid
        await this.prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: 'paid' },
        });

        order.paymentStatus = 'paid';
      }
    }

    // Step 7: Clear cart after successful order creation (for COD and wallet payments)
    // For Razorpay payments, cart will be cleared after successful payment verification
    if (
      source === CheckoutSource.CART &&
      (paymentMethod === 'cod' || paymentMethod === 'wallet')
    ) {
      try {
        await this.prisma.cart.update({
          where: { customerId },
          data: {
            items: {
              deleteMany: {},
            },
          },
        });
      } catch (error) {
        // Log but don't fail the order creation if cart clearing fails
        console.warn('Failed to clear cart after order creation:', error);
      }
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
   * Create order in a database
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
        position: 'asc', // Get the primary image (the lowest position)
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
    return this.prisma.order.create({
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
  }
}
