import { Module } from '@nestjs/common';
import { UserService } from '@/domain/user/services/user.service';
import { AddressService } from '@/domain/user/services/address.service';

@Module({
  providers: [UserService, AddressService],
  exports: [UserService, AddressService],
})
export class UserDomainModule {}
