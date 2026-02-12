import { Module } from '@nestjs/common';

import { ProductHttpModule } from '@/modules/product/interfaces/http/product.http.module';
import { ProductApplicationModule } from '@/modules/product/application/product-application.module';

@Module({
  imports: [ProductApplicationModule, ProductHttpModule],
  exports: [ProductApplicationModule],
})
export class ProductModule {}
