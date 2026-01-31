import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProductsFeedQuery } from '../get-products-feed.query';
import { ProductRepository } from '@/domain/product/repositories/product.repository';
import { Product, ProductStatus } from '@/domain/product/entities/product.entity';

export interface GetProductsFeedResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

@QueryHandler(GetProductsFeedQuery)
export class GetProductsFeedHandler implements IQueryHandler<GetProductsFeedQuery> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetProductsFeedQuery): Promise<GetProductsFeedResult> {
    const { page, limit, search, categoryId } = query;

    const findOptions = {
      page: page || 1,
      limit: limit || 10,
      search,
      categoryId,
      status: ProductStatus.ACTIVE, // Only active products in feed
      sortBy: 'createdAt' as const,
      sortOrder: 'desc' as const,
    };

    const [products, total] = await Promise.all([
      this.productRepository.find(findOptions),
      this.productRepository.count(findOptions),
    ]);

    return {
      products,
      total,
      page: findOptions.page,
      limit: findOptions.limit,
    };
  }
}
