import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { User } from '@/modules/user/domain/entities';
import { AccountStatus, UserRole } from '@/modules/user/domain/enums';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional({
    description:
      'Email address of the user. Optional if the user registered with phone number.',
    example: 'user@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description:
      'Phone number of the user. Optional if the user registered with email address.',
    example: '+1234567890',
  })
  phone?: string;

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
    dto.email = user.getEmail() || undefined;
    dto.phone = user.getPhone() || undefined;
    dto.role = user.getRole();
    dto.status = user.getStatus();
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
