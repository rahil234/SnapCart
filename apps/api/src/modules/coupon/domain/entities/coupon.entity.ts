import cuid from '@paralleldrive/cuid2';
import { CouponType, CouponStatus, Applicability } from '../enums';

/**
 * Coupon Aggregate Root
 * Manages coupon lifecycle and business rules
 */
export class Coupon {
  private constructor(
    public readonly id: string,
    private code: string,
    private type: CouponType,
    private discount: number,
    private minAmount: number,
    private maxDiscount: number | undefined,
    private startDate: Date,
    private endDate: Date,
    private status: CouponStatus,
    private usageLimit: number | undefined,
    private usedCount: number,
    private maxUsagePerUser: number,
    private applicableTo: Applicability,
    private isStackable: boolean,
    private description: string | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  // Factory method for creating new coupons
  static create(
    code: string,
    type: CouponType,
    discount: number,
    minAmount: number,
    startDate: Date,
    endDate: Date,
    maxDiscount?: number,
    usageLimit?: number,
    maxUsagePerUser: number = 1,
    applicableTo: Applicability = Applicability.ALL,
    isStackable: boolean = false,
    description?: string,
  ): Coupon {
    // Validation
    if (!code || code.trim().length === 0) {
      throw new Error('Coupon code is required');
    }

    if (discount <= 0) {
      throw new Error('Discount must be greater than 0');
    }

    if (type === CouponType.PERCENTAGE && discount > 100) {
      throw new Error('Percentage discount cannot exceed 100%');
    }

    if (endDate <= startDate) {
      throw new Error('End date must be after start date');
    }

    if (minAmount < 0) {
      throw new Error('Minimum amount cannot be negative');
    }

    if (maxDiscount !== undefined && maxDiscount <= 0) {
      throw new Error('Max discount must be greater than 0');
    }

    if (usageLimit !== undefined && usageLimit <= 0) {
      throw new Error('Usage limit must be greater than 0');
    }

    if (maxUsagePerUser <= 0) {
      throw new Error('Max usage per user must be greater than 0');
    }

    return new Coupon(
      cuid.createId(),
      code.toUpperCase().trim(),
      type,
      discount,
      minAmount,
      maxDiscount,
      startDate,
      endDate,
      CouponStatus.ACTIVE,
      usageLimit,
      0, // usedCount starts at 0
      maxUsagePerUser,
      applicableTo,
      isStackable,
      description,
      new Date(),
      new Date(),
    );
  }

  // Factory method for reconstructing from persistence
  static from(
    id: string,
    code: string,
    type: CouponType,
    discount: number,
    minAmount: number,
    maxDiscount: number | undefined,
    startDate: Date,
    endDate: Date,
    status: CouponStatus,
    usageLimit: number | undefined,
    usedCount: number,
    maxUsagePerUser: number,
    applicableTo: Applicability,
    isStackable: boolean,
    description: string | undefined,
    createdAt: Date,
    updatedAt: Date,
  ): Coupon {
    return new Coupon(
      id,
      code,
      type,
      discount,
      minAmount,
      maxDiscount,
      startDate,
      endDate,
      status,
      usageLimit,
      usedCount,
      maxUsagePerUser,
      applicableTo,
      isStackable,
      description,
      createdAt,
      updatedAt,
    );
  }

  // ============================================
  // BUSINESS METHODS
  // ============================================

  /**
   * Activate the coupon
   */
  activate(): void {
    if (this.isExpired()) {
      throw new Error('Cannot activate an expired coupon');
    }
    this.status = CouponStatus.ACTIVE;
  }

  /**
   * Deactivate the coupon
   */
  deactivate(): void {
    this.status = CouponStatus.INACTIVE;
  }

  /**
   * Mark coupon as expired
   */
  expire(): void {
    this.status = CouponStatus.EXPIRED;
  }

  /**
   * Check if coupon is active and valid
   */
  isActive(): boolean {
    const now = new Date();
    return (
      this.status === CouponStatus.ACTIVE &&
      now >= this.startDate &&
      now <= this.endDate
    );
  }

  /**
   * Check if coupon is expired
   */
  isExpired(): boolean {
    return new Date() > this.endDate || this.status === CouponStatus.EXPIRED;
  }

  /**
   * Check if coupon has reached usage limit
   */
  isWithinUsageLimit(): boolean {
    if (this.usageLimit === undefined) return true;
    return this.usedCount < this.usageLimit;
  }

  /**
   * Check if user can use this coupon based on their usage count
   */
  canBeUsedBy(userUsageCount: number): boolean {
    return userUsageCount < this.maxUsagePerUser;
  }

  /**
   * Validate if coupon can be applied to a cart
   */
  validateForCart(cartTotal: number, userUsageCount: number): {
    valid: boolean;
    reason?: string;
  } {
    if (!this.isActive()) {
      return { valid: false, reason: 'Coupon is not active' };
    }

    if (this.isExpired()) {
      return { valid: false, reason: 'Coupon has expired' };
    }

    if (!this.isWithinUsageLimit()) {
      return { valid: false, reason: 'Coupon usage limit reached' };
    }

    if (!this.canBeUsedBy(userUsageCount)) {
      return {
        valid: false,
        reason: `You have already used this coupon ${this.maxUsagePerUser} time(s)`,
      };
    }

    if (cartTotal < this.minAmount) {
      return {
        valid: false,
        reason: `Minimum cart value of ₹${this.minAmount} required`,
      };
    }

    return { valid: true };
  }

  /**
   * Check if coupon meets minimum cart amount requirement
   */
  validateMinAmount(cartTotal: number): boolean {
    return cartTotal >= this.minAmount;
  }

  /**
   * Check if coupon can be stacked with other offers
   */
  canStack(): boolean {
    return this.isStackable;
  }

  /**
   * Calculate discount amount for a given cart total
   */
  calculateDiscount(cartTotal: number): number {
    if (!this.validateMinAmount(cartTotal)) {
      return 0;
    }

    let discountAmount = 0;

    if (this.type === CouponType.PERCENTAGE) {
      discountAmount = (cartTotal * this.discount) / 100;
    } else {
      discountAmount = this.discount;
    }

    // Apply max discount cap if specified
    if (this.maxDiscount !== undefined) {
      discountAmount = Math.min(discountAmount, this.maxDiscount);
    }

    // Ensure discount doesn't exceed cart total
    return Math.min(discountAmount, cartTotal);
  }

  /**
   * Increment used count when coupon is applied
   */
  incrementUsedCount(): void {
    this.usedCount += 1;
  }

  /**
   * Update coupon details
   */
  updateDetails(
    code?: string,
    type?: CouponType,
    discount?: number,
    minAmount?: number,
    maxDiscount?: number,
    startDate?: Date,
    endDate?: Date,
    usageLimit?: number,
    maxUsagePerUser?: number,
    applicableTo?: Applicability,
    isStackable?: boolean,
    description?: string,
  ): void {
    if (code !== undefined) {
      if (!code || code.trim().length === 0) {
        throw new Error('Coupon code is required');
      }
      this.code = code.toUpperCase().trim();
    }

    if (type !== undefined) {
      this.type = type;
    }

    if (discount !== undefined) {
      if (discount <= 0) {
        throw new Error('Discount must be greater than 0');
      }
      if (this.type === CouponType.PERCENTAGE && discount > 100) {
        throw new Error('Percentage discount cannot exceed 100%');
      }
      this.discount = discount;
    }

    if (minAmount !== undefined) {
      if (minAmount < 0) {
        throw new Error('Minimum amount cannot be negative');
      }
      this.minAmount = minAmount;
    }

    if (maxDiscount !== undefined) {
      if (maxDiscount <= 0) {
        throw new Error('Max discount must be greater than 0');
      }
      this.maxDiscount = maxDiscount;
    }

    if (startDate !== undefined) {
      this.startDate = startDate;
    }

    if (endDate !== undefined) {
      if (endDate <= this.startDate) {
        throw new Error('End date must be after start date');
      }
      this.endDate = endDate;
    }

    if (usageLimit !== undefined) {
      if (usageLimit <= 0) {
        throw new Error('Usage limit must be greater than 0');
      }
      this.usageLimit = usageLimit;
    }

    if (maxUsagePerUser !== undefined) {
      if (maxUsagePerUser <= 0) {
        throw new Error('Max usage per user must be greater than 0');
      }
      this.maxUsagePerUser = maxUsagePerUser;
    }

    if (applicableTo !== undefined) {
      this.applicableTo = applicableTo;
    }

    if (isStackable !== undefined) {
      this.isStackable = isStackable;
    }

    if (description !== undefined) {
      this.description = description;
    }
  }

  // ============================================
  // GETTERS
  // ============================================

  getId(): string {
    return this.id;
  }

  getCode(): string {
    return this.code;
  }

  getType(): CouponType {
    return this.type;
  }

  getDiscount(): number {
    return this.discount;
  }

  getMinAmount(): number {
    return this.minAmount;
  }

  getMaxDiscount(): number | undefined {
    return this.maxDiscount;
  }

  getStartDate(): Date {
    return this.startDate;
  }

  getEndDate(): Date {
    return this.endDate;
  }

  getStatus(): CouponStatus {
    return this.status;
  }

  getUsageLimit(): number | undefined {
    return this.usageLimit;
  }

  getUsedCount(): number {
    return this.usedCount;
  }

  getMaxUsagePerUser(): number {
    return this.maxUsagePerUser;
  }

  getApplicableTo(): Applicability {
    return this.applicableTo;
  }

  getIsStackable(): boolean {
    return this.isStackable;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
