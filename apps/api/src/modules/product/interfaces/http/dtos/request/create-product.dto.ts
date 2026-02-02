import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

/**
 * Create Product DTO
 *
 * Creates a product catalog entry (identity only).
 * This does NOT create a sellable item.
 * You must create variants separately to make it purchasable.
 */
export class CreateProductDto {
  @ApiProperty({
    description: 'Product name (catalog identity)',
    example: 'Basmati Rice',
    minLength: 1,
    maxLength: 200
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Premium long-grain basmati rice from Punjab',
    maxLength: 2000
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  description: string;

  @ApiProperty({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  categoryId: string;

  @ApiPropertyOptional({
    description: 'Brand name',
    example: 'India Gate',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  brand?: string;
}


