import { Command } from '@nestjs/cqrs';

import { CartItem } from '@/modules/cart/domain/entities';

export class UpdateCartItemCommand extends Command<CartItem> {

  constructor(
    public readonly userId: string,
    public readonly itemId: string,
    public readonly quantity: number,
  ) {
    super();
  }
}
