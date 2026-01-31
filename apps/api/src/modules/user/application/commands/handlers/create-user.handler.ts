import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject, ConflictException } from '@nestjs/common';
import { CreateUserCommand } from '../create-user.command';
import { UserRepository } from '@/modules/user/domain/repositories/user.repository';
import { User } from '@/modules/user/domain/entities/user.entity';
import { UserCreatedEvent } from '@/modules/user/domain/events';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { email, phone, password, role } = command;

    // Check if user already exists
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

    // Persist the user
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
