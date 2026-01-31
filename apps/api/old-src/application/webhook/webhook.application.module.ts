import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WebhookDomainModule } from '../../domain/webhook/webhook.domain.module';
import { RazorpayWebhookController } from '../../infrastructure/webhook/controllers/razorpay-webhook.controller';
import { PaymentApplicationModule } from '../payment/payment.application.module';

@Module({
  imports: [CqrsModule, WebhookDomainModule, PaymentApplicationModule],
  controllers: [RazorpayWebhookController],
})
export class WebhookApplicationModule {}
