import { CouponSnapshot } from './coupon-snapshot.entity';

/**
 * OrderPricingSnapshot Value Object
 * Represents complete pricing breakdown for an order
 * Immutable - stores pricing state at checkout time
 */
export class OrderPricingSnapshot {
  private constructor(
    public readonly subtotal: number,
    public readonly productDiscount: number,
    public readonly couponDiscount: number,
    public readonly offerDiscount: number,
    public readonly shippingCharge: number,
    public readonly tax: number,
    public readonly total: number,
    public readonly couponSnapshot: CouponSnapshot | null,
  ) {}

  static create(
    subtotal: number,
    productDiscount: number,
    couponDiscount: number,
    offerDiscount: number,
    shippingCharge: number,
    tax: number,
    total: number,
    couponSnapshot: CouponSnapshot | null = null,
  ): OrderPricingSnapshot {
    if (subtotal < 0) {
      throw new Error('Subtotal cannot be negative');
    }

    if (productDiscount < 0) {
      throw new Error('Product discount cannot be negative');
    }

    if (couponDiscount < 0) {
      throw new Error('Coupon discount cannot be negative');
    }

    if (offerDiscount < 0) {
      throw new Error('Offer discount cannot be negative');
    }

    if (shippingCharge < 0) {
      throw new Error('Shipping charge cannot be negative');
    }

    if (tax < 0) {
      throw new Error('Tax cannot be negative');
    }

    if (total < 0) {
      throw new Error('Total cannot be negative');
    }

    return new OrderPricingSnapshot(
      subtotal,
      productDiscount,
      couponDiscount,
      offerDiscount,
      shippingCharge,
      tax,
      total,
      couponSnapshot,
    );
  }

  static from(
    subtotal: number,
    productDiscount: number,
    couponDiscount: number,
    offerDiscount: number,
    shippingCharge: number,
    tax: number,
    total: number,
    couponSnapshot: CouponSnapshot | null = null,
  ): OrderPricingSnapshot {
    return new OrderPricingSnapshot(
      subtotal,
      productDiscount,
      couponDiscount,
      offerDiscount,
      shippingCharge,
      tax,
      total,
      couponSnapshot,
    );
  }

  toJSON() {
    return {
      subtotal: this.subtotal,
      productDiscount: this.productDiscount,
      couponDiscount: this.couponDiscount,
      offerDiscount: this.offerDiscount,
      shippingCharge: this.shippingCharge,
      tax: this.tax,
      total: this.total,
      couponSnapshot: this.couponSnapshot?.toJSON() || null,
    };
  }
}
