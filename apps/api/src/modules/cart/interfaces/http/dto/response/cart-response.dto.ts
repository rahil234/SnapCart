import { ApiProperty } from '@nestjs/swagger';
import { Cart } from '@/modules/cart/domain/entities';
import { CartItemResponseDto } from './cart-item-response.dto';

export class CartResponseDto {
  @ApiProperty({
    description: 'Cart ID',
    example: 'cart_123abc',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: 'user_456def',
  })
  userId: string;

  @ApiProperty({
    description: 'Cart items',
    type: [CartItemResponseDto],
  })
  items: CartItemResponseDto[];

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
    description: 'Whether the cart is empty',
    example: false,
  })
  isEmpty: boolean;

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

  static fromDomain(cart: Cart): CartResponseDto {
    return {
      id: cart.getId(),
      userId: cart.getCustomerId(),
      items: cart.getItems().map(CartItemResponseDto.fromDomain),
      totalItems: cart.getTotalItems(),
      uniqueItemsCount: cart.getUniqueItemsCount(),
      isEmpty: cart.isEmpty(),
      createdAt: cart.getCreatedAt(),
      updatedAt: cart.getUpdatedAt(),
    };
  }
}
