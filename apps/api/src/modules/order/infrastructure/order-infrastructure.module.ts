import { Module } from '@nestjs/common';
import { PrismaModule } from '@/shared/prisma/prisma.module';
import { PrismaOrderRepository } from './persistence';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: 'OrderRepository',
      useClass: PrismaOrderRepository,
    },
  ],
  exports: ['OrderRepository'],
})
export class OrderInfrastructureModule {}
