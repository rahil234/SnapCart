import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ProductController } from '@/interfaces/http/product/product.controller';

import { GetProductsHandler } from '@/application/product/queries/handlers/get-products.handler';
import { CreateProductHandler } from '@/application/product/commands/handlers/create-product.handler';
import { UpdateProductHandler } from '@/application/product/commands/handlers/update-product.handler';
import { GetProductByIdHandler } from '@/application/product/queries/handlers/get-product-by-id.handler';
import { PrismaProductRepository } from '@/infrastructure/product/persistence/repositories/prisma-product.repository';
import { GetProductsFeedHandler } from '@/application/product/queries/handlers';

export const ProductHandlers = [
  CreateProductHandler,
  UpdateProductHandler,
  GetProductsHandler,
  GetProductByIdHandler,
  GetProductsFeedHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [ProductController],
  providers: [
    ...ProductHandlers,
    {
      provide: 'ProductRepository',
      useClass: PrismaProductRepository,
    },
  ],
})
export class ProductModule {}
