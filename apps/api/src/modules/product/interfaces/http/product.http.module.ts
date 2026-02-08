import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { APP_FILTER } from '@nestjs/core';

import { ProductController } from './controllers/product.controller';
import { VariantController } from './controllers/variant.controller';
import { AdminProductController } from './controllers/admin-product.controller';
import { SellerProductController } from './controllers/seller-product.controller';
import { ProductPublicController } from './controllers/product-public.controller';

import { StorageModule } from '@/shared/infrastructure/storage/storage.module';
import { ProductPrismaExceptionFilter } from '@/modules/product/interfaces/http/exceptions/product-exception.filter';

@Module({
  imports: [CqrsModule, StorageModule],
  controllers: [
    ProductController,
    ProductPublicController,
    SellerProductController,
    AdminProductController,
    VariantController,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ProductPrismaExceptionFilter,
    },
  ],
})
export class ProductHttpModule {}
