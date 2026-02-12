import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { ActivateOfferCommand } from '../activate-offer.command';
import { OfferRepository } from '@/modules/offer/domain/repositories/offer.repository';

@CommandHandler(ActivateOfferCommand)
export class ActivateOfferHandler implements ICommandHandler<ActivateOfferCommand> {
  constructor(
    @Inject('OfferRepository')
    private readonly offerRepository: OfferRepository,
  ) {}

  async execute(command: ActivateOfferCommand): Promise<void> {
    const offer = await this.offerRepository.findById(command.id);
    if (!offer) {
      throw new NotFoundException(`Offer with ID '${command.id}' not found`);
    }

    offer.activate();
    await this.offerRepository.update(offer);
  }
}
