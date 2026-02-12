import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';

import { DeleteAddressCommand } from '../delete-address.command';
import { UserRepository } from '@/modules/user/domain/repositories';
import { AddressRepository } from '@/modules/user/domain/repositories/address.repository';

@CommandHandler(DeleteAddressCommand)
export class DeleteAddressHandler implements ICommandHandler<DeleteAddressCommand> {
  constructor(
    @Inject('AddressRepository')
    private readonly addressRepository: AddressRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: DeleteAddressCommand): Promise<void> {
    const { addressId, userId } = command;

    const address = await this.addressRepository.findById(addressId);
    if (!address) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const customer = user.getCustomerProfile();

    if (!customer) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Verify ownership
    if (address.getCustomerId() !== customer.getId()) {
      throw new ForbiddenException(
        'You do not have permission to delete this address',
      );
    }

    // Delete address
    await this.addressRepository.delete(addressId);
  }
}
