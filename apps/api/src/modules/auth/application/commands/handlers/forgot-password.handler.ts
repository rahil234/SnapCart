import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';

import { ForgotPasswordCommand } from '../forgot-password.command';
import { UserRepository } from '@/modules/user/domain/repositories';
import { OTPService } from '@/modules/auth/domain/services';
import { OTPSession } from '@/modules/auth/domain/entities';
import { OTPRepository } from '@/modules/auth/domain/repositories';
import { OTPRequestedEvent } from '@/shared/events/auth.events';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler
  implements ICommandHandler<ForgotPasswordCommand>
{
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('OTPRepository')
    private readonly otpRepository: OTPRepository,
    @Inject('OTPService')
    private readonly otpService: OTPService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ForgotPasswordCommand): Promise<void> {
    const { identifier } = command;

    // Check if user exists
    let user = await this.userRepository.findByEmail(identifier);
    if (!user) {
      user = await this.userRepository.findByPhone(identifier);
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate OTP
    const otpCode = this.otpService.generate();

    // Create OTP session
    const otpSession = OTPSession.create(identifier, otpCode, 5);

    // Save session
    await this.otpRepository.save(otpSession);

    // Send OTP to user's email or phone
    await this.otpService.send(identifier, otpCode);

    // Emit event
    await this.eventBus.publish(new OTPRequestedEvent(identifier));
  }
}
