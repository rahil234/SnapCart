import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    description: 'Category name',
    example: 'Electronics',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Electronic devices and accessories',
  })
  @IsString()
  @IsOptional()
  description?: string | null;

  @ApiPropertyOptional({
    description: 'Category image URL',
    example: 'https://example.com/images/electronics.jpg',
  })
  @IsString()
  @IsOptional()
  imageUrl?: string | null;

  @ApiPropertyOptional({
    description: 'Parent category ID for subcategories',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsOptional()
  parentId?: string | null;
}
