import { User } from '@/modules/user/domain/entities/user.entity';
import { AccountStatus } from '@/modules/user/domain/enums/account-status.enum';
import { UserRole } from '@/modules/user/domain/enums/user-role.enum';

export class PrismaUserMapper {
  // DB → Domain
  static toDomain(raw: any): User {
    return User.from(
      raw.id,
      raw.email,
      raw.phone,
      raw.password,
      raw.role as UserRole,
      raw.status as AccountStatus,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  // Domain → DB
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
}
