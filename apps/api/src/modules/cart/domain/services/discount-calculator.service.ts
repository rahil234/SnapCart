import { Injectable } from '@nestjs/common';

import { Offer } from '@/modules/offer/domain/entities';
import { Coupon } from '@/modules/coupon/domain/entities';

export interface DiscountedItem {
  productId: string;
  variantId: string;
  originalPrice: number;
  quantity: number;
  offerDiscount: number;
  appliedOffer?: {
    id: string;
    name: string;
    discount: number;
  };
  finalPrice: number;
}

export interface CartPricing {
  subtotal: number;
  offerDiscount: number;
  couponDiscount: number;
  totalDiscount: number;
  finalTotal: number;
  appliedOfferIds: string[];
  appliedCouponCode?: string;
  savings: number;
}

/**
 * Discount Calculator Domain Service
 * Handles complex discount calculations with stacking rules
 */
@Injectable()
export class DiscountCalculatorService {
  /**
   * Calculate best offer for a single product/variant
   * Selects highest discount from applicable offers based on priority
   */
  calculateBestOfferForProduct(
    originalPrice: number,
    productId: string,
    categoryId: string,
    offers: Offer[],
  ): { discount: number; offer?: Offer } {
    // Filter applicable offers
    const applicableOffers = offers.filter(
      (offer) =>
        offer.isActive() &&
        offer.validateMinPurchaseAmount(originalPrice) &&
        (offer.isApplicableToProduct(productId) ||
          offer.isApplicableToCategory(categoryId)),
    );

    if (applicableOffers.length === 0) {
      return { discount: 0 };
    }

    // Sort by priority (desc) then by discount amount (desc)
    applicableOffers.sort((a, b) => {
      if (a.getPriority() !== b.getPriority()) {
        return b.getPriority() - a.getPriority();
      }
      const discountA = a.calculateDiscountAmount(originalPrice);
      const discountB = b.calculateDiscountAmount(originalPrice);
      return discountB - discountA;
    });

    const bestOffer = applicableOffers[0];
    const discount = bestOffer.calculateDiscountAmount(originalPrice);

    return { discount, offer: bestOffer };
  }

  /**
   * Calculate discounts for all cart items
   * Applies non-stackable offer rules
   */
  calculateCartOffers(
    items: Array<{
      productId: string;
      variantId: string;
      categoryId: string;
      price: number;
      quantity: number;
    }>,
    offers: Offer[],
  ): {
    discountedItems: DiscountedItem[];
    totalOfferDiscount: number;
    appliedOfferIds: string[];
  } {
    const discountedItems: DiscountedItem[] = [];
    const appliedOfferIds = new Set<string>();
    let totalOfferDiscount = 0;

    for (const item of items) {
      const itemTotal = item.price * item.quantity;
      const { discount, offer } = this.calculateBestOfferForProduct(
        item.price,
        item.productId,
        item.categoryId,
        offers,
      );

      const itemDiscount = discount * item.quantity;
      totalOfferDiscount += itemDiscount;

      if (offer) {
        appliedOfferIds.add(offer.getId());
      }

      discountedItems.push({
        productId: item.productId,
        variantId: item.variantId,
        originalPrice: item.price,
        quantity: item.quantity,
        offerDiscount: itemDiscount,
        appliedOffer: offer
          ? {
              id: offer.getId(),
              name: offer.getName(),
              discount: discount,
            }
          : undefined,
        finalPrice: itemTotal - itemDiscount,
      });
    }

    return {
      discountedItems,
      totalOfferDiscount,
      appliedOfferIds: Array.from(appliedOfferIds),
    };
  }

  /**
   * Apply coupon to cart after offers
   * Validates stacking rules and calculates final discount
   */
  applyCouponToCart(
    subtotalAfterOffers: number,
    coupon: Coupon,
    userUsageCount: number,
    hasNonStackableOffers: boolean,
  ): {
    valid: boolean;
    discount: number;
    reason?: string;
  } {
    // Check if coupon can be stacked
    if (hasNonStackableOffers && !coupon.canStack()) {
      return {
        valid: false,
        discount: 0,
        reason: 'This coupon cannot be combined with active offers',
      };
    }

    // Validate coupon
    const validation = coupon.validateForCart(
      subtotalAfterOffers,
      userUsageCount,
    );
    if (!validation.valid) {
      return {
        valid: false,
        discount: 0,
        reason: validation.reason,
      };
    }

    // Calculate discount
    const discount = coupon.calculateDiscount(subtotalAfterOffers);

    return {
      valid: true,
      discount,
    };
  }

  /**
   * Calculate complete cart pricing with offers and coupon
   * Master method that combines all discount logic
   */
  calculateFinalPricing(
    items: Array<{
      productId: string;
      variantId: string;
      categoryId: string;
      price: number;
      quantity: number;
    }>,
    offers: Offer[],
    coupon?: Coupon,
    userCouponUsageCount: number = 0,
  ): CartPricing & { discountedItems: DiscountedItem[] } {
    // Calculate subtotal
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Apply offers
    const { discountedItems, totalOfferDiscount, appliedOfferIds } =
      this.calculateCartOffers(items, offers);

    const subtotalAfterOffers = subtotal - totalOfferDiscount;

    // Check if any non-stackable offers were applied
    const hasNonStackableOffers = offers
      .filter((o) => appliedOfferIds.includes(o.getId()))
      .some((o) => !o.canStack());

    // Apply coupon if provided
    let couponDiscount = 0;
    let appliedCouponCode: string | undefined;

    if (coupon) {
      const couponResult = this.applyCouponToCart(
        subtotalAfterOffers,
        coupon,
        userCouponUsageCount,
        hasNonStackableOffers,
      );

      if (couponResult.valid) {
        couponDiscount = couponResult.discount;
        appliedCouponCode = coupon.getCode();
      }
    }

    const totalDiscount = totalOfferDiscount + couponDiscount;
    const finalTotal = Math.max(0, subtotal - totalDiscount);

    return {
      discountedItems,
      subtotal,
      offerDiscount: totalOfferDiscount,
      couponDiscount,
      totalDiscount,
      finalTotal,
      appliedOfferIds,
      appliedCouponCode,
      savings: totalDiscount,
    };
  }

  /**
   * Validate if coupon can be applied to current cart
   * Used for real-time validation before applying
   */
  validateCouponForCart(
    cartTotal: number,
    coupon: Coupon,
    userUsageCount: number,
    hasActiveOffers: boolean,
  ): {
    valid: boolean;
    discount?: number;
    reason?: string;
  } {
    if (hasActiveOffers && !coupon.canStack()) {
      return {
        valid: false,
        reason: 'This coupon cannot be combined with active offers',
      };
    }

    const validation = coupon.validateForCart(cartTotal, userUsageCount);
    if (!validation.valid) {
      return validation;
    }

    const discount = coupon.calculateDiscount(cartTotal);
    return {
      valid: true,
      discount,
    };
  }
}
