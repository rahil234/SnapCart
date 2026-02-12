import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import {
  AdminOrderController,
  CustomerOrderController,
  SellerOrderController,
} from './controllers';
import { OrderApplicationModule } from '@/modules/order/application/order-application.module';

@Module({
  imports: [CqrsModule, OrderApplicationModule],
  controllers: [
    CustomerOrderController,
    AdminOrderController,
    SellerOrderController,
  ],
})
export class OrderHttpModule {}
