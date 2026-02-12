import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/shared/prisma/prisma.module';
import { RazorpayPaymentService } from '../infrastructure/services';
import {
  CreatePaymentHandler,
  VerifyPaymentHandler,
} from './commands/handlers';

const CommandHandlers = [CreatePaymentHandler, VerifyPaymentHandler];

@Module({
  imports: [CqrsModule, ConfigModule, PrismaModule],
  providers: [
    ...CommandHandlers,
    {
      provide: 'PaymentService',
      useClass: RazorpayPaymentService,
    },
  ],
  exports: ['PaymentService'],
})
export class PaymentApplicationModule {}
