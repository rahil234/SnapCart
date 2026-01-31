import { Module } from '@nestjs/common';
import { PrismaCartRepository } from './repositories/prisma-cart.repository';
import { PrismaCartItemRepository } from './repositories/prisma-cart-item.repository';

@Module({
  providers: [
    {
      provide: 'CartRepository',
      useClass: PrismaCartRepository,
    },
    {
      provide: 'CartItemRepository',
      useClass: PrismaCartItemRepository,
    },
  ],
  exports: ['CartRepository', 'CartItemRepository'],
})
export class CartInfrastructureModule {}
