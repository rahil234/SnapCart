/**
 * Get Wallet Transactions Query
 * Retrieves transaction history for a wallet
 */
export class GetWalletTransactionsQuery {
  constructor(
    public readonly userId: string,
    public readonly limit: number = 20,
    public readonly offset: number = 0,
  ) {}
}
