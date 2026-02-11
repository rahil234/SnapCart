import { Query } from '@nestjs/cqrs';
import { Offer } from '@/modules/offer/domain/entities';

export class GetActiveOffersQuery extends Query<Offer[]> {
  constructor() {
    super();
  }
}
