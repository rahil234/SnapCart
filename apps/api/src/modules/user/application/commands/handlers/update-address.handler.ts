import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';

import { UpdateAddressCommand } from '../update-address.command';
import { UserRepository } from '@/modules/user/domain/repositories';
import { Address } from '@/modules/user/domain/entities/address.entity';
import { AddressRepository } from '@/modules/user/domain/repositories/address.repository';

@CommandHandler(UpdateAddressCommand)
export class UpdateAddressHandler implements ICommandHandler<UpdateAddressCommand> {
  constructor(
    @Inject('AddressRepository')
    private readonly addressRepository: AddressRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: UpdateAddressCommand): Promise<Address> {
    const {
      addressId,
      userId,
      houseNo,
      street,
      city,
      state,
      country,
      pincode,
      isPrimary,
    } = command;

    // Find address
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
      throw new NotFoundException(
        `Customer profile for user ID ${userId} not found`,
      );
    }

    // Verify ownership
    if (address.getCustomerId() !== customer.getId()) {
      throw new ForbiddenException(
        'You do not have permission to update this address',
      );
    }

    // Update address fields (undefined means don't update, null means clear the value)
    address.updateAddress(houseNo, street, city, state, country, pincode);

    // Handle primary status
    if (isPrimary !== undefined) {
      if (isPrimary) {
        // Make all other addresses secondary
        const existingAddresses =
          await this.addressRepository.findByUserId(userId);
        for (const addr of existingAddresses) {
          if (addr.getId() !== addressId) {
            addr.makeSecondary();
            await this.addressRepository.update(addr);
          }
        }
        address.makePrimary();
      } else {
        address.makeSecondary();
      }
    }

    // Persist address
    return await this.addressRepository.update(address);
  }
}
