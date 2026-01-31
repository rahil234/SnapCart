import Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { EmailDomainModule } from '../../domain/email/email.domain.module';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      cache: true,
      validationSchema: Joi.object({
        TWILIO_ACCOUNT_SID: Joi.string().required(),
        TWILIO_AUTH_TOKEN: Joi.string().required(),
        TWILIO_MSG_SERVICE_SID: Joi.string().required(),
      }),
    }),
    EmailDomainModule,
  ],
  exports: [EmailDomainModule],
})
export class EmailApplicationModule {}
