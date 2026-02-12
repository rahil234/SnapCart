import { Inject, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';

import { ResetPasswordCommand } from '../reset-password.command';
import { UserRepository } from '@/modules/user/domain/repositories';
import { OTPRepository } from '@/modules/auth/domain/repositories';
import { PasswordHashService } from '@/modules/auth/domain/services';
import { PasswordResetEvent } from '@/shared/events/auth.events';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('OTPRepository')
    private readonly otpRepository: OTPRepository,
    @Inject('PasswordHashService')
    private readonly passwordHashService: PasswordHashService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    const { identifier, otp, newPassword } = command;

    // Find user
    let user = await this.userRepository.findByEmail(identifier);
    if (!user) {
      user = await this.userRepository.findByPhone(identifier);
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify OTP
    const otpSession =
      await this.otpRepository.findLatestByIdentifier(identifier);

    if (!otpSession) {
      throw new UnauthorizedException('No OTP session found');
    }

    const isValid = otpSession.verify(otp);

    if (!isValid) {
      await this.otpRepository.save(otpSession); // Save updated attempts
      throw new UnauthorizedException('Invalid OTP');
    }

    // Mark OTP as verified
    await this.otpRepository.save(otpSession);

    // Hash new password
    const hashedPassword = await this.passwordHashService.hash(newPassword);

    // Update user password
    user.updatePassword(hashedPassword);

    // Save user
    await this.userRepository.update(user);

    // Emit event
    await this.eventBus.publish(new PasswordResetEvent(user.id));
  }
}
