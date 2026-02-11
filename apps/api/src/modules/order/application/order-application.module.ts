import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { PrismaModule } from '@/shared/prisma/prisma.module';
import { OrderInfrastructureModule } from '../infrastructure/order-infrastructure.module';
import { UserApplicationModule } from '@/modules/user/application/user-application.module';

import {
  GetAllOrdersHandler,
  GetMyOrdersHandler,
  GetOrderByIdHandler,
  GetSellerOrdersHandler,
} from './queries/handlers';

import {
  CancelOrderHandler,
  UpdateOrderStatusHandler,
} from './commands/handlers';

const QueryHandlers = [
  GetOrderByIdHandler,
  GetMyOrdersHandler,
  GetAllOrdersHandler,
  GetSellerOrdersHandler,
];

const CommandHandlers = [CancelOrderHandler, UpdateOrderStatusHandler];

@Module({
  imports: [
    CqrsModule,
    OrderInfrastructureModule,
    UserApplicationModule,
    PrismaModule,
  ],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class OrderApplicationModule {}
