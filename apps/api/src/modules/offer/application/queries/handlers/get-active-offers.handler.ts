import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetActiveOffersQuery } from '../get-active-offers.query';
import { Offer } from '@/modules/offer/domain/entities';
import { OfferRepository } from '@/modules/offer/domain/repositories/offer.repository';

@QueryHandler(GetActiveOffersQuery)
export class GetActiveOffersHandler
  implements IQueryHandler<GetActiveOffersQuery>
{
  constructor(
    @Inject('OfferRepository')
    private readonly offerRepository: OfferRepository,
  ) {}

  async execute(query: GetActiveOffersQuery): Promise<Offer[]> {
    return await this.offerRepository.findActiveOffers();
  }
}
