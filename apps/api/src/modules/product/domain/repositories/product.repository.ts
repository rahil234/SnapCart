import { Product, ProductVariant } from '../entities';

/**
 * Product Repository Interface
 *
 * Follows the Repository pattern from DDD.
 * The repository abstracts data access and provides a collection-like interface.
 */
export interface ProductRepository {
  // ============================================
  // PRODUCT (Identity) Operations
  // ============================================

  /**
   * Save a new product to the catalog
   */
  saveProduct(product: Product): Promise<Product>;

  /**
   * Update existing product
   */
  updateProduct(product: Product): Promise<Product>;

  /**
   * Find product by ID
   */
  findProductById(id: string): Promise<Product | null>;

  /**
   * Find product by Variant ID
   */
  findProductByVariantId(variantId: string): Promise<Product | null>;

  /**
   * Find all products (with optional filters)
   */
  findAllProducts(filters?: {
    categoryId?: string;
    status?: string;
    isDeleted?: boolean;
  }): Promise<Product[]>;

  /**
   * Check if product exists
   */
  productExists(id: string): Promise<boolean>;

  // ============================================
  // PRODUCT VARIANT (Sellable Unit) Operations
  // ============================================

  /**
   * Save a new variant for a product
   */
  saveVariant(variant: ProductVariant): Promise<ProductVariant>;

  /**
   * Update existing variant
   */
  updateVariant(variant: ProductVariant): Promise<ProductVariant>;

  /**
   * Find variant by ID
   */
  findVariantById(id: string): Promise<ProductVariant | null>;

  /**
   * Find all variants for a specific product
   */
  findVariantsByProductId(productId: string): Promise<ProductVariant[]>;

  /**
   * Find all active/available variants for a product
   */
  findAvailableVariantsByProductId(
    productId: string,
  ): Promise<ProductVariant[]>;

  /**
   * Find variants by seller
   */
  findVariantsBySellerId(sellerProfileId: string): Promise<ProductVariant[]>;

  /**
   * Check if variant exists
   */
  variantExists(id: string): Promise<boolean>;

  // ============================================
  // VARIANT IMAGE Operations
  // ============================================

  /**
   * Save a variant image URL
   */
  saveVariantImage(
    variantId: string,
    publicId: string,
    url: string,
  ): Promise<void>;

  /**
   * Delete a variant image by URL
   */
  deleteVariantImage(variantId: string, position: number): Promise<void>;

  /**
   * Find all image URLs for a variant
   */
  findVariantImages(variantId: string): Promise<string[]>;

  /**
   * Delete all images for a variant (cascade)
   */
  deleteVariantImagesByVariantId(variantId: string): Promise<void>;

  // ============================================
  // COMBINED QUERIES (Product + Variants)
  // ============================================

  /**
   * Find product with all its variants
   */
  findProductWithVariants(productId: string): Promise<{
    product: Product;
    variants: ProductVariant[];
  } | null>;

  /**
   * Find products with their active variants for catalog display
   */
  findProductsForCatalog(filters?: {
    categoryId?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    products: Array<{
      product: Product;
      variants: ProductVariant[];
    }>;
    total: number;
  }>;

  // ============================================
  // SELLER-SPECIFIC QUERIES
  // ============================================

  /**
   * Find all products owned by a seller (via variants)
   * Returns products where at least one variant belongs to the seller
   */
  findProductsBySellerProfileId(
    sellerProfileId: string,
    filters?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
    },
  ): Promise<{
    products: Array<{
      product: Product;
      variants: ProductVariant[];
    }>;
    total: number;
  }>;

  // ============================================
  // ADMIN-SPECIFIC QUERIES
  // ============================================

  /**
   * Find all products for admin panel (includes all statuses)
   */
  findAllProductsForAdmin(filters?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    categoryId?: string;
  }): Promise<{
    products: Array<{
      product: Product;
      variants: ProductVariant[];
    }>;
    total: number;
  }>;
}
