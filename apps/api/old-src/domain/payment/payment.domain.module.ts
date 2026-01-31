import { Module } from '@nestjs/common';
import { RazorpayService } from '@/domain/payment/services/razorpay.service';
import { RazorpayWebhookService } from '@/domain/payment/services/razorpay-webhook.service';

@Module({
  providers: [RazorpayService, RazorpayWebhookService],
  exports: [RazorpayService, RazorpayWebhookService],
})
export class PaymentDomainModule {}
