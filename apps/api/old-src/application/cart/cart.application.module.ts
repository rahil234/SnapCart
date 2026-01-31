import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CartDomainModule } from '../../domain/cart/cart.domain.module';
import { CartInfrastructureModule } from '../../infrastructure/cart/cart.infrastructure.module';
import { CartController } from '../../infrastructure/cart/controllers/cart.controller';
import { ProductApplicationModule } from '../product/product.application.module';

@Module({
  imports: [CqrsModule, CartDomainModule, CartInfrastructureModule, ProductApplicationModule],
  controllers: [CartController],
})
export class CartApplicationModule {}
