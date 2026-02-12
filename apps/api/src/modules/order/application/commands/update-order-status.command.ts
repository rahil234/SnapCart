import { OrderStatus } from '../../domain/enums';

export class UpdateOrderStatusCommand {
  constructor(
    public readonly orderId: string,
    public readonly newStatus: OrderStatus,
    public readonly userId: string,
    public readonly userRole: string,
  ) {}
}
