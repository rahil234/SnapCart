import { Query } from '@nestjs/cqrs';

import { Cart } from '@/modules/cart/domain/entities';

export class GetCartQuery extends Query<Cart> {
  constructor(public readonly userId: string) {
    super();
  }
}
