export class VerifyPaymentCommand {
  constructor(
    public readonly razorpayOrderId: string,
    public readonly razorpayPaymentId: string,
    public readonly razorpaySignature: string,
    public readonly orderId: string,
  ) {}
}
