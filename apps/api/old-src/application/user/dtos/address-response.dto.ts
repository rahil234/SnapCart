import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Address } from '@/domain/user/entities/address.entity';

export class AddressResponseDto {
  @ApiProperty({
    example: 'uuid-v4-string',
    description: 'Unique ID of the address',
  })
  id: string;

  @ApiProperty({
    example: true,
    description: 'Whether this is the primary address',
  })
  isPrimary: boolean;

  @ApiPropertyOptional({
    example: '221B',
    description: 'House or flat number',
  })
  houseNo?: string;

  @ApiPropertyOptional({
    example: 'Baker Street',
    description: 'Street name',
  })
  street?: string;

  @ApiPropertyOptional({
    example: 'London',
    description: 'City name',
  })
  city?: string;

  @ApiPropertyOptional({
    example: 'Greater London',
    description: 'State or region name',
  })
  state?: string;

  @ApiPropertyOptional({
    example: 'United Kingdom',
    description: 'Country name',
  })
  country?: string;

  @ApiPropertyOptional({
    example: 'NW1 6XE',
    description: 'Postal/ZIP code',
  })
  pincode?: string;

  static fromEntity(this: void, entity: Address): AddressResponseDto {
    return {
      id: entity.id,
      isPrimary: entity.isPrimary,

      houseNo: entity.houseNo || undefined,
      street: entity.street || undefined,
      city: entity.city || undefined,
      state: entity.state || undefined,
      country: entity.country || undefined,
      pincode: entity.pincode || undefined,
    };
  }
}
