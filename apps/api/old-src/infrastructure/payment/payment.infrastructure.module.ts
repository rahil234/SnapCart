import { Module } from '@nestjs/common';
import { PaymentDomainModule } from '../../domain/payment/payment.domain.module';

@Module({
  imports: [PaymentDomainModule],
  providers: [],
  exports: [],
})
export class PaymentInfrastructureModule {}
