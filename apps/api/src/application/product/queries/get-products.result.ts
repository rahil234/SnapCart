import { Product } from '@/domain/product/entities/product.entity';
import { PaginationMeta } from '@/shared/types/pagination-meta';

export interface GetProductsResult {
  products: Product[];
  meta: PaginationMeta;
}
