import { CustomerProfile } from '@/modules/user/domain/entities/customer-profile.entity';
import { UserGender } from '@/modules/user/domain/enums/user-gender.enum';

export class PrismaCustomerProfileMapper {
  // DB → Domain
  static toDomain(raw: any): CustomerProfile {
    return CustomerProfile.from(
      raw.id,
      raw.userId,
      raw.name,
      raw.dob,
      raw.gender as UserGender | null,
      raw.profilePicture,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  // Domain → DB
  static toPersistence(profile: CustomerProfile) {
    return {
      id: profile.id,
      userId: profile.getUserId(),
      name: profile.getName(),
      dob: profile.getDob(),
      gender: profile.getGender(),
      profilePicture: profile.getProfilePicture(),
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
