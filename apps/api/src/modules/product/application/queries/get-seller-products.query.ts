import { Query } from '@nestjs/cqrs';

import { GetSellerProductsResult } from '@/modules/product/application/queries/get-seller-products.result';

/**
 * Get Seller Products Query
 *
 * Retrieves all products owned by a specific seller (via variants)
 */
export class GetSellerProductsQuery extends Query<GetSellerProductsResult> {
  constructor(
    public readonly userId: string,
    public readonly page?: number,
    public readonly limit?: number,
    public readonly search?: string,
    public readonly status?: string,
  ) {
    super();
  }
}
