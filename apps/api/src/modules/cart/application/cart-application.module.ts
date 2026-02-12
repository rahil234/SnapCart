import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CartEventHandlers } from '@/modules/cart/application/events/handlers';
import { CartQueryHandlers } from '@/modules/cart/application/queries/handlers';
import { CartCommandHandlers } from '@/modules/cart/application/commands/handlers';
import { UserApplicationModule } from '@/modules/user/application/user-application.module';
import { OfferApplicationModule } from '@/modules/offer/application/offer-application.module';
import { CouponApplicationModule } from '@/modules/coupon/application/coupon-application.module';
import { ProductApplicationModule } from '@/modules/product/application/product-application.module';
import { DiscountCalculatorService } from '@/modules/cart/domain/services/discount-calculator.service';
import { PrismaCartRepository } from '@/modules/cart/infrastructure/persistence/prisma-cart.repository';
import { PrismaCartItemRepository } from '@/modules/cart/infrastructure/persistence/prisma-cart-item.repository';
import { PrismaCartReadRepository } from '@/modules/cart/infrastructure/persistence/prisma-cart-read.repository';

@Module({
  imports: [
    CqrsModule,
    UserApplicationModule,
    ProductApplicationModule,
    CouponApplicationModule,
    OfferApplicationModule,
  ],
  providers: [
    {
      provide: 'CartRepository',
      useClass: PrismaCartRepository,
    },
    {
      provide: 'CartItemRepository',
      useClass: PrismaCartItemRepository,
    },
    {
      provide: 'CartReadRepository',
      useClass: PrismaCartReadRepository,
    },
    DiscountCalculatorService,
    ...CartCommandHandlers,
    ...CartQueryHandlers,
    ...CartEventHandlers.handlers,
  ],
  exports: [DiscountCalculatorService, 'CartRepository'],
})
export class CartApplicationModule {}
