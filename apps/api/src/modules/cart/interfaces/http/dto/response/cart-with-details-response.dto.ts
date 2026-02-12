import { ApiProperty } from '@nestjs/swagger';

export class ProductVariantDetailDto {
  @ApiProperty({
    description: 'Product variant ID',
    example: 'variant_123abc',
  })
  id: string;

  @ApiProperty({
    description: 'Variant name (e.g., "500g", "1kg", "Red-M")',
    example: '1kg',
  })
  variantName: string;

  @ApiProperty({
    description: 'Price of the variant',
    example: 29.99,
  })
  price: number;

  @ApiProperty({
    description: 'Discount percentage',
    example: 10,
  })
  discountPercent: number;

  @ApiProperty({
    description: 'Final price after discount',
    example: 26.99,
  })
  finalPrice: number;

  @ApiProperty({
    description: 'Stock available',
    example: 100,
  })
  stock: number;

  @ApiProperty({
    description: 'Variant status',
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'Product ID',
    example: 'product_456def',
  })
  productId: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Basmati Rice',
  })
  productName: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Premium quality basmati rice',
  })
  productDescription: string;

  @ApiProperty({
    description: 'Product brand',
    example: 'India Gate',
    nullable: true,
  })
  productBrand?: string | null;

  @ApiProperty({
    description: 'Variant image URL',
    example: 'https://example.com/image.jpg',
  })
  imageUrl?: string;

  static fromDomain(
    domain: CartItemWithDetailsResponseDto['variant'],
  ): ProductVariantDetailDto {
    return {
      id: domain.id,
      variantName: domain.variantName,
      price: domain.price,
      discountPercent: domain.discountPercent,
      finalPrice: domain.finalPrice,
      stock: domain.stock,
      status: domain.status,
      productId: domain.productId,
      productName: domain.productName,
      productDescription: domain.productDescription,
      productBrand: domain.productBrand,
      imageUrl: domain.imageUrl,
    };
  }
}

export class CartItemWithDetailsResponseDto {
  @ApiProperty({
    description: 'Cart item ID',
    example: 'item_123abc',
  })
  id: string;

  @ApiProperty({
    description: 'Cart ID',
    example: 'cart_456def',
  })
  cartId: string;

  @ApiProperty({
    description: 'Product variant ID',
    example: 'variant_789ghi',
  })
  productVariantId: string;

  @ApiProperty({
    description: 'Quantity of the item',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'Product variant details',
    type: ProductVariantDetailDto,
  })
  variant: ProductVariantDetailDto;

  @ApiProperty({
    description: 'Subtotal (quantity × final price)',
    example: 53.98,
  })
  subtotal: number;

  @ApiProperty({
    description: 'Created at timestamp',
    example: '2026-02-06T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated at timestamp',
    example: '2026-02-06T10:30:00Z',
  })
  updatedAt: Date;

  static fromDomain(
    domain: CartWithDetailsResponseDto['items'][number],
  ): CartItemWithDetailsResponseDto {
    return {
      id: domain.id,
      cartId: domain.cartId,
      productVariantId: domain.productVariantId,
      quantity: domain.quantity,
      variant: ProductVariantDetailDto.fromDomain(domain.variant),
      subtotal: domain.quantity * domain.variant.finalPrice,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}

export class CartWithDetailsResponseDto {
  @ApiProperty({
    description: 'Cart ID',
    example: 'cart_123abc',
  })
  id: string;

  @ApiProperty({
    description: 'Customer ID',
    example: 'customer_456def',
  })
  customerId: string;

  @ApiProperty({
    description: 'Cart items with full product details',
    type: [CartItemWithDetailsResponseDto],
  })
  items: CartItemWithDetailsResponseDto[];

  @ApiProperty({
    description: 'Total number of items (sum of all quantities)',
    example: 5,
  })
  totalItems: number;

  @ApiProperty({
    description: 'Number of unique items',
    example: 3,
  })
  uniqueItemsCount: number;

  @ApiProperty({
    description: 'Total amount (sum of all subtotals)',
    example: 159.95,
  })
  totalAmount: number;

  @ApiProperty({
    description: 'Whether the cart is empty',
    example: false,
  })
  isEmpty: boolean;

  @ApiProperty({
    description: 'Created at timestamp',
    example: '2026-02-06T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated at timestamp',
    example: '2026-02-06T10:30:00Z',
  })
  updatedAt: Date;

  static fromDomain(
    domain: CartWithDetailsResponseDto,
  ): CartWithDetailsResponseDto {
    return {
      id: domain.id,
      customerId: domain.customerId,
      items: domain.items.map(CartItemWithDetailsResponseDto.fromDomain),
      totalItems: domain.totalItems,
      uniqueItemsCount: domain.uniqueItemsCount,
      totalAmount: domain.totalAmount,
      isEmpty: domain.isEmpty,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}
