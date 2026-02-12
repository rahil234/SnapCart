import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { ClearCartCommand } from '../clear-cart.command';
import { CartClearedEvent } from '@/modules/cart/domain/events';
import {
  CUSTOMER_IDENTITY_RESOLVER,
  CustomerIdentityResolver,
} from '@/modules/user/application/ports/customer-identity.resolver';

import { CartRepository } from '@/modules/cart/domain/repositories';
import { CartItemRepository } from '@/modules/cart/domain/repositories/cart-item.repository';

@CommandHandler(ClearCartCommand)
export class ClearCartHandler implements ICommandHandler<ClearCartCommand> {
  constructor(
    @Inject('CartRepository')
    private readonly cartRepository: CartRepository,
    @Inject('CartItemRepository')
    private readonly cartItemRepository: CartItemRepository,
    @Inject(CUSTOMER_IDENTITY_RESOLVER)
    private readonly customerIdentityResolver: CustomerIdentityResolver,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ClearCartCommand): Promise<void> {
    const { userId } = command;

    const customerId =
      await this.customerIdentityResolver.resolveCustomerIdByUserId(userId);

    // Get user's cart
    const cart = await this.cartRepository.findByCustomerId(customerId);
    if (!cart) {
      throw new NotFoundException('Cart not found for user');
    }

    // Clear all items
    cart.clear();
    await this.cartItemRepository.deleteByCartId(cart.getId());

    // Publish domain event
    this.eventBus.publish(new CartClearedEvent(cart.getId()));
  }
}
