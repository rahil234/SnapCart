import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetSellerProductsQuery } from '@/modules/product/application/queries/get-seller-products.query';
import { GetSellerProductsResult } from '@/modules/product/application/queries/get-seller-products.result';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';
import {
  SELLER_IDENTITY_PORT,
  SellerIdentityPort,
} from '@/modules/product/application/ports/seller-identity.port';

@QueryHandler(GetSellerProductsQuery)
export class GetSellerProductsHandler implements IQueryHandler<GetSellerProductsQuery> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject(SELLER_IDENTITY_PORT)
    private readonly sellerIdentityPort: SellerIdentityPort,
  ) {}

  async execute(
    query: GetSellerProductsQuery,
  ): Promise<GetSellerProductsResult> {
    const { userId, page = 1, limit = 10, search, status } = query;

    const sellerProfileId =
      await this.sellerIdentityPort.getSellerProfileId(userId);

    // Use the repository method for seller-specific products
    const result = await this.productRepository.findProductsBySellerProfileId(
      sellerProfileId,
      {
        page,
        limit,
        search,
        status,
      },
    );

    const hasNextPage = result.total > page * limit;
    const hasPrevPage = page > 1;

    return new GetSellerProductsResult(
      result.products.map((p) => ({
        product: p.product,
        variants: p.variants,
      })),
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
