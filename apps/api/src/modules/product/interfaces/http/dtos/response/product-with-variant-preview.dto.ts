import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Product } from '@/modules/product/domain/entities/product.entity';
import { ProductVariant } from '@/modules/product/domain/entities/product-variant.entity';
import { Category } from '@/modules/category/domain/entities';
import { CategoryNestedDto } from './product-with-category.dto';

/**
 * Variant Preview DTO - Minimal variant data for listings
 */
export class VariantPreviewDto {
  @ApiProperty({
    description: 'Variant ID',
    example: 'c000000000000000000000000',
  })
  id: string;

  @ApiProperty({
    description: 'Variant name',
    example: '1kg',
  })
  variantName: string;

  @ApiProperty({
    description: 'Base price',
    example: 120.0,
  })
  price: number;

  @ApiProperty({
    description: 'Discount percentage',
    example: 10,
  })
  discountPercent: number;

  @ApiProperty({
    description: 'Final price after discount',
    example: 108.0,
  })
  finalPrice: number;

  @ApiProperty({
    description: 'Stock quantity',
    example: 100,
  })
  stock: number;

  @ApiPropertyOptional({
    description: 'Single image URL (first image)',
    example: 'https://res.cloudinary.com/demo/image1.jpg',
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Whether variant is available for purchase',
    example: true,
  })
  availableForPurchase: boolean;

  static fromDomain(variant: ProductVariant): VariantPreviewDto {
    const images = variant.getImages();
    return {
      id: variant.getId(),
      variantName: variant.getVariantName(),
      price: variant.getPrice(),
      discountPercent: variant.getDiscountPercent(),
      finalPrice: variant.calculateFinalPrice(),
      stock: variant.getStock(),
      imageUrl: images.length > 0 ? images[0] : undefined,
      availableForPurchase: variant.isAvailableForPurchase(),
    };
  }
}

/**
 * Product with Variant Preview DTO
 *
 * Used for homepage listings where we only show one variant with minimal data
 */
export class ProductWithVariantPreviewDto {
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

  @ApiPropertyOptional({
    description: 'Brand name',
    example: 'India Gate',
  })
  brand?: string;

  @ApiProperty({
    description: 'Category details',
    type: CategoryNestedDto,
  })
  category: CategoryNestedDto;

  @ApiProperty({
    description: 'Featured/first variant for quick preview',
    type: VariantPreviewDto,
  })
  variant: VariantPreviewDto;

  static fromDomain(
    product: Product,
    category: Category,
    variant: ProductVariant,
  ): ProductWithVariantPreviewDto {
    return {
      id: product.id,
      name: product.getName(),
      brand: product.getBrand() || undefined,
      category: CategoryNestedDto.fromDomain(category),
      variant: VariantPreviewDto.fromDomain(variant),
    };
  }
}
