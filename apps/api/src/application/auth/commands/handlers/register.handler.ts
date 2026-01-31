import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject, ConflictException } from '@nestjs/common';
import { RegisterCommand } from '../register.command';
import { UserRepository } from '@/domain/user/repositories/user.repository';
import { CustomerProfileRepository } from '@/domain/user/repositories/customer-profile.repository';
import { User } from '@/domain/user/entities/user.entity';
import { CustomerProfile } from '@/domain/user/entities/customer-profile.entity';
import { UserRole } from '@/domain/user/enums';
import { PasswordHashService } from '@/domain/auth/services';
import { UserRegisteredEvent } from '@/domain/auth/events';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('CustomerProfileRepository')
    private readonly customerProfileRepository: CustomerProfileRepository,
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

    // Create customer profile
    const customerProfile = CustomerProfile.create(createdUser.id);
    await this.customerProfileRepository.save(customerProfile);

    // Emit event
    await this.eventBus.publish(
      new UserRegisteredEvent(createdUser.id, email, phone),
    );

    return createdUser;
  }
}
