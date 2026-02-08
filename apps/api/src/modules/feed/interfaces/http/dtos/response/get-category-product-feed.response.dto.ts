import { ApiProperty } from '@nestjs/swagger';

import { CategoryProductFeedItem } from '@/modules/feed/application/queries/results';

class CategoryResponseDto {
  @ApiProperty({
    type: String,
    description: 'The unique identifier of the category',
    example: 'category-123',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'The name of the category',
    example: 'Electronics',
  })
  name: string;

  static fromCategory(
    category: CategoryProductFeedItem['products'][number]['category'],
  ): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
    };
  }
}

class ProductVariantDto {
  @ApiProperty({
    type: String,
    description: 'The unique identifier of the product variant',
    example: 'variant-1',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'The name of the product variant',
    example: 'Smartphone - Black',
  })
  variantName: string;

  @ApiProperty({
    type: Number,
    description: 'The price of the product variant',
    example: 699.99,
  })
  price: number;

  @ApiProperty({
    type: Number,
    description: 'The discount percentage of the product variant',
    example: 10,
    required: false,
  })
  discountPercentage?: number;

  @ApiProperty({
    type: String,
    description: 'The URL of the product variant image',
    example: 'https://example.com/images/variant-1-img1.jpg',
  })
  imageUrl: string;

  static fromVariant(
    variant: CategoryProductFeedItem['products'][number]['variant'],
  ): ProductVariantDto {
    return {
      id: variant.id,
      variantName: variant.name,
      price: variant.price,
      imageUrl: variant.images[0] || '',
      discountPercentage: variant.discountPercent || undefined,
    };
  }
}

class ProductDto {
  @ApiProperty({
    type: String,
    description: 'The unique identifier of the product',
    example: 'product-1',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'The name of the product',
    example: 'Smartphone',
  })
  name: string;

  @ApiProperty({
    type: CategoryResponseDto,
    description: 'The category of the product',
  })
  category: CategoryResponseDto;

  @ApiProperty({
    type: ProductVariantDto,
    description: 'The variant of the product',
  })
  variant: ProductVariantDto;

  static fromProduct(
    product: CategoryProductFeedItem['products'][number],
  ): ProductDto {
    return {
      id: product.id,
      name: product.name,
      category: CategoryResponseDto.fromCategory(product.category),
      variant: ProductVariantDto.fromVariant(product.variant),
    };
  }
}

export class GetCategoryProductFeedResponseDto {
  @ApiProperty({
    type: String,
    description: 'The unique identifier of the category',
    example: 'category-123',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'The name of the category',
    example: 'Electronics',
  })
  name: string;

  @ApiProperty({
    isArray: true,
    type: ProductDto,
    description: 'List of products in the category',
  })
  products: ProductDto[];

  static fromCategory(
    category: CategoryProductFeedItem,
  ): GetCategoryProductFeedResponseDto {
    return {
      id: category.id,
      name: category.name,
      products: category.products.map(ProductDto.fromProduct),
    };
  }
}
