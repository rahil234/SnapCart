/**
 * CouponSnapshot Value Object
 * Represents a snapshot of coupon data at the time of order
 * Immutable - stores historical state
 */
export class CouponSnapshot {
  private constructor(
    public readonly code: string,
    public readonly type: string, // 'PERCENTAGE' | 'FIXED'
    public readonly discount: number,
    public readonly discountApplied: number,
  ) {}

  static create(
    code: string,
    type: string,
    discount: number,
    discountApplied: number,
  ): CouponSnapshot {
    if (!code || code.trim().length === 0) {
      throw new Error('Coupon code is required');
    }

    if (discount <= 0) {
      throw new Error('Discount must be greater than 0');
    }

    if (discountApplied < 0) {
      throw new Error('Discount applied cannot be negative');
    }

    return new CouponSnapshot(
      code.toUpperCase().trim(),
      type,
      discount,
      discountApplied,
    );
  }

  static from(
    code: string,
    type: string,
    discount: number,
    discountApplied: number,
  ): CouponSnapshot {
    return new CouponSnapshot(code, type, discount, discountApplied);
  }

  toJSON() {
    return {
      code: this.code,
      type: this.type,
      discount: this.discount,
      discountApplied: this.discountApplied,
    };
  }
}
