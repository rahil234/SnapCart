import { Command } from '@nestjs/cqrs';

export class ActivateCouponCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
