import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductDomainModule } from '@/domain/product/product.domain.module';
import { ProductInfrastructureModule } from '@/infrastructure/product/product.infrastructure.module';

import {
  CreateProductHandler,
  UpdateProductHandler,
} from '@/application/product/commands/handlers';

import {
  GetProductByIdHandler,
  GetProductsHandler,
  GetProductsFeedHandler,
  GetVariantByIdHandler,
  GetVariantsByProductIdHandler,
} from '@/application/product/queries/handlers';

const CommandHandlers = [CreateProductHandler, UpdateProductHandler];
const QueryHandlers = [
  GetProductByIdHandler,
  GetProductsHandler,
  GetProductsFeedHandler,
  GetVariantByIdHandler,
  GetVariantsByProductIdHandler,
];

@Module({
  imports: [CqrsModule, ProductDomainModule, ProductInfrastructureModule],
  providers: [...CommandHandlers, ...QueryHandlers],
  exports: [...CommandHandlers, ...QueryHandlers],
})
export class ProductApplicationModule {}
