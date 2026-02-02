import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetProductsQuery } from '@/modules/product/application/queries';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';
import { GetProductsResult } from '@/modules/product/application/queries/get-products.result';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetProductsQuery): Promise<GetProductsResult> {
    // Use the new repository method for catalog queries
    const result = await this.productRepository.findProductsForCatalog({
      categoryId: query.categoryId,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      search: query.search,
    });

    const hasNextPage = result.total > (query.page ?? 1) * (query.limit ?? 10);
    const hasPrevPage = (query.page ?? 1) > 1;

    return {
      products: result.products.map((p) => p.product),
      meta: {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
        total: result.total,
        hasNextPage,
        hasPrevPage,
      },
    };
  }
}
