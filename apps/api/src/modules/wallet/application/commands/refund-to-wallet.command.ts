/**
 * Refund to Wallet Command
 * Refunds amount to wallet (e.g., order cancellation)
 */
export class RefundToWalletCommand {
  constructor(
    public readonly userId: string,
    public readonly amount: number,
    public readonly orderId: string,
    public readonly description?: string,
  ) {}
}
