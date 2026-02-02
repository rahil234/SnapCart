import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductVariant, VariantStatus } from '@/modules/product/domain/entities/product-variant.entity';

/**
 * Product Variant Response DTO
 */
export class VariantResponseDto {
  @ApiProperty({
    description: 'Variant ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  productId: string;

  @ApiProperty({
    description: 'SKU (Stock Keeping Unit)',
    example: 'BAS-1KG-001'
  })
  sku: string;

  @ApiProperty({
    description: 'Variant name',
    example: '1kg'
  })
  variantName: string;

  @ApiProperty({
    description: 'Base price',
    example: 120.00
  })
  price: number;

  @ApiProperty({
    description: 'Discount percentage',
    example: 10
  })
  discountPercent: number;

  @ApiProperty({
    description: 'Final price after discount',
    example: 108.00
  })
  finalPrice: number;

  @ApiProperty({
    description: 'Stock quantity',
    example: 100
  })
  stock: number;

  @ApiProperty({
    description: 'Variant status',
    enum: VariantStatus,
    example: VariantStatus.ACTIVE
  })
  status: VariantStatus;

  @ApiProperty({
    description: 'Whether variant is active',
    example: true
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether variant is in stock',
    example: true
  })
  inStock: boolean;

  @ApiProperty({
    description: 'Whether variant is available for purchase',
    example: true
  })
  availableForPurchase: boolean;

  @ApiPropertyOptional({
    description: 'Seller profile ID',
    example: '123e4567-e89b-12d3-a456-426614174002',
    nullable: true
  })
  sellerProfileId: string | null;

  @ApiPropertyOptional({
    description: 'Additional attributes',
    example: { weight: '1kg', organic: true },
    nullable: true
  })
  attributes: Record<string, any> | null;

  @ApiPropertyOptional({
    description: 'Image URL',
    example: 'https://example.com/images/basmati-1kg.jpg',
    nullable: true
  })
  imageUrl: string | null;

  @ApiProperty({
    description: 'Creation date',
    example: '2026-02-01T10:00:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2026-02-01T15:30:00.000Z'
  })
  updatedAt: Date;

  static fromDomain(variant: ProductVariant): VariantResponseDto {
    return {
      id: variant.getId(),
      productId: variant.getProductId(),
      sku: variant.getSku(),
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
      imageUrl: variant.getImageUrl(),
      createdAt: variant.createdAt,
      updatedAt: variant.updatedAt,
    };
  }
}
