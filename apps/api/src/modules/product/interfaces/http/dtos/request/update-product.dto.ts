import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export enum ProductStatusDto {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued',
}

/**
 * Update Product DTO
 *
 * Updates product identity/catalog information only.
 * For pricing, stock, or discount changes, update the variants instead.
 */
export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Product name',
    example: 'Premium Basmati Rice',
    minLength: 1,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  name?: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Extra long grain premium basmati rice',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiPropertyOptional({
    description: 'Brand name',
    example: 'India Gate Premium',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  brand?: string;

  @ApiPropertyOptional({
    description:
      'Category ID (use with caution - cannot change if discontinued)',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Product status (catalog lifecycle)',
    enum: ProductStatusDto,
    example: ProductStatusDto.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ProductStatusDto)
  status?: ProductStatusDto;
}
