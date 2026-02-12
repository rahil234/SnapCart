/**
 * Add Money to Wallet Command
 * Adds funds to a customer's wallet
 */
export class AddMoneyToWalletCommand {
  constructor(
    public readonly userId: string,
    public readonly amount: number,
    public readonly description?: string,
    public readonly reference?: string,
  ) {}
}
