import Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { SmsDomainModule } from '../../domain/sms/sms.domain.module';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      cache: true,
      validationSchema: Joi.object({
        SENDGRID_API_KEY: Joi.string().required(),
        SENDGRID_FROM_EMAIL: Joi.string().email().required(),
      }),
    }),
    SmsDomainModule,
  ],
  exports: [SmsDomainModule],
})
export class SmsApplicationModule {}
