import cuid from '@paralleldrive/cuid2';

/**
 * Coupon Usage Entity
 * Tracks individual coupon usage for audit trail
 */
export class CouponUsage {
  private constructor(
    public readonly id: string,
    private readonly couponId: string,
    private readonly userId: string,
    private readonly orderId: string | undefined,
    private readonly discountApplied: number,
    public readonly usedAt: Date,
  ) {}

  // Factory method for creating new usage record
  static create(
    couponId: string,
    userId: string,
    discountApplied: number,
    orderId?: string,
  ): CouponUsage {
    if (!couponId) {
      throw new Error('Coupon ID is required');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    if (discountApplied < 0) {
      throw new Error('Discount applied cannot be negative');
    }

    return new CouponUsage(
      cuid.createId(),
      couponId,
      userId,
      orderId,
      discountApplied,
      new Date(),
    );
  }

  // Factory method for reconstructing from persistence
  static from(
    id: string,
    couponId: string,
    userId: string,
    orderId: string | undefined,
    discountApplied: number,
    usedAt: Date,
  ): CouponUsage {
    return new CouponUsage(
      id,
      couponId,
      userId,
      orderId,
      discountApplied,
      usedAt,
    );
  }

  // ============================================
  // GETTERS
  // ============================================

  getId(): string {
    return this.id;
  }

  getCouponId(): string {
    return this.couponId;
  }

  getUserId(): string {
    return this.userId;
  }

  getOrderId(): string | undefined {
    return this.orderId;
  }

  getDiscountApplied(): number {
    return this.discountApplied;
  }

  getUsedAt(): Date {
    return this.usedAt;
  }
}
