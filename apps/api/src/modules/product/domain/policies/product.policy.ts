import { ForbiddenException, Injectable } from '@nestjs/common';
import { Product, ProductVariant } from '../entities';
import { ProductUpdateIntent } from './product-update-intent.enum';

/**
 * Product Policy
 *
 * Enforces authorization rules for product operations.
 * This is the single source of truth for "who can do what" with products.
 */
@Injectable()
export class ProductPolicy {
  /**
   * Check if a seller can update a product
   * Rule: Seller must own at least one variant of the product
   */
  canSellerUpdate(
    sellerProfileId: string,
    variants: ProductVariant[],
  ): boolean {
    if (!sellerProfileId) {
      throw new ForbiddenException('Seller profile ID is required');
    }

    if (!variants || variants.length === 0) {
      throw new ForbiddenException(
        'Product has no variants. Cannot determine ownership.',
      );
    }

    const ownsVariant = variants.some(
      (variant) => variant.getSellerProfileId() === sellerProfileId,
    );

    if (!ownsVariant) {
      throw new ForbiddenException(
        'You do not own any variants of this product',
      );
    }

    return true;
  }

  /**
   * Check if a seller can perform a specific update operation
   */
  canSellerPerformIntent(intent: ProductUpdateIntent): boolean {
    if (intent !== ProductUpdateIntent.SELLER_UPDATE) {
      throw new ForbiddenException(
        `Sellers are not allowed to perform ${intent}`,
      );
    }
    return true;
  }

  /**
   * Check if an admin can perform a specific update operation
   */
  canAdminPerformIntent(intent: ProductUpdateIntent): boolean {
    if (intent !== ProductUpdateIntent.ADMIN_STATUS_UPDATE) {
      throw new ForbiddenException(
        `Admins are only allowed to perform ${ProductUpdateIntent.ADMIN_STATUS_UPDATE}`,
      );
    }
    return true;
  }

  /**
   * Validate that a product is not discontinued before allowing updates
   */
  canModifyProduct(product: Product): boolean {
    if (product.isDiscontinued()) {
      throw new ForbiddenException('Cannot modify discontinued product');
    }

    if (product.getIsDeleted()) {
      throw new ForbiddenException('Cannot modify deleted product');
    }

    return true;
  }

  /**
   * Check if seller owns a specific product (via variants)
   */
  async validateSellerOwnership(
    sellerProfileId: string,
    variants: ProductVariant[],
  ): Promise<void> {
    this.canSellerUpdate(sellerProfileId, variants);
  }

  /**
   * Enforce seller update rules
   */
  enforceSellerUpdate(
    sellerProfileId: string,
    product: Product,
    variants: ProductVariant[],
  ): void {
    this.canModifyProduct(product);
    this.canSellerUpdate(sellerProfileId, variants);
    this.canSellerPerformIntent(ProductUpdateIntent.SELLER_UPDATE);
  }

  /**
   * Enforce admin update rules
   */
  enforceAdminStatusUpdate(product: Product): void {
    // Admin can update status even on discontinued products
    // (to potentially reactivate or change states)
    if (product.getIsDeleted()) {
      throw new ForbiddenException('Cannot modify deleted product');
    }
    this.canAdminPerformIntent(ProductUpdateIntent.ADMIN_STATUS_UPDATE);
  }
}
