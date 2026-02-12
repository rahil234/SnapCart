import { Query } from '@nestjs/cqrs';
import { Offer } from '@/modules/offer/domain/entities';

export class GetProductOffersQuery extends Query<Offer[]> {
  constructor(public readonly productId: string) {
    super();
  }
}
