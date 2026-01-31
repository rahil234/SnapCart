import { Module } from '@nestjs/common';
import { CartService } from '@/domain/cart/services/cart.service';

@Module({
  providers: [CartService],
  exports: [CartService],
})
export class CartDomainModule {}
