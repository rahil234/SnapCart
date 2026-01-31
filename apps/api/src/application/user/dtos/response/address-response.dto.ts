import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Address } from '@/domain/user/entities';

export class AddressResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  isPrimary: boolean;

  @ApiPropertyOptional()
  houseNo: string | null;

  @ApiPropertyOptional()
  street: string | null;

  @ApiPropertyOptional()
  city: string | null;

  @ApiPropertyOptional()
  state: string | null;

  @ApiPropertyOptional()
  country: string | null;

  @ApiPropertyOptional()
  pincode: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(address: Address): AddressResponseDto {
    const dto = new AddressResponseDto();
    dto.id = address.getId();
    dto.userId = address.getUserId();
    dto.isPrimary = address.getIsPrimary();
    dto.houseNo = address.getHouseNo();
    dto.street = address.getStreet();
    dto.city = address.getCity();
    dto.state = address.getState();
    dto.country = address.getCountry();
    dto.pincode = address.getPincode();
    dto.createdAt = address.createdAt;
    dto.updatedAt = address.updatedAt;
    return dto;
  }
}
