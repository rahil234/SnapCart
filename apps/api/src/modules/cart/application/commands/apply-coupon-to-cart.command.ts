import { Command } from '@nestjs/cqrs';

export class ApplyCouponToCartCommand extends Command<void> {
  constructor(
    public readonly userId: string,
    public readonly couponCode: string,
  ) {
    super();
  }
}
