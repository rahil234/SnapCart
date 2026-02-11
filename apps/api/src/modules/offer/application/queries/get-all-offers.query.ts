import { Query } from '@nestjs/cqrs';
import { Offer } from '@/modules/offer/domain/entities';

export class GetAllOffersQuery extends Query<{
  offers: Offer[];
  total: number;
}> {
  constructor(
    public readonly skip?: number,
    public readonly take?: number,
  ) {
    super();
  }
}
