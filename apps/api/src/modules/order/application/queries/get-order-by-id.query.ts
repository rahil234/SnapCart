export class GetOrderByIdQuery {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly userRole: string,
  ) {}
}
