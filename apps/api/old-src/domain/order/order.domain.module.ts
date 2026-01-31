import { Module } from '@nestjs/common';
import { OrderService } from '@/domain/order/services/order.service';
import { OrderNumberService } from '@/domain/order/services/order-number.service';

@Module({
  providers: [OrderService, OrderNumberService],
  exports: [OrderService, OrderNumberService],
})
export class OrderDomainModule {}
