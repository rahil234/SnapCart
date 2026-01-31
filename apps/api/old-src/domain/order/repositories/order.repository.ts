import { Order } from '@/domain/order/entities/order.entity';

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  findAll({ limit, page }: { limit: number; page: number }): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  findByOrderNumber(orderNumber: string): Promise<Order | null>;
  update(id: string, order: Partial<Order>): Promise<Order>;
  listByUser(
    userId: string,
    { limit, page }: { limit: number; page: number },
  ): Promise<Order[]>;
  softDelete(id: string): Promise<void>;
  countAll(): Promise<number>;
}
