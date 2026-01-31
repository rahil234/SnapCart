import { Module } from '@nestjs/common';

import { ProductController } from '@/infrastructure/product/controllers/product.controller';
import { PrismaProductRepository } from '@/infrastructure/product/persistence/repositories/prisma-product.repository';

@Module({
  controllers: [ProductController],
  providers: [
    {
      provide: 'ProductRepository',
      useClass: PrismaProductRepository,
    },
  ],
  exports: ['ProductRepository'],
})
export class ProductInfrastructureModule {}
