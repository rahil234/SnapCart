import { ProductStatus } from '@/modules/product/domain/entities/product.entity';
import { ProductUpdateIntent } from '@/modules/product/domain/policies';

/**
 * Update Product Command
 *
 * Updates product identity/catalog information only.
 * Does NOT update pricing, stock, or seller (those are variant concerns).
 */
export class UpdateProductCommand {
  constructor(
    public readonly productId: string,
    public readonly intent: ProductUpdateIntent,
    public readonly userId: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly brand?: string | null,
    public readonly categoryId?: string,
    public readonly status?: ProductStatus,
  ) {}
}
