import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { CreateAddressCommand } from '../create-address.command';
import { AddressRepository } from '@/domain/user/repositories/address.repository';
import { UserRepository } from '@/domain/user/repositories/user.repository';
import { Address } from '@/domain/user/entities/address.entity';

@CommandHandler(CreateAddressCommand)
export class CreateAddressHandler implements ICommandHandler<CreateAddressCommand> {
  constructor(
    @Inject('AddressRepository')
    private readonly addressRepository: AddressRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreateAddressCommand): Promise<Address> {
    const { userId, houseNo, street, city, state, country, pincode, isPrimary } = command;

    // Verify user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // If this is primary, make all other addresses secondary
    if (isPrimary) {
      const existingAddresses = await this.addressRepository.findByUserId(userId);
      for (const addr of existingAddresses) {
        addr.makeSecondary();
        await this.addressRepository.update(addr);
      }
    }

    // Create address
    const address = Address.create(
      userId,
      houseNo,
      street,
      city,
      state,
      country,
      pincode,
      isPrimary,
    );

    // Persist address
    const createdAddress = await this.addressRepository.save(address);

    return createdAddress;
  }
}
