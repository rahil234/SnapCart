import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';

import { VerifyOTPCommand } from '../verify-otp.command';
import { OTPVerifiedEvent } from '@/shared/events/auth.events';
import { OTPRepository } from '@/modules/auth/domain/repositories';

@CommandHandler(VerifyOTPCommand)
export class VerifyOTPHandler implements ICommandHandler<
  VerifyOTPCommand,
  boolean
> {
  constructor(
    @Inject('OTPRepository')
    private readonly otpRepository: OTPRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: VerifyOTPCommand): Promise<boolean> {
    const { identifier, otp } = command;

    // Find latest OTP session
    const otpSession =
      await this.otpRepository.findLatestByIdentifier(identifier);

    if (!otpSession) {
      throw new UnauthorizedException('No OTP session found');
    }

    // Verify OTP
    const isValid = otpSession.verify(otp);

    if (!isValid) {
      await this.otpRepository.save(otpSession); // Save updated attempts
      throw new UnauthorizedException('Invalid OTP');
    }

    // Save a verified session
    await this.otpRepository.save(otpSession);

    // Emit event
    await this.eventBus.publish(new OTPVerifiedEvent(identifier));

    return true;
  }
}
