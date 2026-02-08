import { Module } from '@nestjs/common';

import { CartCommandHandlers } from '@/modules/cart/application/commands/handlers';
import { PrismaCartRepository } from '@/modules/cart/infrastructure/persistence/prisma-cart.repository';
import { PrismaCartItemRepository } from '@/modules/cart/infrastructure/persistence/prisma-cart-item.repository';
import { PrismaCartReadRepository } from '@/modules/cart/infrastructure/persistence/prisma-cart-read.repository';
import { CartQueryHandlers } from '@/modules/cart/application/queries/handlers';
import { CartEventHandlers } from '@/modules/cart/application/events/handlers';
import { CqrsModule } from '@nestjs/cqrs';
import { UserApplicationModule } from '@/modules/user/application/user-application.module';
import { ProductApplicationModule } from '@/modules/product/application/product-application.module';

@Module({
  imports: [CqrsModule, UserApplicationModule, ProductApplicationModule],
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
    ...CartCommandHandlers,
    ...CartQueryHandlers,
    ...CartEventHandlers.handlers,
  ],
})
export class CartApplicationModule {}
