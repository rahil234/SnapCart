import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { User } from '@/domain/user/entities';
import { UserRole, AccountStatus } from '@/domain/user/enums';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  email: string | null;

  @ApiPropertyOptional()
  phone: string | null;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({ enum: AccountStatus })
  status: AccountStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.getId();
    dto.email = user.getEmail();
    dto.phone = user.getPhone();
    dto.role = user.getRole();
    dto.status = user.getStatus();
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
