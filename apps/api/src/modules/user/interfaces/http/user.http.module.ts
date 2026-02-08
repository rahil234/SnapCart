import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { UserController } from '@/modules/user/interfaces/http/user.controller';
import { AddressController } from '@/modules/user/interfaces/http/address.controller';
import { UserApplicationModule } from '@/modules/user/application/user-application.module';

@Module({
  imports: [CqrsModule, UserApplicationModule],
  controllers: [UserController, AddressController],
})
export class UserHttpModule {}
