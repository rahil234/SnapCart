import { Inject } from '@nestjs/common';
import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import {
  CustomerProfileCreatedEvent,
  UserCreatedEvent,
} from '@/shared/events/user.events';
import { CustomerProfile } from '@/modules/user/domain/entities';
import { UserRegisteredEvent } from '@/shared/events/auth.events';
import { CustomerRepository } from '@/modules/user/domain/repositories';

@EventsHandler(UserCreatedEvent, UserRegisteredEvent)
export class OnUserRegisteredHandler implements IEventHandler<
  UserCreatedEvent | UserRegisteredEvent
> {
  constructor(
    @Inject('CustomerRepository')
    private readonly customerProfileRepo: CustomerRepository,
    private readonly eventBus: EventBus,
  ) {}

  async handle(event: UserCreatedEvent | UserRegisteredEvent) {
    const { userId } = event;

    const existingProfile = await this.customerProfileRepo.findByUserId(userId);

    if (existingProfile) return;

    const customerProfile = CustomerProfile.create(event.userId);

    console.log('Creating customer profile for user:', event.userId);

    await this.customerProfileRepo.save(customerProfile);

    this.eventBus.publish(
      new CustomerProfileCreatedEvent(
        customerProfile.getId(),
        userId,
        new Date(),
      ),
    );
  }
}
