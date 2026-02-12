import { v4 as uuid } from 'uuid';
import { OfferStatus, OfferType } from '@/modules/offer/domain/enums';

export class Offer {
  private constructor(
    public readonly id: string,
    private name: string,
    private type: OfferType,
    private discount: number,
    private minPurchaseAmount: number,
    private maxDiscount: number | undefined,
    private priority: number,
    private startDate: Date,
    private endDate: Date,
    private status: OfferStatus,
    private isStackable: boolean,
    private categories: string[],
    private products: string[],
    private description: string | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  // Factory method for creating new offers
  static create(
    name: string,
    type: OfferType,
    discount: number,
    startDate: Date,
    endDate: Date,
    minPurchaseAmount: number = 0,
    maxDiscount?: number,
    priority: number = 0,
    categories: string[] = [],
    products: string[] = [],
    isStackable: boolean = false,
    description?: string,
  ): Offer {
    if (discount <= 0) {
      throw new Error('Discount must be greater than 0');
    }

    if (type === OfferType.PERCENTAGE && discount > 100) {
      throw new Error('Percentage discount cannot exceed 100%');
    }

    if (endDate <= startDate) {
      throw new Error('End date must be after start date');
    }

    if (minPurchaseAmount < 0) {
      throw new Error('Minimum purchase amount cannot be negative');
    }

    if (maxDiscount !== undefined && maxDiscount <= 0) {
      throw new Error('Max discount must be greater than 0');
    }

    return new Offer(
      uuid(),
      name,
      type,
      discount,
      minPurchaseAmount,
      maxDiscount,
      priority,
      startDate,
      endDate,
      OfferStatus.ACTIVE,
      isStackable,
      categories,
      products,
      description,
      new Date(),
      new Date(),
    );
  }

  // Factory method for reconstructing from persistence
  static from(
    id: string,
    name: string,
    type: OfferType,
    discount: number,
    minPurchaseAmount: number,
    maxDiscount: number | undefined,
    priority: number,
    startDate: Date,
    endDate: Date,
    status: OfferStatus,
    isStackable: boolean,
    categories: string[],
    products: string[],
    description: string | undefined,
    createdAt: Date,
    updatedAt: Date,
  ): Offer {
    return new Offer(
      id,
      name,
      type,
      discount,
      minPurchaseAmount,
      maxDiscount,
      priority,
      startDate,
      endDate,
      status,
      isStackable,
      categories,
      products,
      description,
      createdAt,
      updatedAt,
    );
  }

  // Business methods
  activate(): void {
    this.status = OfferStatus.ACTIVE;
  }

  deactivate(): void {
    this.status = OfferStatus.INACTIVE;
  }

  expire(): void {
    this.status = OfferStatus.EXPIRED;
  }

  isActive(): boolean {
    const now = new Date();
    return (
      this.status === OfferStatus.ACTIVE &&
      now >= this.startDate &&
      now <= this.endDate
    );
  }

  isExpired(): boolean {
    return new Date() > this.endDate || this.status === OfferStatus.EXPIRED;
  }

  isApplicableToProduct(productId: string): boolean {
    if (this.products.length === 0) return false;
    return this.products.includes(productId);
  }

  isApplicableToCategory(categoryId: string): boolean {
    if (this.categories.length === 0) return false;
    return this.categories.includes(categoryId);
  }

  /**
   * Check if offer meets minimum purchase amount requirement
   */
  validateMinPurchaseAmount(amount: number): boolean {
    return amount >= this.minPurchaseAmount;
  }

  /**
   * Check if offer can be stacked with other offers/coupons
   */
  canStack(): boolean {
    return this.isStackable;
  }

  /**
   * Calculate discount amount for a given price with max discount cap
   */
  calculateDiscountAmount(originalPrice: number): number {
    if (!this.isActive()) return 0;
    if (!this.validateMinPurchaseAmount(originalPrice)) return 0;

    let discountAmount = 0;

    if (this.type === OfferType.PERCENTAGE) {
      discountAmount = (originalPrice * this.discount) / 100;
    } else {
      discountAmount = Math.min(this.discount, originalPrice);
    }

    // Apply max discount cap if specified
    if (this.maxDiscount !== undefined) {
      discountAmount = Math.min(discountAmount, this.maxDiscount);
    }

    // Ensure discount doesn't exceed original price
    return Math.min(discountAmount, originalPrice);
  }

  updateDetails(
    name?: string,
    type?: OfferType,
    discount?: number,
    minPurchaseAmount?: number,
    maxDiscount?: number,
    priority?: number,
    startDate?: Date,
    endDate?: Date,
    isStackable?: boolean,
    description?: string,
  ): void {
    if (name) this.name = name;
    if (type) this.type = type;
    if (discount !== undefined) {
      if (discount <= 0) throw new Error('Discount must be greater than 0');
      if (type === OfferType.PERCENTAGE && discount > 100) {
        throw new Error('Percentage discount cannot exceed 100%');
      }
      this.discount = discount;
    }
    if (minPurchaseAmount !== undefined) {
      if (minPurchaseAmount < 0) {
        throw new Error('Minimum purchase amount cannot be negative');
      }
      this.minPurchaseAmount = minPurchaseAmount;
    }
    if (maxDiscount !== undefined) {
      if (maxDiscount <= 0) {
        throw new Error('Max discount must be greater than 0');
      }
      this.maxDiscount = maxDiscount;
    }
    if (priority !== undefined) this.priority = priority;
    if (startDate) this.startDate = startDate;
    if (endDate) {
      if (endDate <= this.startDate) {
        throw new Error('End date must be after start date');
      }
      this.endDate = endDate;
    }
    if (isStackable !== undefined) this.isStackable = isStackable;
    if (description !== undefined) this.description = description;
  }

  updateApplicability(categories?: string[], products?: string[]): void {
    if (categories) this.categories = categories;
    if (products) this.products = products;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getType(): OfferType {
    return this.type;
  }

  getDiscount(): number {
    return this.discount;
  }

  getMinPurchaseAmount(): number {
    return this.minPurchaseAmount;
  }

  getMaxDiscount(): number | undefined {
    return this.maxDiscount;
  }

  getPriority(): number {
    return this.priority;
  }

  getStartDate(): Date {
    return this.startDate;
  }

  getEndDate(): Date {
    return this.endDate;
  }

  getStatus(): OfferStatus {
    return this.status;
  }

  getIsStackable(): boolean {
    return this.isStackable;
  }

  getCategories(): string[] {
    return [...this.categories];
  }

  getProducts(): string[] {
    return [...this.products];
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
