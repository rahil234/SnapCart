import { Query } from '@nestjs/cqrs';

import { GetProductsFeedResult } from '@/application/product/queries/results/get-products-feed.result';

export class GetProductsFeedQuery extends Query<GetProductsFeedResult> {
  constructor(
    public readonly page?: number,
    public readonly limit?: number,
    public readonly search?: string,
    public readonly categoryId?: string,
  ) {
    super();
  }
}
