import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { PaymentController, WebhookController } from './controllers';
import { PaymentApplicationModule } from '../../application/payment-application.module';

@Module({
  imports: [CqrsModule, PaymentApplicationModule],
  controllers: [PaymentController, WebhookController],
})
export class PaymentHttpModule {}
