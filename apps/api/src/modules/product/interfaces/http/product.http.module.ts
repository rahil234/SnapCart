import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { APP_FILTER } from '@nestjs/core';

import { ProductController } from './controllers/product.controller';
import { VariantController } from './controllers/variant.controller';

import { ProductPrismaExceptionFilter } from '@/modules/product/interfaces/http/product-exception.filter';
import { PrismaProductRepository } from '@/modules/product/infrastructure/persistence/repositories/prisma-product.repository';

// Command Handlers
import {
  CreateProductHandler,
  UpdateProductHandler,
  CreateVariantHandler,
  UpdateVariantHandler,
  UpdateVariantStockHandler,
} from '@/modules/product/application/commands/handlers';

// Query Handlers
import {
  GetProductsHandler,
  GetProductByIdHandler,
  GetVariantByIdHandler,
  GetVariantsByProductIdHandler,
} from '@/modules/product/application/queries/handlers';

const CommandHandlers = [
  CreateProductHandler,
  UpdateProductHandler,
  CreateVariantHandler,
  UpdateVariantHandler,
  UpdateVariantStockHandler,
];

const QueryHandlers = [
  GetProductsHandler,
  GetProductByIdHandler,
  GetVariantByIdHandler,
  GetVariantsByProductIdHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [ProductController, VariantController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ProductPrismaExceptionFilter,
    },
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: 'ProductRepository',
      useClass: PrismaProductRepository,
    },
  ],
})
export class ProductHttpModule {}
