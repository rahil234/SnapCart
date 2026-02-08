import { Command } from '@nestjs/cqrs';

export class ValidateCouponCommand extends Command<{
  valid: boolean;
  reason?: string;
  discount?: number;
}> {
  constructor(
    public readonly code: string,
    public readonly userId: string,
    public readonly cartTotal: number,
  ) {
    super();
  }
}
