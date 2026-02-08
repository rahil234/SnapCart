import { User, CustomerProfile, SellerProfile } from '@/modules/user/domain/entities';
import { AccountStatus, UserRole, UserGender } from '@/modules/user/domain/enums';

export class PrismaUserMapper {
  // DB → Domain (Aggregate with profiles)
  static toDomain(raw: any): User {
    // Reconstruct CustomerProfile if exists
    let customerProfile: CustomerProfile | null = null;
    if (raw.customerProfile) {
      customerProfile = CustomerProfile.from(
        raw.customerProfile.id,
        raw.customerProfile.userId,
        raw.customerProfile.name,
        raw.customerProfile.dob,
        raw.customerProfile.gender as UserGender | null,
        raw.customerProfile.createdAt,
        raw.customerProfile.updatedAt,
      );
    }

    // Reconstruct SellerProfile if exists
    let sellerProfile: SellerProfile | null = null;
    if (raw.sellerProfile) {
      sellerProfile = SellerProfile.from(
        raw.sellerProfile.id,
        raw.sellerProfile.userId,
        raw.sellerProfile.storeName,
        raw.sellerProfile.gstNumber,
        raw.sellerProfile.isVerified,
        raw.sellerProfile.createdAt,
        raw.sellerProfile.updatedAt,
      );
    }

    // Reconstruct User aggregate
    return User.from(
      raw.id,
      raw.email,
      raw.phone,
      raw.password,
      raw.role as UserRole,
      raw.status as AccountStatus,
      raw.createdAt,
      raw.updatedAt,
      customerProfile,
      sellerProfile,
    );
  }

  // Domain → DB (User entity only, profiles handled separately)
  static toPersistence(user: User) {
    return {
      id: user.id,
      email: user.getEmail(),
      phone: user.getPhone(),
      password: user.getPassword(),
      role: user.getRole(),
      status: user.getStatus(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // CustomerProfile → DB
  static customerProfileToPersistence(profile: CustomerProfile) {
    return {
      id: profile.getId(),
      userId: profile.getUserId(),
      name: profile.getName(),
      dob: profile.getDob(),
      gender: profile.getGender(),
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  // SellerProfile → DB
  static sellerProfileToPersistence(profile: SellerProfile) {
    return {
      id: profile.getId(),
      userId: profile.getUserId(),
      storeName: profile.getStoreName(),
      gstNumber: profile.getGstNumber(),
      isVerified: profile.getIsVerified(),
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
