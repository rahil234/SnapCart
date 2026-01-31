import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProductsQuery } from '../get-products.query';
import { ProductRepository } from '@/domain/product/repositories/product.repository';
import { Product } from '@/domain/product/entities/product.entity';

export interface GetProductsResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetProductsQuery): Promise<GetProductsResult> {
    const { page, limit, search, categoryId, status } = query;

    const findOptions = {
      page: page || 1,
      limit: limit || 10,
      search,
      categoryId,
      status,
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
