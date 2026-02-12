import { Inject, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';

import { RegisterCommand } from '../register.command';
import { UserRole } from '@/modules/user/domain/enums';
import { User } from '@/modules/user/domain/entities/user.entity';
import { UserRegisteredEvent } from '@/shared/events/auth.events';
import { PasswordHashService } from '@/modules/auth/domain/services';
import { UserRepository } from '@/modules/user/domain/repositories/user.repository';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('PasswordHashService')
    private readonly passwordHashService: PasswordHashService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RegisterCommand): Promise<User> {
    const { email, phone, password } = command;

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

    // Hash password
    const hashedPassword = await this.passwordHashService.hash(password);

    // Create user entity
    const user = User.create(email, phone, hashedPassword, UserRole.CUSTOMER);

    // Persist user
    const createdUser = await this.userRepository.save(user);

    // Emit event
    await this.eventBus.publish(
      new UserRegisteredEvent(createdUser.id, email, phone),
    );

    return createdUser;
  }
}
