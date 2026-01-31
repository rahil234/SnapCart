import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiPropertyOptional({ description: 'House number', type: String })
  @IsString()
  @IsOptional()
  houseNo?: string | null;

  @ApiPropertyOptional({ description: 'Street', type: String })
  @IsString()
  @IsOptional()
  street?: string | null;

  @ApiPropertyOptional({ description: 'City', type: String })
  @IsString()
  @IsOptional()
  city?: string | null;

  @ApiPropertyOptional({ description: 'State', type: String })
  @IsString()
  @IsOptional()
  state?: string | null;

  @ApiPropertyOptional({ description: 'Country', type: String })
  @IsString()
  @IsOptional()
  country?: string | null;

  @ApiPropertyOptional({ description: 'Pincode', type: String })
  @IsString()
  @IsOptional()
  pincode?: string | null;

  @ApiPropertyOptional({ description: 'Is primary address', default: false })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}
