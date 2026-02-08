import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';

import { CartRepository } from '@/modules/cart/domain/repositories';
import { ItemRemovedFromCartEvent } from '@/modules/cart/domain/events';
import { RemoveItemFromCartCommand } from '../remove-item-from-cart.command';
import {
  CUSTOMER_IDENTITY_RESOLVER,
  CustomerIdentityResolver,
} from '@/modules/user/application/ports/customer-identity.resolver';
import { CartItemRepository } from '@/modules/cart/domain/repositories/cart-item.repository';

@CommandHandler(RemoveItemFromCartCommand)
export class RemoveItemFromCartHandler implements ICommandHandler<RemoveItemFromCartCommand> {
  constructor(
    @Inject('CartRepository')
    private readonly cartRepository: CartRepository,
    @Inject('CartItemRepository')
    private readonly cartItemRepository: CartItemRepository,
    @Inject(CUSTOMER_IDENTITY_RESOLVER)
    private readonly customerIdentityResolver: CustomerIdentityResolver,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RemoveItemFromCartCommand): Promise<void> {
    const { userId, itemId } = command;

    const customerId =
      await this.customerIdentityResolver.resolveCustomerIdByUserId(userId);

    // Get cart item
    const cartItem = await this.cartItemRepository.findById(itemId);
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Verify ownership
    const cart = await this.cartRepository.findById(cartItem.getCartId());
    if (!cart || cart.getCustomerId() !== customerId) {
      throw new ForbiddenException('Not authorized to modify this cart item');
    }

    // Remove item
    cart.removeItem(itemId);
    await this.cartItemRepository.delete(itemId);

    // Publish domain event
    this.eventBus.publish(new ItemRemovedFromCartEvent(cart.getId(), itemId));
  }
}
