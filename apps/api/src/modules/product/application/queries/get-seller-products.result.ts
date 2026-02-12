import { Product } from '@/modules/product/domain/entities/product.entity';
import { ProductVariant } from '@/modules/product/domain/entities';

export class GetSellerProductsResult {
  constructor(
    public readonly products: {
      product: Product;
      variants: ProductVariant[];
    }[],
    public readonly meta: {
      page: number;
      limit: number;
      total: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    },
  ) {}
}
