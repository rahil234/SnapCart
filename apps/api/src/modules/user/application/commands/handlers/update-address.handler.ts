import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdateAddressCommand } from '../update-address.command';
import { AddressRepository } from '@/modules/user/domain/repositories/address.repository';
import { Address } from '@/modules/user/domain/entities/address.entity';

@CommandHandler(UpdateAddressCommand)
export class UpdateAddressHandler implements ICommandHandler<UpdateAddressCommand> {
  constructor(
    @Inject('AddressRepository')
    private readonly addressRepository: AddressRepository,
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

    // Verify ownership
    if (address.getUserId() !== userId) {
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
