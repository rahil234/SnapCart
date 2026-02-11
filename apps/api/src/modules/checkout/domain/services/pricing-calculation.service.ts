import { Injectable } from '@nestjs/common';
import { OrderPricingSnapshot, CouponSnapshot } from '../entities';
import { Coupon } from '../../../coupon/domain/entities/coupon.entity';

/**
 * Cart Item with Product Pricing
 */
export interface CartItemWithPricing {
  variantId: string;
  productId: string;
  quantity: number;
  basePrice: number;
  discountPercent: number;
}

/**
 * PricingCalculationService
 * Domain service for calculating order pricing
 *
 * Pricing Order:
 * 1. Base product price
 * 2. Product discount percentage
 * 3. Coupon discount (order-level, platform-funded)
 */
@Injectable()
export class PricingCalculationService {
  /**
   * Calculate complete pricing breakdown
   */
  calculatePricing(
    items: CartItemWithPricing[],
    coupon: Coupon | null,
    userCouponUsageCount: number,
  ): OrderPricingSnapshot {
    // Step 1: Calculate subtotal and product discounts
    let subtotal = 0;
    let productDiscount = 0;

    for (const item of items) {
      const itemSubtotal = item.basePrice * item.quantity;
      subtotal += itemSubtotal;

      // Apply product-level discount
      if (item.discountPercent > 0) {
        const itemDiscount = (itemSubtotal * item.discountPercent) / 100;
        productDiscount += itemDiscount;
      }
    }

    // Subtotal after product discount
    const subtotalAfterProductDiscount = subtotal - productDiscount;

    // Step 2: Apply coupon discount (order-level)
    let couponDiscount = 0;
    let couponSnapshot: CouponSnapshot | null = null;

    if (coupon) {
      // Validate coupon can be applied
      const validation = coupon.validateForCart(
        subtotalAfterProductDiscount,
        userCouponUsageCount,
      );

      if (validation.valid) {
        couponDiscount = coupon.calculateDiscount(
          subtotalAfterProductDiscount,
        );

        // Create coupon snapshot
        couponSnapshot = CouponSnapshot.create(
          coupon.getCode(),
          coupon.getType(),
          coupon.getDiscount(),
          couponDiscount,
        );
      }
    }

    // Step 3: Calculate other charges
    const offerDiscount = 0; // Not implemented yet
    const shippingCharge = 0; // Free shipping for now
    const tax = 0; // Tax calculation not implemented

    // Final total
    const total =
      subtotalAfterProductDiscount -
      couponDiscount -
      offerDiscount +
      shippingCharge +
      tax;

    return OrderPricingSnapshot.create(
      subtotal,
      productDiscount,
      couponDiscount,
      offerDiscount,
      shippingCharge,
      tax,
      Math.max(0, total), // Ensure total is never negative
      couponSnapshot,
    );
  }

  /**
   * Validate coupon can be applied to cart
   */
  validateCoupon(
    coupon: Coupon,
    subtotalAfterProductDiscount: number,
    userCouponUsageCount: number,
  ): { valid: boolean; reason?: string } {
    return coupon.validateForCart(
      subtotalAfterProductDiscount,
      userCouponUsageCount,
    );
  }
}
