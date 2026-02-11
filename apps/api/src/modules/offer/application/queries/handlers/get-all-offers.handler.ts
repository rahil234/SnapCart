import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllOffersQuery } from '../get-all-offers.query';
import { Offer } from '@/modules/offer/domain/entities';
import { OfferRepository } from '@/modules/offer/domain/repositories/offer.repository';

@QueryHandler(GetAllOffersQuery)
export class GetAllOffersHandler implements IQueryHandler<GetAllOffersQuery> {
  constructor(
    @Inject('OfferRepository')
    private readonly offerRepository: OfferRepository,
  ) {}

  async execute(query: GetAllOffersQuery): Promise<{
    offers: Offer[];
    total: number;
  }> {
    return await this.offerRepository.findAll(query.skip, query.take);
  }
}
