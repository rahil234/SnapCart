import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { UserController } from '@/interfaces/http/user/user.controller';

// Command Handlers
import {
  CreateUserHandler,
  UpdateUserHandler,
  UpdateUserStatusHandler,
  CreateAddressHandler,
  UpdateAddressHandler,
} from '@/application/user/commands/handlers';

// Query Handlers
import {
  GetUserByIdHandler,
  GetUserByEmailHandler,
  GetUsersHandler,
} from '@/application/user/queries/handlers';

// Repositories
import { PrismaUserRepository } from '@/infrastructure/user/persistence/repositories/prisma-user.repository';
import { PrismaCustomerProfileRepository } from '@/infrastructure/user/persistence/repositories/prisma-customer-profile.repository';
import { PrismaSellerProfileRepository } from '@/infrastructure/user/persistence/repositories/prisma-seller-profile.repository';
import { PrismaAddressRepository } from '@/infrastructure/user/persistence/repositories/prisma-address.repository';

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
export class UserModule {}
