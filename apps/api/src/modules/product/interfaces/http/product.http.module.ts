import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ProductController } from '@/modules/product/interfaces/http/product.controller';

import { PrismaProductRepository } from '@/modules/product/infrastructure/persistence/repositories/prisma-product.repository';

import {
  CreateProductHandler,
  UpdateProductHandler,
} from '@/modules/product/application/commands/handlers';

import {
  GetProductsHandler,
  GetProductByIdHandler,
} from '@/modules/product/application/queries/handlers';

export const Handlers = [
  CreateProductHandler,
  UpdateProductHandler,
  GetProductsHandler,
  GetProductByIdHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [ProductController],
  providers: [
    ...Handlers,
    {
      provide: 'ProductRepository',
      useClass: PrismaProductRepository,
    },
  ],
})
export class ProductHttpModule {}
