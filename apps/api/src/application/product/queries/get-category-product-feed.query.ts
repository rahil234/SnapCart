import { Query } from '@nestjs/cqrs';

import { GetCategoryProductFeedResult } from '@/application/product/queries/results/get-category-product-feed.result';

export class GetCategoryProductFeedQuery extends Query<GetCategoryProductFeedResult> {
  constructor(
    public readonly maxCategories: number = 4,
    public readonly maxProductsPerCategory: number = 10,
  ) {
    super();
  }
}
