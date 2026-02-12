import { Query } from '@nestjs/cqrs';
import { Offer } from '@/modules/offer/domain/entities';

export class GetOfferQuery extends Query<Offer> {
  constructor(public readonly id: string) {
    super();
  }
}
