import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from '@/interfaces/http/auth/auth.controller';

// Command Handlers
import {
  RegisterHandler,
  LoginHandler,
  LoginWithGoogleHandler,
  RequestOTPHandler,
  VerifyOTPHandler,
  RefreshTokenHandler,
} from '@/application/auth/commands/handlers';

// Services
import { BcryptPasswordHashService } from '@/infrastructure/auth/services/bcrypt-password-hash.service';
import { JwtTokenService } from '@/infrastructure/auth/services/jwt-token.service';
import { GoogleOAuth2Service } from '@/infrastructure/auth/services/google-oauth2.service';
import { DefaultOTPService } from '@/infrastructure/auth/services/default-otp.service';

// Import User Module to get access to repositories
import { UserModule } from '@/interfaces/http/user/user.module';
import { JwtModule } from '@/infrastructure/auth/jwt/jwt.module';
import { RedisOTPRepository } from '@/infrastructure/auth/persistence/repositories/redis-otp.repository';

export const AuthCommandHandlers = [
  RegisterHandler,
  LoginHandler,
  LoginWithGoogleHandler,
  RequestOTPHandler,
  VerifyOTPHandler,
  RefreshTokenHandler,
];

@Module({
  imports: [CqrsModule, ConfigModule, UserModule, JwtModule],
  controllers: [AuthController],
  providers: [
    ...AuthCommandHandlers,
    {
      provide: 'OTPRepository',
      useClass: RedisOTPRepository,
    },
    {
      provide: 'PasswordHashService',
      useClass: BcryptPasswordHashService,
    },
    {
      provide: 'TokenService',
      useClass: JwtTokenService,
    },
    {
      provide: 'GoogleAuthService',
      useClass: GoogleOAuth2Service,
    },
    {
      provide: 'OTPService',
      useClass: DefaultOTPService,
    },
  ],
})
export class AuthModule {}
