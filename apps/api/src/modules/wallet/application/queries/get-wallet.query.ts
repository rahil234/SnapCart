/**
 * Get Wallet Query
 * Retrieves wallet information for a customer
 */
export class GetWalletQuery {
  constructor(public readonly userId: string) {}
}
