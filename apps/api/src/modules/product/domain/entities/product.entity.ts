import cuid from '@paralleldrive/cuid2';

/**
 * Product Status - Identity Level
 * active: Product catalog entry is available
 * inactive: Product temporarily hidden from catalog
 * discontinued: Product permanently removed from catalog
 */
export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued',
}

/**
 * Product Entity - Aggregate Root
 *
 * Represents the IDENTITY of a product in the catalog.
 * This is NOT a sellable item. ProductVariant is the sellable unit.
 *
 * Contains only:
 * - Identity information (name, description, brand)
 * - Catalog classification (category)
 * - Overall product lifecycle status
 *
 * Does NOT contain:
 * - Pricing (belongs to variant)
 * - Stock (belongs to variant)
 * - Discount (belongs to variant)
 * - Seller (belongs to variant)
 */
export class Product {
  private constructor(
    public readonly id: string,
    private name: string,
    private description: string,
    private categoryId: string,
    private brand: string | null,
    private sellerProfileId: string,
    private status: ProductStatus,
    private isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  // ============================================
  // FACTORY METHODS
  // ============================================

  /**
   * Create a new product (catalog identity only)
   * Note: A product is just a catalog entry.
   * You must create at least one variant to make it sellable.
   */
  static create(
    name: string,
    description: string,
    categoryId: string,
    brand: string | null = null,
    sellerProfileId: string,
  ): Product {
    if (!name?.trim()) {
      throw new Error('Product name is required');
    }

    if (!description?.trim()) {
      throw new Error('Product description is required');
    }

    if (!categoryId?.trim()) {
      throw new Error('Category ID is required');
    }

    if (sellerProfileId && !sellerProfileId.trim()) {
      throw new Error('Seller Profile ID is required');
    }

    return new Product(
      cuid.createId(),
      name.trim(),
      description.trim(),
      categoryId.trim(),
      brand?.trim() || null,
      sellerProfileId,
      ProductStatus.ACTIVE,
      false,
      new Date(),
      new Date(),
    );
  }

  /**
   * Reconstruct from persistence
   */
  static from(
    id: string,
    name: string,
    description: string,
    categoryId: string,
    brand: string | null,
    sellerProfileId: string,
    status: ProductStatus,
    isDeleted: boolean,
    createdAt: Date,
    updatedAt: Date,
  ): Product {
    return new Product(
      id,
      name,
      description,
      categoryId,
      brand,
      sellerProfileId,
      status,
      isDeleted,
      createdAt,
      updatedAt,
    );
  }

  // ============================================
  // BUSINESS METHODS - Identity Operations
  // ============================================

  /**
   * Update product identity information
   * These are catalog-level changes, not commerce changes
   */
  updateInfo(name: string, description: string, brand?: string | null): void {
    if (!name?.trim()) {
      throw new Error('Product name is required');
    }

    if (!description?.trim()) {
      throw new Error('Product description is required');
    }

    this.name = name.trim();
    this.description = description.trim();

    if (brand !== undefined) {
      this.brand = brand?.trim() || null;
    }
  }

  /**
   * Change product category
   * Important: This is an identity-level change
   * Rule: Can only change category if product is not discontinued
   */
  changeCategory(newCategoryId: string): void {
    if (this.status === ProductStatus.DISCONTINUED) {
      throw new Error('Cannot change category of discontinued product');
    }

    if (!newCategoryId?.trim()) {
      throw new Error('Category ID is required');
    }

    this.categoryId = newCategoryId.trim();
  }

  /**
   * Activate product in catalog
   */
  activate(): void {
    if (this.status === ProductStatus.DISCONTINUED) {
      throw new Error('Cannot activate discontinued product');
    }
    if (this.isDeleted) {
      throw new Error('Cannot activate deleted product');
    }
    this.status = ProductStatus.ACTIVE;
  }

  /**
   * Deactivate product (temporary hide from catalog)
   */
  deactivate(): void {
    if (this.status === ProductStatus.DISCONTINUED) {
      throw new Error('Product is already discontinued');
    }
    this.status = ProductStatus.INACTIVE;
  }

  /**
   * Discontinue product (permanent removal from catalog)
   * This is a one-way operation
   */
  discontinue(): void {
    this.status = ProductStatus.DISCONTINUED;
  }

  /**
   * Soft delete
   */
  softDelete(): void {
    this.isDeleted = true;
    this.status = ProductStatus.INACTIVE;
  }

  /**
   * Restore from soft delete
   */
  restore(): void {
    if (this.status === ProductStatus.DISCONTINUED) {
      throw new Error('Cannot restore discontinued product');
    }
    this.isDeleted = false;
  }

  // ============================================
  // GETTERS
  // ============================================

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getCategoryId(): string {
    return this.categoryId;
  }

  getBrand(): string | null {
    return this.brand;
  }

  getSellerProfileId(): string {
    return this.sellerProfileId;
  }

  getStatus(): ProductStatus {
    return this.status;
  }

  getIsDeleted(): boolean {
    return this.isDeleted;
  }

  isActive(): boolean {
    return this.status === ProductStatus.ACTIVE && !this.isDeleted;
  }

  isInCatalog(): boolean {
    return this.status !== ProductStatus.DISCONTINUED && !this.isDeleted;
  }

  isDiscontinued(): boolean {
    return this.status === ProductStatus.DISCONTINUED;
  }

  canBeEdited(): boolean {
    return !this.isDeleted;
  }
}
