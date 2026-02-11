import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeactivateOfferCommand } from '../deactivate-offer.command';
import { OfferRepository } from '@/modules/offer/domain/repositories/offer.repository';

@CommandHandler(DeactivateOfferCommand)
export class DeactivateOfferHandler
  implements ICommandHandler<DeactivateOfferCommand>
{
  constructor(
    @Inject('OfferRepository')
    private readonly offerRepository: OfferRepository,
  ) {}

  async execute(command: DeactivateOfferCommand): Promise<void> {
    const offer = await this.offerRepository.findById(command.id);
    if (!offer) {
      throw new NotFoundException(`Offer with ID '${command.id}' not found`);
    }

    offer.deactivate();
    await this.offerRepository.update(offer);
  }
}
