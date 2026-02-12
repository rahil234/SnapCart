import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { CartItem } from '@/modules/cart/domain/entities';
import { CartRepository } from '@/modules/cart/domain/repositories';
import { AddItemToCartCommand } from '../add-item-to-cart.command';
import { ItemAddedToCartEvent } from '@/modules/cart/domain/events';
import {
  CUSTOMER_IDENTITY_RESOLVER,
  CustomerIdentityResolver,
} from '@/modules/user/application/ports/customer-identity.resolver';
import { CartItemRepository } from '@/modules/cart/domain/repositories/cart-item.repository';

@CommandHandler(AddItemToCartCommand)
export class AddItemToCartHandler implements ICommandHandler<AddItemToCartCommand> {
  constructor(
    @Inject('CartRepository')
    private readonly cartRepository: CartRepository,
    @Inject('CartItemRepository')
    private readonly cartItemRepository: CartItemRepository,
    @Inject(CUSTOMER_IDENTITY_RESOLVER)
    private readonly customerIdentityResolver: CustomerIdentityResolver,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AddItemToCartCommand): Promise<CartItem> {
    const { userId, productId, productVariantId, quantity } = command;

    const customerId =
      await this.customerIdentityResolver.resolveCustomerIdByUserId(userId);

    const cart = await this.cartRepository.findByCustomerId(customerId);
    if (!cart) {
      throw new NotFoundException('Cart not found for user');
    }

    // Check if this item already exists in the cart
    const existingItem =
      await this.cartItemRepository.findByCartIdAndProductVariantId(
        cart.getId(),
        productVariantId,
      );

    if (existingItem) {
      // Update quantity if item exists
      existingItem.incrementQuantity(quantity);
      await this.cartItemRepository.save(existingItem);
      return existingItem;
    }

    // Add new item to cart
    const cartItem = cart.addItem(productId, productVariantId, quantity);
    await this.cartItemRepository.save(cartItem);

    // Publish domain event
    this.eventBus.publish(
      new ItemAddedToCartEvent(
        cart.getId(),
        cartItem.getId(),
        productVariantId,
        quantity,
      ),
    );

    return cartItem;
  }
}
