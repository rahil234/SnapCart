import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PricingCalculationService } from '../domain/services';
import { CheckoutPreviewHandler } from './queries/handlers';
import { CheckoutCommitHandler } from './commands/handlers';
import { CouponApplicationModule } from '@/modules/coupon/application/coupon-application.module';
import { UserApplicationModule } from '@/modules/user/application/user-application.module';

const QueryHandlers = [CheckoutPreviewHandler];
const CommandHandlers = [CheckoutCommitHandler];

@Module({
  imports: [CqrsModule, CouponApplicationModule, UserApplicationModule],
  providers: [PricingCalculationService, ...QueryHandlers, ...CommandHandlers],
  exports: [PricingCalculationService],
})
export class CheckoutApplicationModule {}
