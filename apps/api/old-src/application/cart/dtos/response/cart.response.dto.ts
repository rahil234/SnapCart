import { ApiProperty } from '@nestjs/swagger';

import { CartDto } from '@/application/cart/dtos/cart.dto';
import { CartItemResponseDto } from '@/application/cart/dtos/response/cart-item.response.dto';

export class CartResponseDto {
  @ApiProperty({
    example: 'cart_1234567890',
    description: 'Unique identifier for the cart',
  })
  id: string;

  @ApiProperty({
    example: 2,
    description: 'Total number of items in the cart',
  })
  count: number;

  @ApiProperty({
    type: CartItemResponseDto,
    isArray: true,
    description: 'List of items in the cart',
  })
  items: CartItemResponseDto[];

  static fromEntity(cart: CartDto): CartResponseDto {
    return {
      id: cart.id,
      count: cart.items.length,
      items: cart.items,
    };
  }
}
