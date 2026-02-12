import { Module } from '@nestjs/common';

import { OrderHttpModule } from './interfaces/http/order.http.module';

@Module({
  imports: [OrderHttpModule],
})
export class OrderModule {}
