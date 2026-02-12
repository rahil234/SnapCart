import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateOfferCommand } from '../update-offer.command';
import { Offer } from '@/modules/offer/domain/entities';
import { OfferRepository } from '@/modules/offer/domain/repositories/offer.repository';

@CommandHandler(UpdateOfferCommand)
export class UpdateOfferHandler implements ICommandHandler<UpdateOfferCommand> {
  constructor(
    @Inject('OfferRepository')
    private readonly offerRepository: OfferRepository,
  ) {}

  async execute(command: UpdateOfferCommand): Promise<Offer> {
    const {
      id,
      name,
      type,
      discount,
      minPurchaseAmount,
      maxDiscount,
      priority,
      startDate,
      endDate,
      isStackable,
      description,
      categories,
      products,
    } = command;

    // Find existing offer
    const offer = await this.offerRepository.findById(id);
    if (!offer) {
      throw new NotFoundException(`Offer with ID '${id}' not found`);
    }

    // Update domain entity (with business validation)
    offer.updateDetails(
      name,
      type,
      discount,
      minPurchaseAmount,
      maxDiscount,
      priority,
      startDate,
      endDate,
      isStackable,
      description,
    );

    if (categories !== undefined || products !== undefined) {
      offer.updateApplicability(categories, products);
    }

    // Persist the updated offer
    const updatedOffer = await this.offerRepository.update(offer);

    return updatedOffer;
  }
}
