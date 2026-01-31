import { v4 as uuid } from 'uuid';

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
}

export class Product {
  private constructor(
    public readonly id: string,
    private name: string,
    private description: string,
    private categoryId: string,
    private price: number,
    private discountPercent: number | null,
    private status: ProductStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  // Factory method for creating new products
  static create(
    name: string,
    description: string,
    categoryId: string,
    price: number,
    discountPercent: number | null = null,
  ): Product {
    if (price <= 0) {
      throw new Error('Product price must be greater than 0');
    }

    if (discountPercent && (discountPercent < 0 || discountPercent > 100)) {
      throw new Error('Discount percent must be between 0 and 100');
    }

    return new Product(
      uuid(),
      name,
      description,
      categoryId,
      price,
      discountPercent,
      ProductStatus.ACTIVE,
      new Date(),
      new Date(),
    );
  }

  // Factory method for reconstructing from persistence
  static from(
    id: string,
    name: string,
    description: string,
    categoryId: string,
    price: number,
    discountPercent: number | null,
    status: ProductStatus,
    createdAt: Date,
    updatedAt: Date,
  ): Product {
    return new Product(
      id,
      name,
      description,
      categoryId,
      price,
      discountPercent,
      status,
      createdAt,
      updatedAt,
    );
  }

  // Business methods
  activate(): void {
    if (this.status === ProductStatus.DISCONTINUED) {
      throw new Error('Cannot activate discontinued product');
    }
    this.status = ProductStatus.ACTIVE;
  }

  deactivate(): void {
    this.status = ProductStatus.INACTIVE;
  }

  discontinue(): void {
    this.status = ProductStatus.DISCONTINUED;
  }

  markOutOfStock(): void {
    this.status = ProductStatus.OUT_OF_STOCK;
  }

  updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new Error('Price must be greater than 0');
    }
    this.price = newPrice;
  }

  applyDiscount(discountPercent: number): void {
    if (discountPercent < 0 || discountPercent > 100) {
      throw new Error('Discount percent must be between 0 and 100');
    }
    this.discountPercent = discountPercent;
  }

  removeDiscount(): void {
    this.discountPercent = null;
  }

  updateDetails(name: string, description: string): void {
    if (!name?.trim()) {
      throw new Error('Product name is required');
    }
    this.name = name.trim();
    this.description = description?.trim() || '';
  }

  // Getters
  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getCategoryId(): string {
    return this.categoryId;
  }

  getPrice(): number {
    return this.price;
  }

  getDiscountPercent(): number | null {
    return this.discountPercent;
  }

  getFinalPrice(): number {
    if (this.discountPercent) {
      return this.price - (this.price * this.discountPercent) / 100;
    }
    return this.price;
  }

  getStatus(): ProductStatus {
    return this.status;
  }

  isActive(): boolean {
    return this.status === ProductStatus.ACTIVE;
  }

  isAvailable(): boolean {
    return (
      this.status === ProductStatus.ACTIVE ||
      this.status === ProductStatus.INACTIVE
    );
  }

  hasDiscount(): boolean {
    return this.discountPercent !== null && this.discountPercent > 0;
  }
}
