import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CartApplicationModule } from '@/modules/cart/application/cart-application.module';

import { CartController } from '@/modules/cart/interfaces/http/controllers/cart.controller';

@Module({
  imports: [CqrsModule, CartApplicationModule],
  controllers: [CartController],
})
export class CartHttpModule {}
