import { ApiProperty, PickType } from '@nestjs/swagger';

import { OrderItemDto } from '@/application/order/dtos/order-item.dto';
import { ProductResponseDto } from '@/application/product/dtos/response/product-response.dto';
import { ProductVariantResponseDto } from '@/application/product/dtos/variant/product-variant.response.dto';

class ProductPickDto extends PickType(ProductResponseDto, [
  'id',
  'name',
  'description',
  'price',
  'thumbnail',
  'category',
  'discountPrice',
  'discountPercent',
]) {}

export class OrderItemResponseDto implements OrderItemDto {
  @ApiProperty({
    type: ProductPickDto,
  })
  product: ProductPickDto;

  @ApiProperty({
    type: ProductVariantResponseDto,
    description: 'Variant of the product',
  })
  variant: ProductVariantResponseDto;

  @ApiProperty({
    example: 3,
    description: 'number of units of the product variant ordered',
  })
  quantity: number;

  @ApiProperty({
    example: 2046,
    description:
      'subtotal price for the product variant (quantity x unit price)',
  })
  subtotal: number;
}
