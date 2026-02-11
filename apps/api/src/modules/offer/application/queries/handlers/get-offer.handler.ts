import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetOfferQuery } from '../get-offer.query';
import { Offer } from '@/modules/offer/domain/entities';
import { OfferRepository } from '@/modules/offer/domain/repositories/offer.repository';

@QueryHandler(GetOfferQuery)
export class GetOfferHandler implements IQueryHandler<GetOfferQuery> {
  constructor(
    @Inject('OfferRepository')
    private readonly offerRepository: OfferRepository,
  ) {}

  async execute(query: GetOfferQuery): Promise<Offer> {
    const offer = await this.offerRepository.findById(query.id);

    if (!offer) {
      throw new NotFoundException(`Offer with ID '${query.id}' not found`);
    }

    return offer;
  }
}
