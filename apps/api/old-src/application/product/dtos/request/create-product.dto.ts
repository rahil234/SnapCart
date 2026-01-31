import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Premium Cotton T-Shirt',
    minLength: 1,
    maxLength: 200
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Comfortable premium cotton t-shirt perfect for casual wear',
    maxLength: 1000
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

  @ApiProperty({
    description: 'Product price in cents',
    example: 2999,
    minimum: 1
  })
  @IsNumber()
  @Min(1, { message: 'Price must be greater than 0' })
  price: number;

  @ApiPropertyOptional({
    description: 'Discount percentage (0-100)',
    example: 15,
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
    example: true,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  tryOn?: boolean = false;
}
