import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateUserCommand } from '../update-user.command';
import { UserRepository } from '@/modules/user/domain/repositories/user.repository';
import { CustomerProfileRepository } from '@/modules/user/domain/repositories/customer-profile.repository';
import { User } from '@/modules/user/domain/entities/user.entity';
import { UserUpdatedEvent } from '@/modules/user/domain/events';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('CustomerProfileRepository')
    private readonly customerProfileRepository: CustomerProfileRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const { userId, name, email, phone, dob, gender } = command;

    // Find user
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

    // Update customer profile if exists
    if (user.isCustomer()) {
      const profile = await this.customerProfileRepository.findByUserId(userId);
      if (profile) {
        if (name !== undefined) {
          profile.updateName(name);
          changes.name = name;
        }
        if (dob !== undefined) {
          profile.updateDob(dob);
          changes.dob = dob;
        }
        if (gender !== undefined) {
          profile.updateGender(gender);
          changes.gender = gender;
        }
        await this.customerProfileRepository.update(profile);
      }
    }

    // Persist user
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
