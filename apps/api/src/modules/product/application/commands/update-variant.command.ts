import { VariantStatus } from '@/modules/product/domain/entities/product-variant.entity';

/**
 * Update Product Variant Command
 *
 * Updates commerce attributes of a variant.
 * SKU and productId cannot be changed (immutable).
 * Images are managed via separate /images endpoint.
 */
export class UpdateVariantCommand {
  constructor(
    public readonly variantId: string,
    public readonly variantName?: string,
    public readonly price?: number,
    public readonly discountPercent?: number,
    public readonly stock?: number,
    public readonly status?: VariantStatus,
    public readonly isActive?: boolean,
    public readonly sellerProfileId?: string | null,
    public readonly attributes?: Record<string, any> | null,
  ) {}
}
