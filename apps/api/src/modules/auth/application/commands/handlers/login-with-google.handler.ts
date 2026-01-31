import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';

import { LoginWithGoogleCommand } from '../login-with-google.command';
import { UserRepository } from '@/modules/user/domain/repositories/user.repository';
import { CustomerProfileRepository } from '@/modules/user/domain/repositories/customer-profile.repository';

import { User } from '@/modules/user/domain/entities/user.entity';
import { UserRole } from '@/modules/user/domain/enums';
import { AuthMethod } from '@/modules/auth/domain/enums';
import { CustomerProfile } from '@/modules/user/domain/entities/customer-profile.entity';
import {
  UserLoggedInEvent,
  UserRegisteredEvent,
} from '@/modules/auth/domain/events';
import {
  GoogleAuthService,
  TokenService,
} from '@/modules/auth/domain/services';

export interface GoogleLoginResult {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}

@CommandHandler(LoginWithGoogleCommand)
export class LoginWithGoogleHandler implements ICommandHandler<
  LoginWithGoogleCommand,
  GoogleLoginResult
> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('CustomerProfileRepository')
    private readonly customerProfileRepository: CustomerProfileRepository,
    @Inject('GoogleAuthService')
    private readonly googleAuthService: GoogleAuthService,
    @Inject('TokenService')
    private readonly tokenService: TokenService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: LoginWithGoogleCommand): Promise<GoogleLoginResult> {
    const { idToken } = command;

    // Verify Google token
    const googleUser = await this.googleAuthService.verifyIdToken(idToken);

    if (!googleUser.email) {
      throw new UnauthorizedException('Google account does not have an email');
    }

    // Check if user exists
    let user = await this.userRepository.findByEmail(googleUser.email);
    let isNewUser = false;

    if (!user) {
      // Create new user
      user = User.create(googleUser.email, null, null, UserRole.CUSTOMER);
      user = await this.userRepository.save(user);

      // Create customer profile
      const customerProfile = CustomerProfile.create(
        user.id,
        googleUser.name ?? null,
      );
      await this.customerProfileRepository.save(customerProfile);

      isNewUser = true;

      // Emit registration event
      await this.eventBus.publish(
        new UserRegisteredEvent(user.id, googleUser.email, null),
      );
    }

    // Check if user is active
    if (!user.isActive()) {
      throw new UnauthorizedException('Account is not active');
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

    // Emit login event
    await this.eventBus.publish(
      new UserLoggedInEvent(user.id, user.getRole() as any, AuthMethod.GOOGLE),
    );

    return { accessToken, refreshToken, isNewUser };
  }
}
