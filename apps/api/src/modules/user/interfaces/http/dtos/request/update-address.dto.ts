import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAddressDto {
  @ApiPropertyOptional({ description: 'House number (set to null to clear)', type: String })
  @IsString()
  @IsOptional()
  houseNo?: string | null;

  @ApiPropertyOptional({ description: 'Street (set to null to clear)', type: String })
  @IsString()
  @IsOptional()
  street?: string | null;

  @ApiPropertyOptional({ description: 'City (set to null to clear)', type: String })
  @IsString()
  @IsOptional()
  city?: string | null;

  @ApiPropertyOptional({ description: 'State (set to null to clear)', type: String })
  @IsString()
  @IsOptional()
  state?: string | null;

  @ApiPropertyOptional({ description: 'Country (set to null to clear)', type: String })
  @IsString()
  @IsOptional()
  country?: string | null;

  @ApiPropertyOptional({ description: 'Pincode (set to null to clear)', type: String })
  @IsString()
  @IsOptional()
  pincode?: string | null;

  @ApiPropertyOptional({ description: 'Is primary address' })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}
