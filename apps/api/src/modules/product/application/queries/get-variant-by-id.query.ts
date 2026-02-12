import { Query } from '@nestjs/cqrs';
import { ProductVariant } from '@/modules/product/domain/entities';

export class GetVariantByIdQuery extends Query<ProductVariant> {
  constructor(public readonly variantId: string) {
    super();
  }
}
