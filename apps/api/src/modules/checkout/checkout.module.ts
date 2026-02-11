import { Module } from '@nestjs/common';

import { CheckoutHttpModule } from '@/modules/checkout/interfaces/http/checkout-http.module';

@Module({
  imports: [CheckoutHttpModule],
})
export class CheckoutModule {}
