import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from '@/modules/auth/interfaces/http/auth.controller';

// Command Handlers
import {
  RegisterHandler,
  LoginHandler,
  LoginWithGoogleHandler,
  RequestOTPHandler,
  VerifyOTPHandler,
  RefreshTokenHandler,
} from '@/modules/auth/application/commands/handlers';

// Services
import { JwtTokenService } from '@/modules/auth/infrastructure/services/jwt-token.service';
import { DefaultOTPService } from '@/modules/auth/infrastructure/services/default-otp.service';
import { GoogleOAuth2Service } from '@/modules/auth/infrastructure/services/google-oauth2.service';
import { BcryptPasswordHashService } from '@/modules/auth/infrastructure/services/bcrypt-password-hash.service';

// Import User Module to get access to repositories
import { JwtModule } from '@/modules/auth/infrastructure/jwt/jwt.module';
import { UserHttpModule } from '@/modules/user/interfaces/http/user.http.module';
import { RedisOTPRepository } from '@/modules/auth/infrastructure/persistence/repositories/redis-otp.repository';

export const AuthCommandHandlers = [
  RegisterHandler,
  LoginHandler,
  LoginWithGoogleHandler,
  RequestOTPHandler,
  VerifyOTPHandler,
  RefreshTokenHandler,
];

@Module({
  imports: [CqrsModule, ConfigModule, JwtModule, UserHttpModule],
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
export class AuthHttpModule {}
