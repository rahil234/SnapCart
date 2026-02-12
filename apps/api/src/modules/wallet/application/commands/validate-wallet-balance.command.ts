/**
 * Validate Wallet Balance Command
 * Validates if wallet has sufficient balance for an order
 */
export class ValidateWalletBalanceCommand {
  constructor(
    public readonly userId: string,
    public readonly amount: number,
  ) {}
}
