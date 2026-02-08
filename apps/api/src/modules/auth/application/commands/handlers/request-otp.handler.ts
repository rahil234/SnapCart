import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';

import { RequestOTPCommand } from '../request-otp.command';
import { OTPService } from '@/modules/auth/domain/services';
import { OTPSession } from '@/modules/auth/domain/entities';
import { OTPRequestedEvent } from '@/shared/events/auth.events';
import { OTPRepository } from '@/modules/auth/domain/repositories';

@CommandHandler(RequestOTPCommand)
export class RequestOTPHandler implements ICommandHandler<RequestOTPCommand> {
  constructor(
    @Inject('OTPRepository')
    private readonly otpRepository: OTPRepository,
    @Inject('OTPService')
    private readonly otpService: OTPService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RequestOTPCommand): Promise<void> {
    const { identifier } = command;

    // Generate OTP
    const otpCode = this.otpService.generate();

    // Create OTP session
    const otpSession = OTPSession.create(identifier, otpCode, 5);

    // Save session
    await this.otpRepository.save(otpSession);

    // Send OTP
    await this.otpService.send(identifier, otpCode);

    // Emit event
    await this.eventBus.publish(
      new OTPRequestedEvent(identifier, otpSession.id),
    );
  }
}
