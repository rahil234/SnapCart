import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateOfferCommand } from '../create-offer.command';
import { Offer } from '@/modules/offer/domain/entities';
import { OfferRepository } from '@/modules/offer/domain/repositories/offer.repository';

@CommandHandler(CreateOfferCommand)
export class CreateOfferHandler implements ICommandHandler<CreateOfferCommand> {
  constructor(
    @Inject('OfferRepository')
    private readonly offerRepository: OfferRepository,
  ) {}

  async execute(command: CreateOfferCommand): Promise<Offer> {
    const {
      name,
      type,
      discount,
      startDate,
      endDate,
      minPurchaseAmount,
      maxDiscount,
      priority,
      categories,
      products,
      isStackable,
      description,
    } = command;

    // Create domain entity using factory method (with business validation)
    const offer = Offer.create(
      name,
      type,
      discount,
      startDate,
      endDate,
      minPurchaseAmount,
      maxDiscount,
      priority,
      categories,
      products,
      isStackable,
      description,
    );

    // Persist the offer
    const createdOffer = await this.offerRepository.save(offer);

    return createdOffer;
  }
}
