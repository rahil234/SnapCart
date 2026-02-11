export class CancelOrderCommand {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly userRole: string,
    public readonly cancelReason: string,
  ) {}
}
