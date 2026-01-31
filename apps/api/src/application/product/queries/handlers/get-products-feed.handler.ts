import { Inject } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import { GetProductsFeedQuery } from '@/application/product/queries';
import { ProductStatus } from '@/domain/product/entities/product.entity';
import { ProductRepository } from '@/domain/product/repositories/product.repository';

@QueryHandler(GetProductsFeedQuery)
export class GetProductsFeedHandler implements IQueryHandler<GetProductsFeedQuery> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetProductsFeedQuery) {
    const criteria = {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      search: query.search,
      categoryId: query.categoryId,
      status: ProductStatus.ACTIVE,
      sortBy: 'createdAt' as const,
      sortOrder: 'desc' as const,
    };

    const result = await this.productRepository.findPaginated(criteria);

    return {
      products: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}
