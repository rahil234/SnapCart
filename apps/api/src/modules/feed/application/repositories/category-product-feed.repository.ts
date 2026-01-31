import { CategoryProductFeedItem } from '@/modules/feed/application/queries/results/get-category-product-feed.result';

export interface CategoryProductFeedRepository {
  findFeed(
    maxCategories: number,
    maxProductsPerCategory: number,
  ): Promise<CategoryProductFeedItem[]>;
}
