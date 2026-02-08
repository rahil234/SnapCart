import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountStatus, UserRole } from '@/modules/user/domain/enums';
import { GetMeResult } from '@/modules/user/application/queries/get-me/get-me.result';

class CustomerProfileDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  cartId?: string;
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
  userId: string;

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
    const dto = new MeResponseDto();
    dto.userId = result.userId;
    dto.email = result.email;
    dto.role = result.role;
    dto.status = result.status;
    dto.customerProfile = result.customerProfile;
    dto.sellerProfile = result.sellerProfile;
    return dto;
  }
}
