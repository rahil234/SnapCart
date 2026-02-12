import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetAdminProductsQuery } from '@/modules/product/application/queries/get-admin-products.query';
import { GetAdminProductsResult } from '@/modules/product/application/queries/get-admin-products.result';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';

@QueryHandler(GetAdminProductsQuery)
export class GetAdminProductsHandler
  implements IQueryHandler<GetAdminProductsQuery>
{
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetAdminProductsQuery): Promise<GetAdminProductsResult> {
    const { page = 1, limit = 10, search, status, categoryId } = query;

    // Use the repository method for admin-specific products (all statuses)
    const result = await this.productRepository.findAllProductsForAdmin({
      page,
      limit,
      search,
      status,
      categoryId,
    });

    const hasNextPage = result.total > page * limit;
    const hasPrevPage = page > 1;

    return new GetAdminProductsResult(
      result.products.map((p) => p.product),
      {
        page,
        limit,
        total: result.total,
        hasNextPage,
        hasPrevPage,
      },
    );
  }
}
