import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';

import { AccountStatus } from '@/modules/user/domain/enums';
import { User } from '@/modules/user/domain/entities/user.entity';
import { UserStatusChangedEvent } from '@/shared/events/user.events';
import { UpdateUserStatusCommand } from '../update-user-status.command';
import { UserRepository } from '@/modules/user/domain/repositories/user.repository';

@CommandHandler(UpdateUserStatusCommand)
export class UpdateUserStatusHandler implements ICommandHandler<UpdateUserStatusCommand> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateUserStatusCommand): Promise<User> {
    const { userId, status } = command;

    // Find user
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const oldStatus = user.getStatus();

    // Update status using business methods
    switch (status) {
      case AccountStatus.ACTIVE:
        user.activate();
        break;
      case AccountStatus.SUSPENDED:
        user.suspend();
        break;
      case AccountStatus.DISABLED:
        user.disable();
        break;
    }

    // Persist user
    const updatedUser = await this.userRepository.update(user);

    // Emit event
    await this.eventBus.publish(
      new UserStatusChangedEvent(updatedUser.id, oldStatus, status),
    );

    return updatedUser;
  }
}
