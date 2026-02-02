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
 *
 * Represents a specific variant of a product that can be purchased.
 * Examples:
 * - Product: "Basmati Rice" → Variants: "500g", "1kg", "5kg"
 * - Product: "Milk" → Variants: "500ml", "1L"
 * - Product: "T-Shirt" → Variants: "Red-S", "Red-M", "Blue-L"
 *
 * Contains all commerce-related attributes:
 * - Pricing (price, discount, final price calculation)
 * - Inventory (stock management)
 * - Seller relationship
 * - Purchase availability status
 */
export class ProductVariant {
  private constructor(
    public readonly id: string,
    private readonly productId: string,
    private sku: string,
    private variantName: string,
    private price: number,
    private discountPercent: number,
    private stock: number,
    private status: VariantStatus,
    private isActive: boolean,
    private isDeleted: boolean,
    private sellerProfileId: string | null,
    private attributes: Record<string, any> | null,
    private imageUrl: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  // ============================================
  // FACTORY METHODS
  // ============================================

  /**
   * Create a new variant for a product
   */
  static create(
    productId: string,
    sku: string,
    variantName: string,
    price: number,
    stock: number,
    sellerProfileId: string | null = null,
    discountPercent: number = 0,
    attributes: Record<string, any> | null = null,
    imageUrl: string | null = null,
  ): ProductVariant {
    // Validations
    if (!productId?.trim()) {
      throw new Error('Product ID is required');
    }

    if (!sku?.trim()) {
      throw new Error('SKU is required');
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
      sku.trim(),
      variantName.trim(),
      price,
      discountPercent,
      stock,
      stock > 0 ? VariantStatus.ACTIVE : VariantStatus.OUT_OF_STOCK,
      true,
      false,
      sellerProfileId?.trim() || null,
      attributes,
      imageUrl?.trim() || null,
      new Date(),
      new Date(),
    );
  }

  /**
   * Reconstruct from persistence
   */
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
    sellerProfileId: string | null,
    attributes: Record<string, any> | null,
    imageUrl: string | null,
    createdAt: Date,
    updatedAt: Date,
  ): ProductVariant {
    return new ProductVariant(
      id,
      productId,
      sku,
      variantName,
      price,
      discountPercent,
      stock,
      status,
      isActive,
      isDeleted,
      sellerProfileId,
      attributes,
      imageUrl,
      createdAt,
      updatedAt,
    );
  }

  // ============================================
  // BUSINESS METHODS - Pricing
  // ============================================

  /**
   * Update variant price
   */
  updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new Error('Price must be greater than 0');
    }
    this.price = newPrice;
  }

  /**
   * Apply discount to variant
   */
  applyDiscount(discountPercent: number): void {
    if (discountPercent < 0 || discountPercent > 100) {
      throw new Error('Discount percent must be between 0 and 100');
    }
    this.discountPercent = discountPercent;
  }

  /**
   * Remove discount from variant
   */
  removeDiscount(): void {
    this.discountPercent = 0;
  }

  /**
   * Calculate final price after discount
   * This is a computed value, not stored
   */
  calculateFinalPrice(): number {
    if (this.discountPercent > 0) {
      return this.price - (this.price * this.discountPercent) / 100;
    }
    return this.price;
  }

  // ============================================
  // BUSINESS METHODS - Inventory
  // ============================================

  /**
   * Update stock quantity
   */
  updateStock(quantity: number): void {
    if (quantity < 0) {
      throw new Error('Stock cannot be negative');
    }

    this.stock = quantity;

    // Auto-update status based on stock
    if (quantity === 0 && this.status === VariantStatus.ACTIVE) {
      this.status = VariantStatus.OUT_OF_STOCK;
    } else if (quantity > 0 && this.status === VariantStatus.OUT_OF_STOCK) {
      this.status = VariantStatus.ACTIVE;
    }
  }

  /**
   * Add stock (restock)
   */
  addStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity to add must be positive');
    }

    this.stock += quantity;

    // Activate if it was out of stock
    if (this.status === VariantStatus.OUT_OF_STOCK) {
      this.status = VariantStatus.ACTIVE;
    }
  }

  /**
   * Reduce stock (after purchase)
   * Returns true if successful, false if insufficient stock
   */
  reduceStock(quantity: number): boolean {
    if (quantity <= 0) {
      throw new Error('Quantity to reduce must be positive');
    }

    if (this.stock < quantity) {
      return false; // Insufficient stock
    }

    this.stock -= quantity;

    // Mark as out of stock if depleted
    if (this.stock === 0) {
      this.status = VariantStatus.OUT_OF_STOCK;
    }

    return true;
  }

  /**
   * Check if variant can fulfill order quantity
   */
  canFulfillQuantity(quantity: number): boolean {
    return this.stock >= quantity && this.isAvailableForPurchase();
  }

  // ============================================
  // BUSINESS METHODS - Status Management
  // ============================================

  /**
   * Activate variant for sale
   */
  activate(): void {
    if (this.isDeleted) {
      throw new Error('Cannot activate deleted variant');
    }

    this.isActive = true;

    // Only set to ACTIVE if stock is available
    if (this.stock > 0) {
      this.status = VariantStatus.ACTIVE;
    } else {
      this.status = VariantStatus.OUT_OF_STOCK;
    }
  }

  /**
   * Deactivate variant (temporarily unavailable)
   */
  deactivate(): void {
    this.isActive = false;
    this.status = VariantStatus.INACTIVE;
  }

  /**
   * Soft delete variant
   */
  softDelete(): void {
    this.isDeleted = true;
    this.isActive = false;
    this.status = VariantStatus.INACTIVE;
  }

  /**
   * Restore variant from soft delete
   */
  restore(): void {
    this.isDeleted = false;
    this.activate();
  }

  // ============================================
  // BUSINESS METHODS - Variant Details
  // ============================================

  /**
   * Update variant details
   */
  updateDetails(
    variantName?: string,
    attributes?: Record<string, any> | null,
    imageUrl?: string | null,
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

    if (imageUrl !== undefined) {
      this.imageUrl = imageUrl?.trim() || null;
    }
  }

  /**
   * Assign seller to variant
   */
  assignSeller(sellerProfileId: string): void {
    if (!sellerProfileId?.trim()) {
      throw new Error('Seller profile ID is required');
    }
    this.sellerProfileId = sellerProfileId.trim();
  }

  /**
   * Remove seller from variant
   */
  removeSeller(): void {
    this.sellerProfileId = null;
  }

  // ============================================
  // QUERY METHODS
  // ============================================

  getId(): string {
    return this.id;
  }

  getProductId(): string {
    return this.productId;
  }

  getSku(): string {
    return this.sku;
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

  getSellerProfileId(): string | null {
    return this.sellerProfileId;
  }

  getAttributes(): Record<string, any> | null {
    return this.attributes;
  }

  getImageUrl(): string | null {
    return this.imageUrl;
  }

  hasDiscount(): boolean {
    return this.discountPercent > 0;
  }

  isInStock(): boolean {
    return this.stock > 0;
  }

  /**
   * Check if variant is available for purchase
   * All conditions must be true:
   * - Not deleted
   * - Active
   * - Status is ACTIVE
   * - Has stock
   */
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
