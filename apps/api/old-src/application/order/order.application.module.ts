import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderDomainModule } from '../../domain/order/order.domain.module';
import { OrderInfrastructureModule } from '../../infrastructure/order/order.infrastructure.module';
import { OrderController } from '../../infrastructure/order/controllers/order.controller';
import { UserApplicationModule } from '../user/user.application.module';
import { ProductApplicationModule } from '../product/product.application.module';

@Module({
  imports: [
    CqrsModule,
    OrderDomainModule,
    OrderInfrastructureModule,
    UserApplicationModule,
    ProductApplicationModule,
  ],
  controllers: [OrderController],
})
export class OrderApplicationModule {}
