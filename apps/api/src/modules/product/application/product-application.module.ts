import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { UserModule } from '@/modules/user/user.module';
import { ProductPolicy } from '@/modules/product/domain/policies';
import QueryHandlers from '@/modules/product/application/queries/handlers';
import CommandHandlers from '@/modules/product/application/commands/handlers';
import { StorageModule } from '@/shared/infrastructure/storage/storage.module';
import { SELLER_IDENTITY_PORT } from '@/modules/product/application/ports/seller-identity.port';
import { SellerIdentityAdapter } from '@/modules/user/infrastructure/adapters/seller-identity.adapter';
import { PrismaProductRepository } from '@/modules/product/infrastructure/persistence/repositories/prisma-product.repository';
import { PRODUCT_IDENTITY_RESOLVER } from '@/modules/product/application/ports/product-identity.resolver';
import { PrismaProductIdentityResolver } from '@/modules/product/infrastructure/adapters/prisma-product-identity.resolver';

@Module({
  imports: [CqrsModule, StorageModule, UserModule],
  providers: [
    ProductPolicy,
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: 'ProductRepository',
      useClass: PrismaProductRepository,
    },
    {
      provide: SELLER_IDENTITY_PORT,
      useExisting: SellerIdentityAdapter,
    },
    {
      provide: PRODUCT_IDENTITY_RESOLVER,
      useClass: PrismaProductIdentityResolver,
    },
  ],
  exports: [PRODUCT_IDENTITY_RESOLVER],
})
export class ProductApplicationModule {}
