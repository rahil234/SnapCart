import { Address as PrismaAddress } from '@prisma/client';

import { Address } from '@/modules/user/domain/entities';

export class PrismaAddressMapper {
  static toDomain(raw: PrismaAddress): Address {
    return Address.from(
      raw.id,
      raw.customerId,
      raw.isPrimary,
      raw.houseNo,
      raw.street,
      raw.city,
      raw.state,
      raw.country,
      raw.pincode,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  // Domain → DB
  static toPersistence(address: Address) {
    return {
      id: address.id,
      customerId: address.getCustomerId(),
      isPrimary: address.getIsPrimary(),
      houseNo: address.getHouseNo(),
      street: address.getStreet(),
      city: address.getCity(),
      state: address.getState(),
      country: address.getCountry(),
      pincode: address.getPincode(),
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    };
  }
}
