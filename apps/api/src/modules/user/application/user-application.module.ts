import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { EventHandlers } from '@/modules/user/application/events/handlers';
import { QueryHandlers } from '@/modules/user/application/queries/handlers';
import { CommandHandlers } from '@/modules/user/application/commands/handlers';
import { StorageModule } from '@/shared/infrastructure/storage/storage.module';
import { SellerIdentityAdapter } from '@/modules/user/infrastructure/adapters/seller-identity.adapter';
import { CUSTOMER_IDENTITY_RESOLVER } from '@/modules/user/application/ports/customer-identity.resolver';
import { PrismaUserRepository } from '@/modules/user/infrastructure/persistence/repositories/prisma-user.repository';
import { PrismaMeReadRepository } from '@/modules/user/infrastructure/persistence/repositories/prisma-me-read.repository';
import { PrismaAddressRepository } from '@/modules/user/infrastructure/persistence/repositories/prisma-address.repository';
import { PrismaSellerRepository } from '@/modules/user/infrastructure/persistence/repositories/prisma-seller.repository';
import { PrismaCustomerRepository } from '@/modules/user/infrastructure/persistence/repositories/prisma-customer.repository';
import { PrismaCustomerIdentityResolver } from '@/modules/user/infrastructure/persistence/repositories/prisma-customer-identity.resolver';

@Module({
  imports: [CqrsModule, StorageModule],
  providers: [
    ...CommandHandlers.handlers,
    ...QueryHandlers.handlers,
    ...EventHandlers.handlers,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'CustomerRepository',
      useClass: PrismaCustomerRepository,
    },
    {
      provide: 'SellerRepository',
      useClass: PrismaSellerRepository,
    },
    {
      provide: 'AddressRepository',
      useClass: PrismaAddressRepository,
    },
    {
      provide: CUSTOMER_IDENTITY_RESOLVER,
      useClass: PrismaCustomerIdentityResolver,
    },
    { provide: 'MeReadRepository', useClass: PrismaMeReadRepository },
    SellerIdentityAdapter,
  ],
  exports: [
    'UserRepository',
    SellerIdentityAdapter,
    CUSTOMER_IDENTITY_RESOLVER,
  ],
})
export class UserApplicationModule {}
