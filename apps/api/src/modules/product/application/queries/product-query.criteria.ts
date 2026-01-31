import { ProductStatus } from '@/modules/product/domain/entities/product.entity';

export type ProductSortField = 'createdAt' | 'price' | 'name';
export type SortOrder = 'asc' | 'desc';

export interface ProductQueryCriteria {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  status?: ProductStatus;
  sortBy: ProductSortField;
  sortOrder: SortOrder;
}
