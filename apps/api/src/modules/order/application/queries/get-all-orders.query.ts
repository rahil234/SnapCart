import { OrderStatus } from '../../domain/enums';

export class GetAllOrdersQuery {
  constructor(
    public readonly skip: number,
    public readonly take: number,
    public readonly orderStatus?: OrderStatus,
    public readonly paymentStatus?: string,
    public readonly customerId?: string,
    public readonly startDate?: Date,
    public readonly endDate?: Date,
  ) {}
}
