import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CheckoutController } from '@/modules/checkout/interfaces/http/controllers';
import { CheckoutApplicationModule } from '@/modules/checkout/application/checkout-application.module';

@Module({
  imports: [CqrsModule, CheckoutApplicationModule],
  controllers: [CheckoutController],
})
export class CheckoutHttpModule {}
