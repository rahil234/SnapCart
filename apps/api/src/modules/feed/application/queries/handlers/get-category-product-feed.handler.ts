import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ProductStatus } from '@/modules/product/domain/entities';
import { GetCategoryProductFeedQuery } from '@/modules/feed/application/queries';
import { GetCategoryProductFeedResult } from '@/modules/feed/application/queries/results';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository';
import { CategoryProductFeedRepository } from '@/modules/feed/application/repositories/category-product-feed.repository';

@QueryHandler(GetCategoryProductFeedQuery)
export class GetCategoryProductFeedHandler implements IQueryHandler<GetCategoryProductFeedQuery> {
  constructor(
    @Inject('CategoryProductFeedRepository')
    private readonly categoryRepository: CategoryProductFeedRepository,
  ) {}

  async execute(
    query: GetCategoryProductFeedQuery,
  ): Promise<GetCategoryProductFeedResult> {
    const categoryFeeds = await this.categoryRepository.findFeed(
      query.maxCategories,
      query.maxProductsPerCategory,
    );

    return {
      categories: categoryFeeds,
    };
  }
}
