import { Module } from '@nestjs/common';
import { PrismaOrderRepository } from './repositories/prisma-order.repository';

@Module({
  providers: [
    {
      provide: 'OrderRepository',
      useClass: PrismaOrderRepository,
    },
  ],
  exports: ['OrderRepository'],
})
export class OrderInfrastructureModule {}
