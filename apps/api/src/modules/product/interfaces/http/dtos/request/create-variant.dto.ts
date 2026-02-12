import {
  IsString,
  IsNumber,
  IsOptional,
  IsObject,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

/**
 * Create Variant DTO
 *
 * Creates a sellable unit for a product.
 * Images should be added via separate /images endpoint after creation.
 */
export class CreateVariantDto {
  @ApiProperty({
    description: 'Variant name (e.g., size, weight, color)',
    example: '1kg',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  variantName: string;

  @ApiProperty({
    description: 'Price (base price before discount)',
    example: 120.0,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01, { message: 'Price must be greater than 0' })
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: 'Stock quantity',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0, { message: 'Stock cannot be negative' })
  @Type(() => Number)
  stock: number;

  @ApiPropertyOptional({
    description: 'Discount percentage (0-100)',
    example: 10,
    minimum: 0,
    maximum: 100,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  discountPercent?: number;

  @ApiPropertyOptional({
    description: 'Seller profile ID (who sells this variant)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  sellerProfileId?: string;

  @ApiPropertyOptional({
    description: 'Additional attributes (e.g., weight, organic flag)',
    example: { weight: '1kg', organic: true },
  })
  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>;
}
