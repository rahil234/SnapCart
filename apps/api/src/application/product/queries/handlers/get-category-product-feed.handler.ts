import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ProductStatus } from '@/domain/product/entities';
import { ProductRepository } from '@/domain/product/repositories/product.repository';
import { CategoryRepository } from '@/domain/category/repositories/category.repository';
import { GetCategoryProductFeedQuery } from '@/application/product/queries/get-category-product-feed.query';
import { GetCategoryProductFeedResult } from '@/application/product/queries/results/get-category-product-feed.result';

@QueryHandler(GetCategoryProductFeedQuery)
export class GetCategoryProductFeedHandler implements IQueryHandler<GetCategoryProductFeedQuery> {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,

    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(
    query: GetCategoryProductFeedQuery,
  ): Promise<GetCategoryProductFeedResult> {
    // 1️⃣ Fetch top categories
    const categories = await this.categoryRepository.findAll();

    // 2️⃣ For each category, fetch products
    const categoryFeeds = await Promise.all(
      categories.map(async (category) => {
        const productsResult = await this.productRepository.findPaginated({
          page: 1,
          limit: query.maxProductsPerCategory,
          categoryId: category.id,
          status: ProductStatus.ACTIVE,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        });

        return {
          id: category.id,
          name: category.getName(),
          products: productsResult.items,
        };
      }),
    );

    return {
      categories: categoryFeeds,
    };
  }
}
