import { IsString, IsNumber, IsOptional, IsObject, Min, Max, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

/**
 * Create Variant DTO
 *
 * Creates a sellable unit for a product.
 * This is what customers actually purchase.
 */
export class CreateVariantDto {
  @ApiProperty({
    description: 'SKU (Stock Keeping Unit) - must be unique across all variants',
    example: 'BAS-1KG-001',
    minLength: 1,
    maxLength: 50
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  sku: string;

  @ApiProperty({
    description: 'Variant name (e.g., size, weight, color)',
    example: '1kg',
    minLength: 1,
    maxLength: 100
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  variantName: string;

  @ApiProperty({
    description: 'Price (base price before discount)',
    example: 120.00,
    minimum: 0.01
  })
  @IsNumber()
  @Min(0.01, { message: 'Price must be greater than 0' })
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: 'Stock quantity',
    example: 100,
    minimum: 0
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
    default: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  discountPercent?: number;

  @ApiPropertyOptional({
    description: 'Seller profile ID (who sells this variant)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsString()
  sellerProfileId?: string;

  @ApiPropertyOptional({
    description: 'Image URL for this specific variant',
    example: 'https://example.com/images/basmati-1kg.jpg'
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;
}
