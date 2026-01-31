import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RequestOTPCommand } from '../request-otp.command';
import { OTPRepository } from '@/domain/auth/repositories';
import { OTPService } from '@/domain/auth/services';
import { OTPSession } from '@/domain/auth/entities';
import { OTPRequestedEvent } from '@/domain/auth/events';

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
