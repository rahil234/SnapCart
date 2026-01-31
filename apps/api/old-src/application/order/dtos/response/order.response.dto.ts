import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

import { OrderDto } from '@/application/order/dtos/order.dto';
import { OrderStatus, PaymentStatus } from '@/domain/order/entities/order.entity';
import { OrderItemResponseDto } from '@/application/order/dtos/response/order-item.response.dto';
import { UserResponseDto } from '@/application/user/dtos/response/user-response.dto';

class CustomerResponseDto extends PickType(UserResponseDto, [
  'id',
  'name',
  'email',
  'phone',
]) {}

export class OrderResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the order',
    example: 'ord_1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Order number',
    example: 'ORD-2024-0001',
  })
  orderNumber: string;

  @ApiProperty({
    type: CustomerResponseDto,
  })
  customer: CustomerResponseDto;

  @ApiPropertyOptional({ nullable: true })
  shippingAddress: object;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  shippingCharge: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  total: number;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiPropertyOptional({ nullable: true })
  paymentMethod?: string | null;

  @ApiProperty()
  paymentStatus: PaymentStatus;

  @ApiProperty()
  orderStatus: OrderStatus;

  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty({ type: Date, nullable: true })
  placedAt: Date | null;

  @ApiProperty({ type: Date, nullable: true })
  updatedAt: Date | null;

  @ApiProperty({ type: Date, nullable: true })
  deliveredAt: Date | null;

  @ApiProperty({ type: Date, nullable: true })
  cancelledAt: Date | null;

  static fromEntity(this: void, orderDto: OrderDto): OrderResponseDto {
    return {
      id: orderDto.id,
      orderNumber: orderDto.orderNumber,
      customer: orderDto.customer,
      placedAt: orderDto.placedAt,
      updatedAt: orderDto.updatedAt,
      deliveredAt: orderDto.deliveredAt ?? null,
      cancelledAt: orderDto.cancelledAt ?? null,
      subtotal: orderDto.subtotal,
      shippingAddress: orderDto.shippingAddress,
      shippingCharge: orderDto.shippingCharge,
      discount: orderDto.discount,
      total: orderDto.total,
      items: orderDto.items,
      paymentMethod: orderDto.paymentMethod ?? null,
      paymentStatus: orderDto.paymentStatus,
      orderStatus: orderDto.orderStatus,
      isDeleted: false,
    };
  }
}
