import { Inject } from '@nestjs/common';
import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { Cart } from '@/modules/cart/domain/entities';
import { CartCreatedEvent } from '@/modules/cart/domain/events';
import { CartRepository } from '@/modules/cart/domain/repositories';
import { CustomerProfileCreatedEvent } from '@/shared/events/user.events';

@EventsHandler(CustomerProfileCreatedEvent)
export class OnCustomerCreatedHandler implements IEventHandler<CustomerProfileCreatedEvent> {
  constructor(
    @Inject('CartRepository')
    private readonly cartRepository: CartRepository,
    private readonly eventBus: EventBus,
  ) {}

  async handle(event: CustomerProfileCreatedEvent) {
    const { profileId } = event;

    console.log('Handling CustomerProfileCreatedEvent for profile ID:', event);

    const existingCart = await this.cartRepository.findByCustomerId(profileId);

    if (existingCart) {
      return;
    }

    const cart = Cart.create(profileId);
    await this.cartRepository.save(cart);

    this.eventBus.publish(new CartCreatedEvent(cart.getId(), profileId));
  }
}
