import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

import { CommandHandlers } from '@/modules/auth/application/commands/handlers';

import { JwtTokenService } from '@/modules/auth/infrastructure/services/jwt-token.service';
import { DefaultOTPService } from '@/modules/auth/infrastructure/services/default-otp.service';
import { GoogleOAuth2Service } from '@/modules/auth/infrastructure/services/google-oauth2.service';
import { BcryptPasswordHashService } from '@/modules/auth/infrastructure/services/bcrypt-password-hash.service';

import { UserModule } from '@/modules/user/user.module';
import { JwtModule } from '@/modules/auth/infrastructure/jwt/jwt.module';
import { RedisOTPRepository } from '@/modules/auth/infrastructure/persistence/repositories/redis-otp.repository';

@Module({
  imports: [CqrsModule, ConfigModule, JwtModule, UserModule],
  providers: [
    ...CommandHandlers.handlers,
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
  exports: [...CommandHandlers.handlers],
})
export class AuthApplicationModule {}
