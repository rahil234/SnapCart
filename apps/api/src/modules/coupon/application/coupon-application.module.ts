import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import QueryHandlers from './queries/handlers';
import CommandHandlers from './commands/handlers';

import { PrismaCouponRepository } from '@/modules/coupon/infrastructure/persistence/repositories/prisma-coupon.repository';

@Module({
  imports: [CqrsModule],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: 'CouponRepository',
      useClass: PrismaCouponRepository,
    },
  ],
  exports: ['CouponRepository'],
})
export class CouponApplicationModule {}
