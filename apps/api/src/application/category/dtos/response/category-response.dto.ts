import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Electronics',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Electronic devices and accessories',
  })
  description: string | null;

  @ApiPropertyOptional({
    description: 'Category image URL',
    example: 'https://example.com/images/electronics.jpg',
  })
  imageUrl: string | null;

  @ApiPropertyOptional({
    description: 'Parent category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  parentId: string | null;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
