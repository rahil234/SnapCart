import { Wallet } from '../entities/wallet.entity';
import { WalletTransaction } from '../entities/wallet-transaction.entity';

/**
 * Wallet Repository Interface (Port)
 * Defines the contract for wallet data access
 */
export interface WalletRepository {
  /**
   * Find wallet by ID
   */
  findById(id: string): Promise<Wallet | null>;

  /**
   * Find wallet by customer ID
   */
  findByCustomerId(customerId: string): Promise<Wallet | null>;

  /**
   * Create a new wallet
   */
  create(customerId: string, currency?: string): Promise<Wallet>;

  /**
   * Update wallet balance
   */
  updateBalance(walletId: string, newBalance: number): Promise<Wallet>;

  /**
   * Create a transaction and update balance atomically
   */
  createTransactionWithBalanceUpdate(
    transaction: WalletTransaction,
    newBalance: number,
  ): Promise<WalletTransaction>;

  /**
   * Find transactions by wallet ID
   */
  findTransactionsByWalletId(
    walletId: string,
    limit?: number,
    offset?: number,
  ): Promise<WalletTransaction[]>;

  /**
   * Find transaction by ID
   */
  findTransactionById(id: string): Promise<WalletTransaction | null>;

  /**
   * Find transactions by order ID
   */
  findTransactionsByOrderId(orderId: string): Promise<WalletTransaction[]>;

  /**
   * Get total transaction count for wallet
   */
  getTransactionCount(walletId: string): Promise<number>;
}
