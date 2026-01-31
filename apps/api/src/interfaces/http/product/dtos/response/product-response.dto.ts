import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Product,
  ProductStatus,
} from '@/domain/product/entities/product.entity';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Premium Cotton T-Shirt',
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Comfortable premium cotton t-shirt perfect for casual wear',
  })
  description: string;

  @ApiProperty({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  categoryId: string;

  @ApiProperty({
    description: 'Product price in cents',
    example: 2999,
  })
  price: number;

  @ApiPropertyOptional({
    description: 'Discount percentage',
    example: 15,
    nullable: true,
  })
  discountPercent: number | null;

  @ApiProperty({
    description: 'Final price after discount in cents',
    example: 2549,
  })
  finalPrice: number;

  @ApiProperty({
    description: 'Whether try-on feature is enabled',
    example: true,
  })
  tryOn: boolean;

  @ApiProperty({
    description: 'Product status',
    enum: ProductStatus,
    example: ProductStatus.ACTIVE,
  })
  status: ProductStatus;

  @ApiProperty({
    description: 'Whether product is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether product has discount applied',
    example: true,
  })
  hasDiscount: boolean;

  @ApiProperty({
    description: 'Product creation date',
    example: '2026-01-29T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Product last update date',
    example: '2026-01-29T15:30:00.000Z',
  })
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    description: string,
    categoryId: string,
    price: number,
    discountPercent: number | null,
    finalPrice: number,
    status: ProductStatus,
    isActive: boolean,
    hasDiscount: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.categoryId = categoryId;
    this.price = price;
    this.discountPercent = discountPercent;
    this.finalPrice = finalPrice;
    this.status = status;
    this.isActive = isActive;
    this.hasDiscount = hasDiscount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDomain(product: Product): ProductResponseDto {
    return new ProductResponseDto(
      product.id,
      product.getName(),
      product.getDescription(),
      product.getCategoryId(),
      product.getPrice(),
      product.getDiscountPercent(),
      product.getFinalPrice(),
      product.getStatus(),
      product.isActive(),
      product.hasDiscount(),
      product.createdAt,
      product.updatedAt,
    );
  }
}
