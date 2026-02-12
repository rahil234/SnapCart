import {
  Inject,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';

import { LoginCommand } from '../login.command';
import { AuthMethod } from '@/modules/auth/domain/enums';
import { UserLoggedInEvent } from '@/shared/events/auth.events';
import { OTPRepository } from '@/modules/auth/domain/repositories';
import { UserRepository } from '@/modules/user/domain/repositories/user.repository';
import {
  PasswordHashService,
  TokenService,
} from '@/modules/auth/domain/services';

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<
  LoginCommand,
  LoginResult
> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('OTPRepository')
    private readonly otpRepository: OTPRepository,
    @Inject('PasswordHashService')
    private readonly passwordHashService: PasswordHashService,
    @Inject('TokenService')
    private readonly tokenService: TokenService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const { identifier, method, password, otp } = command;

    // Find user by email or phone
    let user = await this.userRepository.findByEmail(identifier);
    if (!user) {
      user = await this.userRepository.findByPhone(identifier);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive()) {
      throw new UnauthorizedException('Account is not active');
    }

    // Validate based on auth method
    if (method === AuthMethod.PASSWORD) {
      if (!password) {
        throw new BadRequestException('Password is required');
      }

      const userPassword = user.getPassword();
      if (!userPassword) {
        throw new UnauthorizedException(
          'Password login not available for this account',
        );
      }

      const isValid = await this.passwordHashService.compare(
        password,
        userPassword,
      );
      if (!isValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
    } else if (method === AuthMethod.OTP) {
      if (!otp) {
        throw new BadRequestException('OTP is required');
      }

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

      await this.otpRepository.save(otpSession);
    } else {
      throw new BadRequestException('Invalid auth method');
    }

    // Generate tokens
    const accessToken = this.tokenService.generateAccessToken({
      sub: user.id,
      role: user.getRole(),
    });

    const refreshToken = this.tokenService.generateRefreshToken({
      sub: user.id,
      role: user.getRole(),
    });

    // Emit event
    await this.eventBus.publish(
      new UserLoggedInEvent(user.id, user.getRole() as any, method),
    );

    return { accessToken, refreshToken };
  }
}
