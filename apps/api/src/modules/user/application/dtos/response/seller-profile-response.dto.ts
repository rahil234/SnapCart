import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SellerProfile } from '@/modules/user/domain/entities';

export class SellerProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  storeName: string;

  @ApiPropertyOptional()
  gstNumber: string | null;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(profile: SellerProfile): SellerProfileResponseDto {
    const dto = new SellerProfileResponseDto();
    dto.id = profile.getId();
    dto.userId = profile.getUserId();
    dto.storeName = profile.getStoreName();
    dto.gstNumber = profile.getGstNumber();
    dto.isVerified = profile.getIsVerified();
    dto.createdAt = profile.createdAt;
    dto.updatedAt = profile.updatedAt;
    return dto;
  }
}
