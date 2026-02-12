export class CreatePaymentCommand {
  constructor(
    public readonly orderId: string,
  ) {}
}
