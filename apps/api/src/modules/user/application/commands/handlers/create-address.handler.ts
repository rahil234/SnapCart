import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CreateAddressCommand } from '../create-address.command';
import { AddressRepository } from '@/modules/user/domain/repositories/address.repository';
import { UserRepository } from '@/modules/user/domain/repositories/user.repository';
import { Address } from '@/modules/user/domain/entities/address.entity';

@CommandHandler(CreateAddressCommand)
export class CreateAddressHandler implements ICommandHandler<CreateAddressCommand> {
  constructor(
    @Inject('AddressRepository')
    private readonly addressRepository: AddressRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreateAddressCommand): Promise<Address> {
    const {
      userId,
      houseNo,
      street,
      city,
      state,
      country,
      pincode,
      isPrimary,
    } = command;

    // Load user aggregate to validate business rules
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Business rule: User must have CustomerProfile to add addresses
    if (!user.canAddAddress()) {
      throw new BadRequestException(
        'Cannot add address. User must have an active customer profile.',
      );
    }

    const customerProfile = user.getCustomerProfile();
    if (!customerProfile) {
      throw new BadRequestException('Customer profile not found');
    }

    // If this is primary, make all other addresses secondary
    if (isPrimary) {
      const existingAddresses = await this.addressRepository.findByUserId(
        customerProfile.getId(),
      );
      for (const addr of existingAddresses) {
        addr.makeSecondary();
        await this.addressRepository.update(addr);
      }
    }

    // Create address (linked to customerProfile, not userId)
    const address = Address.create(
      customerProfile.getId(),
      houseNo,
      street,
      city,
      state,
      country,
      pincode,
      isPrimary,
    );

    return this.addressRepository.save(address);
  }
}
