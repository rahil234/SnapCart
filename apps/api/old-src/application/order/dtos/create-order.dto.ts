import {
  OrderItem,
  OrderStatus,
  PaymentStatus,
} from '@/domain/order/entities/order.entity';

export class CreateOrderDto {
  userId: string;

  items: OrderItem[];

  subtotal: number;
  discount?: number;
  total: number;

  metadata: Record<string, unknown>;

  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
}
