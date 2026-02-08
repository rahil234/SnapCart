import { v4 as uuid } from 'uuid';

/**
 * Variant Status - Commerce Level
 * active: Available for purchase
 * inactive: Temporarily unavailable
 * out_of_stock: No inventory available
 */
export enum VariantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

/**
 * ProductVariant Entity
 *
 * This is the SELLABLE UNIT in the system.
 * Images are stored as array of URL strings (max 6)
 */
export class ProductVariant {
  private constructor(
    public readonly id: string,
    private readonly productId: string,
    private variantName: string,
    private price: number,
    private discountPercent: number,
    private stock: number,
    private status: VariantStatus,
    private isActive: boolean,
    private isDeleted: boolean,
    private sellerProfileId: string,
    private attributes: Record<string, any> | null,
    private imageUrls: string[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    productId: string,
    variantName: string,
    price: number,
    stock: number,
    sellerProfileId: string,
    discountPercent: number = 0,
    attributes: Record<string, any> | null = null,
  ): ProductVariant {
    // Validations
    if (!productId?.trim()) {
      throw new Error('Product ID is required');
    }

    if (!variantName?.trim()) {
      throw new Error('Variant name is required');
    }

    if (price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    if (stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    if (discountPercent < 0 || discountPercent > 100) {
      throw new Error('Discount percent must be between 0 and 100');
    }

    return new ProductVariant(
      uuid(),
      productId.trim(),
      variantName.trim(),
      price,
      discountPercent,
      stock,
      stock > 0 ? VariantStatus.ACTIVE : VariantStatus.OUT_OF_STOCK,
      true,
      false,
      sellerProfileId,
      attributes,
      [],
      new Date(),
      new Date(),
    );
  }

  static from(
    id: string,
    productId: string,
    sku: string,
    variantName: string,
    price: number,
    discountPercent: number,
    stock: number,
    status: VariantStatus,
    isActive: boolean,
    isDeleted: boolean,
    sellerProfileId: string,
    attributes: Record<string, any> | null,
    imageUrls: string[] = [],
    createdAt: Date,
    updatedAt: Date,
  ): ProductVariant {
    return new ProductVariant(
      id,
      productId,
      variantName,
      price,
      discountPercent,
      stock,
      status,
      isActive,
      isDeleted,
      sellerProfileId,
      attributes,
      imageUrls,
      createdAt,
      updatedAt,
    );
  }

  updateDetails(
    variantName?: string,
    attributes?: Record<string, any> | null,
  ): void {
    if (variantName !== undefined) {
      if (!variantName?.trim()) {
        throw new Error('Variant name cannot be empty');
      }
      this.variantName = variantName.trim();
    }

    if (attributes !== undefined) {
      this.attributes = attributes;
    }
  }

  /**
   * Add image URL to variant (max 6)
   */
  addImage(imageUrl: string): void {
    if (!imageUrl?.trim()) {
      throw new Error('Image URL is required');
    }

    if (this.imageUrls.length >= 6) {
      throw new Error('Variant cannot have more than 6 images');
    }

    this.imageUrls.push(imageUrl.trim());
  }

  /**
   * Remove image by URL
   */
  removeImage(imageUrl: string): void {
    this.imageUrls = this.imageUrls.filter((img) => img !== imageUrl);
  }

  /**
   * Get all image URLs
   */
  getImages(): string[] {
    return [...this.imageUrls];
  }

  /**
   * Get primary image (first in array)
   */
  getPrimaryImage(): string | null {
    return this.imageUrls.length > 0 ? this.imageUrls[0] : null;
  }

  /**
   * Check if variant can accept more images
   */
  canAddImage(): boolean {
    return this.imageUrls.length < 6;
  }

  /**
   * Get image count
   */
  getImageCount(): number {
    return this.imageUrls.length;
  }

  // BUSINESS METHODS - Pricing
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
    this.discountPercent = 0;
  }

  calculateFinalPrice(): number {
    if (this.discountPercent > 0) {
      return this.price - (this.price * this.discountPercent) / 100;
    }
    return this.price;
  }

  // BUSINESS METHODS - Inventory
  updateStock(quantity: number): void {
    if (quantity < 0) {
      throw new Error('Stock cannot be negative');
    }

    this.stock = quantity;

    if (quantity === 0 && this.status === VariantStatus.ACTIVE) {
      this.status = VariantStatus.OUT_OF_STOCK;
    } else if (quantity > 0 && this.status === VariantStatus.OUT_OF_STOCK) {
      this.status = VariantStatus.ACTIVE;
    }
  }

  addStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity to add must be positive');
    }

    this.stock += quantity;

    if (this.status === VariantStatus.OUT_OF_STOCK) {
      this.status = VariantStatus.ACTIVE;
    }
  }

  reduceStock(quantity: number): boolean {
    if (quantity <= 0) {
      throw new Error('Quantity to reduce must be positive');
    }

    if (this.stock < quantity) {
      return false;
    }

    this.stock -= quantity;

    if (this.stock === 0) {
      this.status = VariantStatus.OUT_OF_STOCK;
    }

    return true;
  }

  canFulfillQuantity(quantity: number): boolean {
    return this.stock >= quantity && this.isAvailableForPurchase();
  }

  // BUSINESS METHODS - Status Management
  activate(): void {
    if (this.isDeleted) {
      throw new Error('Cannot activate deleted variant');
    }

    this.isActive = true;

    if (this.stock > 0) {
      this.status = VariantStatus.ACTIVE;
    } else {
      this.status = VariantStatus.OUT_OF_STOCK;
    }
  }

  deactivate(): void {
    this.isActive = false;
    this.status = VariantStatus.INACTIVE;
  }

  softDelete(): void {
    this.isDeleted = true;
    this.isActive = false;
    this.status = VariantStatus.INACTIVE;
  }

  restore(): void {
    this.isDeleted = false;
    this.activate();
  }

  assignSeller(sellerProfileId: string): void {
    if (!sellerProfileId?.trim()) {
      throw new Error('Seller profile ID is required');
    }
    this.sellerProfileId = sellerProfileId.trim();
  }

  // QUERY METHODS
  getId(): string {
    return this.id;
  }

  getProductId(): string {
    return this.productId;
  }

  getVariantName(): string {
    return this.variantName;
  }

  getPrice(): number {
    return this.price;
  }

  getDiscountPercent(): number {
    return this.discountPercent;
  }

  getStock(): number {
    return this.stock;
  }

  getStatus(): VariantStatus {
    return this.status;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getIsDeleted(): boolean {
    return this.isDeleted;
  }

  getSellerProfileId(): string {
    return this.sellerProfileId;
  }

  getAttributes(): Record<string, any> | null {
    return this.attributes;
  }

  hasDiscount(): boolean {
    return this.discountPercent > 0;
  }

  isInStock(): boolean {
    return this.stock > 0;
  }

  isAvailableForPurchase(): boolean {
    return (
      !this.isDeleted &&
      this.isActive &&
      this.status === VariantStatus.ACTIVE &&
      this.stock > 0
    );
  }

  hasSeller(): boolean {
    return this.sellerProfileId !== null;
  }
}
