import { PaginatedResult } from '@/shared/types';
import { Product } from '@/domain/product/entities';
import { ProductQueryCriteria } from '@/application/product/queries/product-query.criteria';

export interface ProductRepository {
  save(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;

  findPaginated(
    criteria: ProductQueryCriteria,
  ): Promise<PaginatedResult<Product>>;
}
