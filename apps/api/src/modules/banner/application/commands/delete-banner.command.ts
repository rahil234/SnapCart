import { Command } from '@nestjs/cqrs';

export class DeleteBannerCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
