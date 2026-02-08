import { Product } from '@/modules/product/domain/entities/product.entity';

export class GetAdminProductsResult {
  constructor(
    public readonly products: Product[],
    public readonly meta: {
      page: number;
      limit: number;
      total: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    },
  ) {}
}
