import { Address } from '@/domain/user/entities';

export class PrismaAddressMapper {
  // DB → Domain
  static toDomain(raw: any): Address {
    return Address.from(
      raw.id,
      raw.userId,
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
      userId: address.getUserId(),
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
