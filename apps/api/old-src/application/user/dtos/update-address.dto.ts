import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateAddressDto {
  @ApiProperty({
    example: '221B',
    description: 'House or building number',
  })
  @IsString()
  houseNo?: string;

  @ApiProperty({
    example: 'Baker Street',
    description: 'Street name',
  })
  @IsString()
  street?: string;

  @ApiProperty({
    example: 'London',
    description: 'City name',
  })
  @IsString()
  city: string;

  @ApiProperty({
    example: 'Greater London',
    description: 'State name',
  })
  @IsString()
  state: string;

  @ApiProperty({
    example: 'United Kingdom',
  })
  @IsString()
  country: string;

  @ApiProperty({
    example: '692012',
    description: 'Postal code',
  })
  @IsString()
  pincode: string;
}
