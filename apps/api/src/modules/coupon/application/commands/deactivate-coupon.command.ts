import { Command } from '@nestjs/cqrs';

export class DeactivateCouponCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
