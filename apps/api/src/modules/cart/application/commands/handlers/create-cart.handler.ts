import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { Cart } from '@/modules/cart/domain/entities';
import { CreateCartCommand } from '../create-cart.command';
import { CartCreatedEvent } from '@/modules/cart/domain/events';
import { CartRepository } from '@/modules/cart/domain/repositories';
import {
  CUSTOMER_IDENTITY_RESOLVER,
  CustomerIdentityResolver,
} from '@/modules/user/application/ports/customer-identity.resolver';

@CommandHandler(CreateCartCommand)
export class CreateCartHandler implements ICommandHandler<CreateCartCommand> {
  constructor(
    @Inject('CartRepository')
    private readonly cartRepository: CartRepository,
    @Inject(CUSTOMER_IDENTITY_RESOLVER)
    private readonly customerIdentityResolver: CustomerIdentityResolver,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateCartCommand): Promise<Cart> {
    const { userId } = command;

    const customerId =
      await this.customerIdentityResolver.resolveCustomerIdByUserId(userId);

    // Check if the cart already exists
    const existingCart = await this.cartRepository.findByCustomerId(customerId);
    if (existingCart) {
      return existingCart;
    }

    // Create a new cart
    const cart = Cart.create(customerId);
    await this.cartRepository.save(cart);

    // Publish domain event
    this.eventBus.publish(new CartCreatedEvent(cart.getId(), customerId));

    return cart;
  }
}
