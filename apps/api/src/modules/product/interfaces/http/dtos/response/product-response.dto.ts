import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Product,
  ProductStatus,
} from '@/modules/product/domain/entities/product.entity';

/**
 * Product Response DTO
 *
 * Represents product identity/catalog information only.
 * For pricing and stock, see VariantResponseDto.
 */
export class ProductResponseDto {
  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Basmati Rice',
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Premium long-grain basmati rice from Punjab',
  })
  description: string;

  @ApiProperty({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  categoryId: string;

  @ApiPropertyOptional({
    description: 'Brand name',
    example: 'India Gate',
  })
  brand?: string;

  @ApiProperty({
    description: 'Product status (catalog lifecycle)',
    enum: ProductStatus,
    example: ProductStatus.ACTIVE,
  })
  status: ProductStatus;

  @ApiProperty({
    description: 'Whether product is active in catalog',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether product is in catalog (not deleted/discontinued)',
    example: true,
  })
  isInCatalog: boolean;

  @ApiProperty({
    description: 'Product creation date',
    example: '2026-02-01T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Product last update date',
    example: '2026-02-01T15:30:00.000Z',
  })
  updatedAt: Date;

  static fromDomain(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.getName(),
      description: product.getDescription(),
      categoryId: product.getCategoryId(),
      brand: product.getBrand() || undefined,
      status: product.getStatus(),
      isActive: product.isActive(),
      isInCatalog: product.isInCatalog(),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
