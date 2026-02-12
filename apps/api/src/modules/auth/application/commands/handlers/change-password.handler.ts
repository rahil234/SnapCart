import {
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { ChangePasswordCommand } from '../change-password.command';
import { PasswordChangedEvent } from '@/shared/events/auth.events';
import { UserRepository } from '@/modules/user/domain/repositories';
import { PasswordHashService } from '@/modules/auth/domain/services';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('PasswordHashService')
    private readonly passwordHashService: PasswordHashService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ChangePasswordCommand): Promise<void> {
    const { userId, currentPassword, newPassword } = command;

    // Find user
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify the current password
    const userPassword = user.getPassword();

    if (!userPassword) {
      throw new UnauthorizedException(
        'Password change not available for this account',
      );
    }

    const isValid = await this.passwordHashService.compare(
      currentPassword,
      userPassword,
    );

    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await this.passwordHashService.hash(newPassword);

    // Update password
    user.updatePassword(hashedPassword);

    // Save user
    await this.userRepository.update(user);

    // Emit event
    await this.eventBus.publish(new PasswordChangedEvent(user.id));
  }
}
