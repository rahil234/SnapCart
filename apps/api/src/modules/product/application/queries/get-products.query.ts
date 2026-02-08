import { Query } from '@nestjs/cqrs';

import { GetProductsResult } from '@/modules/product/application/queries/get-products.result';

export class GetProductsQuery extends Query<GetProductsResult> {
  constructor(
    public readonly page?: number,
    public readonly limit?: number,
    public readonly search?: string,
    public readonly status?: string,
    public readonly categoryId?: string,
  ) {
    super();
  }
}
