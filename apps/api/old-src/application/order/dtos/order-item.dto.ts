import { ApiProperty } from '@nestjs/swagger';

import { ProductDto } from '@/application/product/dtos/product.dto';
import { VariantDto } from '@/application/product/dtos/variant/variant.dto';
import { OrderItem } from '@/domain/order/entities/order.entity';

export class OrderItemDto {
  @ApiProperty({
    type: VariantDto,
  })
  product: Pick<
    ProductDto,
    | 'id'
    | 'name'
    | 'description'
    | 'price'
    | 'thumbnail'
    | 'category'
    | 'discountPrice'
    | 'discountPercent'
  >;

  @ApiProperty({
    description: 'Variant of the product',
    type: VariantDto,
  })
  variant: VariantDto;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  subtotal: number;

  static fromEntity(
    entity: OrderItem,
    product: ProductDto,
    variant: VariantDto,
  ): OrderItemDto {
    return {
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        thumbnail: product.thumbnail,
        category: product.category,
        discountPrice: product.discountPrice,
        discountPercent: product.discountPercent,
      },
      variant: variant,
      quantity: entity.quantity,
      subtotal: entity.subtotal,
    };
  }
}
