import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';

import { UpdateUserCommand } from '../update-user.command';
import { UserUpdatedEvent } from '@/shared/events/user.events';
import { User } from '@/modules/user/domain/entities/user.entity';
import { UserRepository } from '@/modules/user/domain/repositories/user.repository';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const { userId, name, email, phone, dob, gender } = command;

    // Find user aggregate (includes profiles)
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const changes: Record<string, any> = {};

    // Update user fields
    if (email !== undefined) {
      user.updateEmail(email);
      changes.email = email;
    }

    if (phone !== undefined) {
      user.updatePhone(phone);
      changes.phone = phone;
    }

    // Update customer profile through aggregate root
    if (name !== undefined || dob !== undefined || gender !== undefined) {
      if (!user.hasCustomerProfile()) {
        throw new NotFoundException('Customer profile not found for this user');
      }

      user.updateCustomerProfile(name, dob, gender);

      if (name !== undefined) changes.name = name;
      if (dob !== undefined) changes.dob = dob;
      if (gender !== undefined) changes.gender = gender;
    }

    // Persist aggregate (includes profile updates)
    const updatedUser = await this.userRepository.update(user);

    // Emit event
    if (Object.keys(changes).length > 0) {
      await this.eventBus.publish(
        new UserUpdatedEvent(updatedUser.id, changes),
      );
    }

    return updatedUser;
  }
}
