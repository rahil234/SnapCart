import Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { forwardRef, Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthDomainModule } from '../../domain/auth/auth.domain.module';
import { AuthController } from '../../infrastructure/auth/controllers/auth.controller';
import { UserApplicationModule } from '../user/user.application.module';
import { JwtService } from '@/common/jwt/jwt.service';
import { OtpAuthStrategy } from '../../infrastructure/auth/strategies/otp/otp.strategy';
import { AuthStrategyFactory } from '@/domain/auth/factories';
import { OtpStrategyProvider } from '../../infrastructure/auth/strategies/otp/otp-strategy.provider';
import { PasswordAuthStrategy } from '../../infrastructure/auth/strategies/password/password.strategy';
import { PasswordStrategyProvider } from '../../infrastructure/auth/strategies/password/password-strategy.provider';
import { AccountResolver } from '@/infrastructure/auth/resolvers';

@Global()
@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().default('15m'),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().default('7d'),
      }),
    }),
    AuthDomainModule,
    forwardRef(() => UserApplicationModule),
  ],
  controllers: [AuthController],
  providers: [
    JwtService,
    PasswordAuthStrategy,
    OtpAuthStrategy,
    AuthStrategyFactory,
    PasswordStrategyProvider,
    OtpStrategyProvider,
    AccountResolver,
  ],
  exports: [JwtService],
})
export class AuthApplicationModule {}
