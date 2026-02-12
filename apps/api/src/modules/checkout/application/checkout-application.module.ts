import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CheckoutPreviewHandler } from './queries/handlers';
import { CheckoutCommitHandler } from './commands/handlers';
import { PricingCalculationService } from '../domain/services';
import { UserApplicationModule } from '@/modules/user/application/user-application.module';
import { CouponApplicationModule } from '@/modules/coupon/application/coupon-application.module';
import { WalletApplicationModule } from '@/modules/wallet/application/wallet-application.module';

const QueryHandlers = [CheckoutPreviewHandler];
const CommandHandlers = [CheckoutCommitHandler];

@Module({
  imports: [
    CqrsModule,
    CouponApplicationModule,
    UserApplicationModule,
    WalletApplicationModule,
  ],
  providers: [PricingCalculationService, ...QueryHandlers, ...CommandHandlers],
  exports: [PricingCalculationService],
})
export class CheckoutApplicationModule {}
