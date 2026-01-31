import Joi from 'joi';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { PaymentDomainModule } from '../../domain/payment/payment.domain.module';
import { PaymentController } from '../../infrastructure/payment/controllers/payment.controller';
import { OrderApplicationModule } from '../order/order.application.module';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        RAZORPAY_KEY_ID: Joi.string().required(),
        RAZORPAY_KEY_SECRET: Joi.string().required(),
        RAZORPAY_WEBHOOK_SECRET: Joi.string().required(),
      }),
    }),
    PaymentDomainModule,
    OrderApplicationModule,
  ],
  controllers: [PaymentController],
})
export class PaymentApplicationModule {}
