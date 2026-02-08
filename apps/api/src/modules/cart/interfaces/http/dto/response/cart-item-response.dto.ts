import { ApiProperty } from '@nestjs/swagger';

import { CartItem } from '@/modules/cart/domain/entities';

export class CartItemResponseDto {
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
    example: 'product_789ghi',
  })
  productId: string;

  @ApiProperty({
    description: 'Product variant ID',
    example: 'variant_789ghi',
  })
  variantId: string;

  @ApiProperty({
    description: 'Quantity of the item',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'Created at timestamp',
    example: '2026-02-05T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated at timestamp',
    example: '2026-02-05T10:30:00Z',
  })
  updatedAt: Date;

  static fromDomain(cartItem: CartItem): CartItemResponseDto {
    return {
      id: cartItem.getId(),
      cartId: cartItem.getCartId(),
      productId: cartItem.getProductId(),
      variantId: cartItem.getProductVariantId(),
      quantity: cartItem.getQuantity(),
      createdAt: cartItem.getCreatedAt(),
      updatedAt: cartItem.getUpdatedAt(),
    };
  }
}
