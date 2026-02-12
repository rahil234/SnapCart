import { ProductStatus } from '@/modules/product/domain/entities/product.entity';

/**
 * Update Product Status Command (Admin Only)
 *
 * Admin changes product status for governance purposes
 */
export class UpdateProductStatusCommand {
  constructor(
    public readonly productId: string,
    public readonly status: ProductStatus,
  ) {}
}
