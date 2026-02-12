import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AccountStatus, UserRole } from '@/modules/user/domain/enums';
import { GetMeResult } from '@/modules/user/application/queries/get-me/get-me.result';

class CustomerProfileDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  profilePicture?: string;
}

class SellerProfileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  storeName: string;

  @ApiProperty()
  isVerified: boolean;
}

export class MeResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({ enum: AccountStatus })
  status: AccountStatus;

  @ApiPropertyOptional({ type: CustomerProfileDto })
  customerProfile?: CustomerProfileDto;

  @ApiPropertyOptional({ type: SellerProfileDto })
  sellerProfile?: SellerProfileDto;

  static fromResult(result: GetMeResult): MeResponseDto {
    return {
      id: result.id,
      email: result.email,
      role: result.role,
      status: result.status,
      customerProfile: result.customerProfile
        ? {
            id: result.customerProfile.id,
            name: result.customerProfile.name,
            profilePicture: result.customerProfile.profilePicture,
          }
        : undefined,
      sellerProfile: result.sellerProfile
        ? {
            id: result.sellerProfile.id,
            storeName: result.sellerProfile.storeName,
            isVerified: result.sellerProfile.isVerified,
          }
        : undefined,
    };
  }
}
