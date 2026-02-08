import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Address } from '@/modules/user/domain/entities';

export class AddressResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  isPrimary: boolean;

  @ApiPropertyOptional()
  houseNo?: string;

  @ApiPropertyOptional()
  street?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  state?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiPropertyOptional()
  pincode?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(address: Address): AddressResponseDto {
    return {
      id: address.id,
      customerId: address.getCustomerId(),
      isPrimary: address.getIsPrimary(),
      houseNo: address.getHouseNo() || undefined,
      street: address.getStreet() || undefined,
      city: address.getCity() || undefined,
      state: address.getState() || undefined,
      country: address.getCountry() || undefined,
      pincode: address.getPincode() || undefined,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    };
  }
}
