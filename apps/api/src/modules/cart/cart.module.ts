import { Module } from '@nestjs/common';

import { CartHttpModule } from '@/modules/cart/interfaces/http/cart-http.module';

@Module({
  imports: [CartHttpModule],
})
export class CartModule {}
