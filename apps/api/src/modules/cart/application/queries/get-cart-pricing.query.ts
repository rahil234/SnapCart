import { Query } from '@nestjs/cqrs';

export class GetCartPricingQuery extends Query<any> {
  constructor(
    public readonly userId: string,
    public readonly couponCode?: string,
  ) {
    super();
  }
}
