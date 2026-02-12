/**
 * Debit Wallet Command
 * Deducts funds from wallet for order payment
 */
export class DebitWalletCommand {
  constructor(
    public readonly userId: string,
    public readonly amount: number,
    public readonly orderId: string,
    public readonly description?: string,
  ) {}
}
