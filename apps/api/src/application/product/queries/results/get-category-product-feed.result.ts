import { Product } from '@/domain/product/entities/product.entity';

export interface CategoryProductFeedItem {
  id: string;
  name: string;
  products: Product[];
}

export interface GetCategoryProductFeedResult {
  categories: CategoryProductFeedItem[];
}
