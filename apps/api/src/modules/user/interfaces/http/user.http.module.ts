import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { UserController } from '@/modules/user/interfaces/http/user.controller';
import { AddressController } from '@/modules/user/interfaces/http/address.controller';

// Command Handlers
import {
  CreateUserHandler,
  UpdateUserHandler,
  UpdateUserStatusHandler,
  CreateAddressHandler,
  UpdateAddressHandler,
  DeleteAddressHandler,
} from '@/modules/user/application/commands/handlers';

// Query Handlers
import {
  GetUserByIdHandler,
  GetUserByEmailHandler,
  GetUsersHandler,
} from '@/modules/user/application/queries/handlers';

// Repositories
import { PrismaUserRepository } from '@/modules/user/infrastructure/persistence/repositories/prisma-user.repository';
import { PrismaCustomerProfileRepository } from '@/modules/user/infrastructure/persistence/repositories/prisma-customer-profile.repository';
import { PrismaSellerProfileRepository } from '@/modules/user/infrastructure/persistence/repositories/prisma-seller-profile.repository';
import { PrismaAddressRepository } from '@/modules/user/infrastructure/persistence/repositories/prisma-address.repository';
import { GetMeHandler } from '@/modules/user/application/queries/get-me/get-me.handler';
import { PrismaMeReadRepository } from '@/modules/user/infrastructure/persistence/repositories/prisma-me-read.repository';

export const UserCommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  UpdateUserStatusHandler,
];

export const AddressCommandHandlers = [
  CreateAddressHandler,
  UpdateAddressHandler,
  DeleteAddressHandler,
];

export const UserQueryHandlers = [
  GetUserByIdHandler,
  GetUserByEmailHandler,
  GetUsersHandler,
  GetMeHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [UserController, AddressController],
  providers: [
    ...UserCommandHandlers,
    ...AddressCommandHandlers,
    ...UserQueryHandlers,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'CustomerProfileRepository',
      useClass: PrismaCustomerProfileRepository,
    },
    {
      provide: 'SellerProfileRepository',
      useClass: PrismaSellerProfileRepository,
    },
    {
      provide: 'AddressRepository',
      useClass: PrismaAddressRepository,
    },
    { provide: 'MeReadRepository', useClass: PrismaMeReadRepository },
  ],
  exports: [
    'UserRepository',
    'CustomerProfileRepository',
    'SellerProfileRepository',
    'AddressRepository',
  ],
})
export class UserHttpModule {}
