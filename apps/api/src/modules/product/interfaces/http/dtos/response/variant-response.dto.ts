import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ProductVariant,
  VariantStatus,
} from '@/modules/product/domain/entities/product-variant.entity';

/**
 * Product Variant Response DTO
 */
export class VariantResponseDto {
  @ApiProperty({
    description: 'Variant ID',
    example: 'c000000000000000000000000',
    format: 'cuid',
  })
  id: string;

  @ApiProperty({
    description: 'Product ID',
    example: 'c000000000000000000000001',
    format: 'cuid',
  })
  productId: string;

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

  @ApiProperty({
    description: 'Variant status',
    enum: VariantStatus,
    example: VariantStatus.ACTIVE,
  })
  status: VariantStatus;

  @ApiProperty({
    description: 'Whether variant is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether variant is in stock',
    example: true,
  })
  inStock: boolean;

  @ApiProperty({
    description: 'Whether variant is available for purchase',
    example: true,
  })
  availableForPurchase: boolean;

  @ApiPropertyOptional({
    description: 'Seller profile ID',
    example: '123e4567-e89b-12d3-a456-426614174002',
    nullable: true,
  })
  sellerProfileId: string | null;

  @ApiPropertyOptional({
    description: 'Additional attributes',
    example: { weight: '1kg', organic: true },
    nullable: true,
  })
  attributes: Record<string, any> | null;

  @ApiProperty({
    description: 'Image URLs (array of strings, max 6)',
    type: String,
    example: [
      'https://res.cloudinary.com/demo/image1.jpg',
      'https://res.cloudinary.com/demo/image2.jpg',
    ],
    isArray: true,
  })
  images: string[];

  @ApiProperty({
    description: 'Creation date',
    example: '2026-02-01T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2026-02-01T15:30:00.000Z',
  })
  updatedAt: Date;

  static fromDomain(variant: ProductVariant): VariantResponseDto {
    const images = variant.getImages();

    return {
      id: variant.getId(),
      productId: variant.getProductId(),
      variantName: variant.getVariantName(),
      price: variant.getPrice(),
      discountPercent: variant.getDiscountPercent(),
      finalPrice: variant.calculateFinalPrice(),
      stock: variant.getStock(),
      status: variant.getStatus(),
      isActive: variant.getIsActive(),
      inStock: variant.isInStock(),
      availableForPurchase: variant.isAvailableForPurchase(),
      sellerProfileId: variant.getSellerProfileId(),
      attributes: variant.getAttributes(),
      images,
      createdAt: variant.createdAt,
      updatedAt: variant.updatedAt,
    };
  }
}
