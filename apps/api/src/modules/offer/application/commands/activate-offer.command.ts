import { Command } from '@nestjs/cqrs';

export class ActivateOfferCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
