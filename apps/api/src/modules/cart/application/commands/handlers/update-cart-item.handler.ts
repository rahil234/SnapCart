import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';

import { CartRepository } from '@/modules/cart/domain/repositories';
import { CartItem } from '@/modules/cart/domain/entities';
import { UpdateCartItemCommand } from '../update-cart-item.command';
import { ItemQuantityUpdatedEvent } from '@/modules/cart/domain/events';
import {
  CUSTOMER_IDENTITY_RESOLVER,
  CustomerIdentityResolver,
} from '@/modules/user/application/ports/customer-identity.resolver';
import { CartItemRepository } from '@/modules/cart/domain/repositories/cart-item.repository';

@CommandHandler(UpdateCartItemCommand)
export class UpdateCartItemHandler implements ICommandHandler<UpdateCartItemCommand> {
  constructor(
    @Inject('CartRepository')
    private readonly cartRepository: CartRepository,
    @Inject('CartItemRepository')
    private readonly cartItemRepository: CartItemRepository,
    @Inject(CUSTOMER_IDENTITY_RESOLVER)
    private readonly customerIdentityResolver: CustomerIdentityResolver,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateCartItemCommand): Promise<CartItem> {
    const { userId, itemId, quantity } = command;

    const customerId =
      await this.customerIdentityResolver.resolveCustomerIdByUserId(userId);

    // Get cart item
    const cartItem = await this.cartItemRepository.findById(itemId);
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    const cart = await this.cartRepository.findById(cartItem.getCartId());

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (cart.getCustomerId() !== customerId) {
      throw new ForbiddenException(
        'You do not have permission to modify this cart item',
      );
    }

    // Update quantity
    const oldQuantity = cartItem.getQuantity();
    cartItem.updateQuantity(quantity);

    await this.cartItemRepository.save(cartItem);

    // Publish domain event
    this.eventBus.publish(
      new ItemQuantityUpdatedEvent(cart.getId(), itemId, oldQuantity, quantity),
    );

    return cartItem;
  }
}
