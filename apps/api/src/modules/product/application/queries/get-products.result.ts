import { Product } from '@/modules/product/domain/entities/product.entity';
import { ProductVariant } from '@/modules/product/domain/entities/product-variant.entity';
import { PaginationMeta } from '@/shared/types/pagination-meta';

export interface GetProductsResult {
  products: Array<{
    product: Product;
    variants: ProductVariant[];
  }>;
  meta: PaginationMeta;
}
