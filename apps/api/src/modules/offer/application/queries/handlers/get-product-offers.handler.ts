import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProductOffersQuery } from '../get-product-offers.query';
import { Offer } from '@/modules/offer/domain/entities';
import { OfferRepository } from '@/modules/offer/domain/repositories/offer.repository';

@QueryHandler(GetProductOffersQuery)
export class GetProductOffersHandler
  implements IQueryHandler<GetProductOffersQuery>
{
  constructor(
    @Inject('OfferRepository')
    private readonly offerRepository: OfferRepository,
  ) {}

  async execute(query: GetProductOffersQuery): Promise<Offer[]> {
    return await this.offerRepository.findByProductId(query.productId);
  }
}
