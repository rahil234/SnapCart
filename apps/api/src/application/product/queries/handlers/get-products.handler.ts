import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetProductsQuery } from '@/application/product/queries';
import { ProductRepository } from '@/domain/product/repositories/product.repository';
import { GetProductsResult } from '@/application/product/queries/get-products.result';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetProductsQuery): Promise<GetProductsResult> {
    const criteria = {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      search: query.search,
      categoryId: query.categoryId,
      status: query.status as any,
      sortBy: 'createdAt' as const,
      sortOrder: 'desc' as const,
    };

    const result = await this.productRepository.findPaginated(criteria);

    const hasNextPage = result.page * result.limit < result.total;

    const hasPrevPage = result.page > 1;

    return {
      products: result.items,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        hasNextPage,
        hasPrevPage,
      },
    };
  }
}
