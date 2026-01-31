import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { UserGender } from '@/domain/user/enums';
import { CustomerProfile } from '@/domain/user/entities';

export class CustomerProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional()
  name: string | null;

  @ApiPropertyOptional()
  dob: Date | null;

  @ApiPropertyOptional({ enum: UserGender })
  gender: UserGender | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(profile: CustomerProfile): CustomerProfileResponseDto {
    const dto = new CustomerProfileResponseDto();
    dto.id = profile.getId();
    dto.userId = profile.getUserId();
    dto.name = profile.getName();
    dto.dob = profile.getDob();
    dto.gender = profile.getGender();
    dto.createdAt = profile.createdAt;
    dto.updatedAt = profile.updatedAt;
    return dto;
  }
}
