import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, Min } from 'class-validator';

export class AddItemToCartDto {
  @ApiProperty({
    description: 'Product ID to add to cart',
    example: 'product_123abc',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Product variant ID to add to cart',
    example: 'variant_123abc',
  })
  @IsString()
  productVariantId: string;

  @ApiProperty({
    description: 'Quantity to add',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;
}
