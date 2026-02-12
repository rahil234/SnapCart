import { Module } from '@nestjs/common';
import { PaymentHttpModule } from './interfaces/http/payment-http.module';

@Module({
  imports: [PaymentHttpModule],
})
export class PaymentModule {}
