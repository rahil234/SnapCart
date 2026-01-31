import { SellerProfile } from '@/modules/user/domain/entities';

export class PrismaSellerProfileMapper {
  // DB → Domain
  static toDomain(raw: any): SellerProfile {
    return SellerProfile.from(
      raw.id,
      raw.userId,
      raw.storeName,
      raw.gstNumber,
      raw.isVerified,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  // Domain → DB
  static toPersistence(profile: SellerProfile) {
    return {
      id: profile.id,
      userId: profile.getUserId(),
      storeName: profile.getStoreName(),
      gstNumber: profile.getGstNumber(),
      isVerified: profile.getIsVerified(),
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
