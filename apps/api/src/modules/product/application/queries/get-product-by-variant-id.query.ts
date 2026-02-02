import { Query } from '@nestjs/cqrs';

export class GetProductByVariantIdQuery extends Query<any> {
  constructor(public readonly variantId: string) {
    super();
  }
}
