import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Address } from '@/domain/user/entities/address.entity';
import { UserService } from '@/domain/user/services/user.service';
import { UpdateAddressDto } from '@/application/user/dtos/request/update-address.dto';
import { IAddressRepository } from '@/infrastructure/user/repositories/address.repository';

@Injectable()
export class AddressService {
  constructor(
    @Inject('AddressRepository')
    private readonly _addressRepository: IAddressRepository,
    private readonly _userService: UserService,
  ) {}

  async create(userId: string, dto: UpdateAddressDto): Promise<Address> {
    const user = await this._userService.findById(userId);
    if (!user) throw new Error('User not found');

    const addresses = user.addresses ?? [];

    if (addresses.length > 0) {
      await Promise.all(
        addresses.map((a) => this._addressRepository.delete(a.id)),
      );
    }

    return this._addressRepository.create(userId, dto, true);
  }

  async findByUserId(userId: string): Promise<Address[]> {
    return this._addressRepository.findByUserId(userId);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateAddressDto,
  ): Promise<Address> {
    const user = await this._userService.findById(userId);
    if (!user) throw new BadRequestException('User not found');

    const address = await this._addressRepository.findById(id);

    if (!address) throw new BadRequestException('Address not found');

    if (address.userId !== userId) {
      throw new UnauthorizedException('Unauthorized to update this address');
    }

    const updatedAddress = await this._addressRepository.update(id, dto);

    if (!updatedAddress) {
      throw new BadRequestException('Failed to update address');
    }

    return updatedAddress;
  }
}
