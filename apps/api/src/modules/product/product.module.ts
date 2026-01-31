import { Module } from '@nestjs/common';

import { ProductHttpModule } from '@/modules/product/interfaces/http/product.http.module';

@Module({
  imports: [ProductHttpModule],
  exports: [ProductHttpModule],
})
export class ProductModule {}
