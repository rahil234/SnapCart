import { v4 as uuid } from 'uuid';
import { OfferType, OfferStatus } from '@/modules/offer/domain/enums';

export class Offer {
  private constructor(
    public readonly id: string,
    private name: string,
    private type: OfferType,
    private discount: number,
    private startDate: Date,
    private endDate: Date,
    private status: OfferStatus,
    private categories: string[],
    private products: string[],
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
    categories: string[] = [],
    products: string[] = [],
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

    return new Offer(
      uuid(),
      name,
      type,
      discount,
      startDate,
      endDate,
      OfferStatus.ACTIVE,
      categories,
      products,
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
    startDate: Date,
    endDate: Date,
    status: OfferStatus,
    categories: string[],
    products: string[],
    createdAt: Date,
    updatedAt: Date,
  ): Offer {
    return new Offer(
      id,
      name,
      type,
      discount,
      startDate,
      endDate,
      status,
      categories,
      products,
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

  calculateDiscountAmount(originalPrice: number): number {
    if (!this.isActive()) return 0;

    if (this.type === OfferType.PERCENTAGE) {
      return (originalPrice * this.discount) / 100;
    } else {
      return Math.min(this.discount, originalPrice);
    }
  }

  updateDetails(
    name?: string,
    type?: OfferType,
    discount?: number,
    startDate?: Date,
    endDate?: Date,
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
    if (startDate) this.startDate = startDate;
    if (endDate) {
      if (endDate <= this.startDate) {
        throw new Error('End date must be after start date');
      }
      this.endDate = endDate;
    }
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

  getStartDate(): Date {
    return this.startDate;
  }

  getEndDate(): Date {
    return this.endDate;
  }

  getStatus(): OfferStatus {
    return this.status;
  }

  getCategories(): string[] {
    return [...this.categories];
  }

  getProducts(): string[] {
    return [...this.products];
  }
}
