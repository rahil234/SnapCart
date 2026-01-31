import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { UserController } from '@/modules/user/interfaces/http/user.controller';

// Command Handlers
import {
  CreateUserHandler,
  UpdateUserHandler,
  UpdateUserStatusHandler,
  CreateAddressHandler,
  UpdateAddressHandler,
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

export const UserCommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  UpdateUserStatusHandler,
  CreateAddressHandler,
  UpdateAddressHandler,
];

export const UserQueryHandlers = [
  GetUserByIdHandler,
  GetUserByEmailHandler,
  GetUsersHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [
    ...UserCommandHandlers,
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
  ],
  exports: [
    'UserRepository',
    'CustomerProfileRepository',
    'SellerProfileRepository',
    'AddressRepository',
  ],
})
export class UserHttpModule {}
