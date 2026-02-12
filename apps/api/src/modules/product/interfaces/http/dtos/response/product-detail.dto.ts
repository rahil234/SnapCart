import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Product, ProductStatus, } from '@/modules/product/domain/entities/product.entity';
import { ProductVariant } from '@/modules/product/domain/entities/product-variant.entity';
import { Category } from '@/modules/category/domain/entities';
import { CategoryNestedDto } from './product-with-category.dto';
import { VariantResponseDto } from './variant-response.dto';

/**
 * Product Detail DTO
 *
 * Complete product view with category, variants, and all images.
 * Used for full product detail pages.
 */
export class ProductDetailDto {
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
    description: 'Category details',
    type: CategoryNestedDto,
  })
  category: CategoryNestedDto;

  @ApiProperty({
    isArray: true,
    type: VariantResponseDto,
    description: 'All available variants with images',
  })
  variants: VariantResponseDto[];

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

  static fromDomain(
    product: Product,
    category: Category,
    variants: ProductVariant[],
  ): ProductDetailDto {
    return {
      id: product.id,
      name: product.getName(),
      description: product.getDescription(),
      brand: product.getBrand() || undefined,
      status: product.getStatus(),
      isActive: product.isActive(),
      category: CategoryNestedDto.fromDomain(category),
      variants: variants.map(VariantResponseDto.fromDomain),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
