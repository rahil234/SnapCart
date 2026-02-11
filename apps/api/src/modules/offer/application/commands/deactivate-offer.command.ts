import { Command } from '@nestjs/cqrs';

export class DeactivateOfferCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
