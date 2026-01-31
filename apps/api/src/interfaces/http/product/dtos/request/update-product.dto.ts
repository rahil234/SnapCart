import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export enum ProductStatusDto {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued'
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Product name',
    example: 'Premium Cotton T-Shirt - Updated',
    minLength: 1,
    maxLength: 200
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  name?: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Updated description for premium cotton t-shirt',
    maxLength: 1000
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiPropertyOptional({
    description: 'Product price in cents',
    example: 3299,
    minimum: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Price must be greater than 0' })
  price?: number;

  @ApiPropertyOptional({
    description: 'Discount percentage (0-100)',
    example: 20,
    minimum: 0,
    maximum: 100
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @ApiPropertyOptional({
    description: 'Whether try-on feature is enabled',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  tryOn?: boolean;

  @ApiPropertyOptional({
    description: 'Product status',
    enum: ProductStatusDto,
    example: ProductStatusDto.ACTIVE
  })
  @IsOptional()
  @IsEnum(ProductStatusDto)
  status?: ProductStatusDto;
}
