import { Product } from '@/domain/product/entities';

export interface GetProductsFeedResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}
