import { Inject, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';

import { CreateUserCommand } from '../create-user.command';
import { UserCreatedEvent } from '@/shared/events/user.events';
import { User } from '@/modules/user/domain/entities/user.entity';
import { UserRepository } from '@/modules/user/domain/repositories/user.repository';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { email, phone, password, role } = command;

    // Check if a user already exists
    if (email) {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    if (phone) {
      const existingUser = await this.userRepository.findByPhone(phone);
      if (existingUser) {
        throw new ConflictException('User with this phone already exists');
      }
    }

    // Create domain entity using factory method
    const user = User.create(email, phone, password, role);

    // Persist the user aggregate (includes profiles)
    const createdUser = await this.userRepository.save(user);

    // Emit domain event
    await this.eventBus.publish(
      new UserCreatedEvent(
        createdUser.id,
        createdUser.getEmail(),
        createdUser.getPhone(),
        createdUser.getRole(),
      ),
    );

    return createdUser;
  }
}
