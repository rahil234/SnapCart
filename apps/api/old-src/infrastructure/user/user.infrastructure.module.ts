import { Module } from '@nestjs/common';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { PrismaAddressRepository } from './repositories/prisma-address.repository';
import { UserController } from './controllers/user.controller';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'AddressRepository',
      useClass: PrismaAddressRepository,
    },
  ],
  exports: ['UserRepository', 'AddressRepository'],
})
export class UserInfrastructureModule {}
