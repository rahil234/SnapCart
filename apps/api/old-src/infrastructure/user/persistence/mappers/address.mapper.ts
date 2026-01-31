import { Address as PrismaAddress } from '@prisma/client';
import { Address as AddressEntity } from '@/domain/user/entities/address.entity';

export const AddressMapper = {
  toDomain(prismaAddress: PrismaAddress): AddressEntity {
    return new AddressEntity(
      prismaAddress.id,
      prismaAddress.userId,
      prismaAddress.isPrimary,
      prismaAddress.houseNo,
      prismaAddress.street,
      prismaAddress.city,
      prismaAddress.state,
      prismaAddress.country,
      prismaAddress.pincode,
      prismaAddress.createdAt,
      prismaAddress.updatedAt,
    );
  },

  toPrisma(address: Partial<AddressEntity>): any {
    return {
      userId: address.userId,
      isPrimary: address.isPrimary,
      houseNo: address.houseNo,
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      pincode: address.pincode,
    };
  },
};
