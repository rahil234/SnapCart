import { Module } from '@nestjs/common';
import { ProductService } from '@/domain/product/services/product.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductDomainModule {}
