import { BadRequestException, Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import {
  AddressRepository,
  UserRepository,
} from '@/modules/user/domain/repositories';
import { Address } from '@/modules/user/domain/entities';
import { GetAddressesQuery } from '@/modules/user/application/queries/get-addresses/get-addresses.query';

@QueryHandler(GetAddressesQuery)
export class GetAddressesHandler implements IQueryHandler<GetAddressesQuery> {
  constructor(
    @Inject('AddressRepository')
    private readonly addressRepository: AddressRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: GetAddressesQuery): Promise<Address[]> {
    const { userId } = query;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const customer = user.getCustomerProfile();

    if (!customer) {
      throw new BadRequestException('Customer profile not found');
    }

    return this.addressRepository.findByUserId(customer.id);
  }
}
