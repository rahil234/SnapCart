import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeleteAddressCommand } from '../delete-address.command';
import { AddressRepository } from '@/modules/user/domain/repositories/address.repository';

@CommandHandler(DeleteAddressCommand)
export class DeleteAddressHandler implements ICommandHandler<DeleteAddressCommand> {
  constructor(
    @Inject('AddressRepository')
    private readonly addressRepository: AddressRepository,
  ) {}

  async execute(command: DeleteAddressCommand): Promise<void> {
    const { addressId, userId } = command;

    // Find address
    const address = await this.addressRepository.findById(addressId);
    if (!address) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }

    // Verify ownership
    if (address.getUserId() !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this address',
      );
    }

    // Delete address
    await this.addressRepository.delete(addressId);
  }
}
