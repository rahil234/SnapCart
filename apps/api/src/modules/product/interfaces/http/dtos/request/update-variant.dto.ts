import { IsString, IsNumber, IsOptional, IsObject, IsBoolean, Min, Max, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export enum VariantStatusDto {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock'
}

/**
 * Update Variant DTO
 *
 * Updates commerce attributes of a variant.
 * SKU and productId cannot be changed (immutable).
 * Images are managed via separate /images endpoint.
 */
export class UpdateVariantDto {
  @ApiPropertyOptional({
    description: 'Variant name',
    example: '1kg Premium',
    minLength: 1,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  variantName?: string;

  @ApiPropertyOptional({
    description: 'Price (base price before discount)',
    example: 125.00,
    minimum: 0.01
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional({
    description: 'Discount percentage (0-100, set to 0 to remove discount)',
    example: 15,
    minimum: 0,
    maximum: 100
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  discountPercent?: number;

  @ApiPropertyOptional({
    description: 'Stock quantity',
    example: 80,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock?: number;

  @ApiPropertyOptional({
    description: 'Variant status',
    enum: VariantStatusDto,
    example: VariantStatusDto.ACTIVE
  })
  @IsOptional()
  @IsEnum(VariantStatusDto)
  status?: VariantStatusDto;

  @ApiPropertyOptional({
    description: 'Whether variant is active (available for purchase)',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Seller profile ID (null to remove seller)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true
  })
  @IsOptional()
  @IsString()
  sellerProfileId?: string | null;

  @ApiPropertyOptional({
    description: 'Additional attributes (e.g., weight, organic flag)',
    example: { weight: '1kg', organic: true }
  })
  @IsOptional()
  @IsObject()
  attributes?: Record<string, any> | null;
}
