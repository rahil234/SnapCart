/**
 * Wallet Transaction Type Enum
 */
export enum WalletTransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
  REFUND = 'refund',
  CASHBACK = 'cashback',
}

/**
 * Wallet Transaction Status Enum
 */
export enum WalletTransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REVERSED = 'reversed',
}

/**
 * Wallet Transaction Entity
 * Represents a single transaction on a wallet
 */
export class WalletTransaction {
  private constructor(
    private readonly id: string,
    private readonly walletId: string,
    private readonly amount: number,
    private readonly type: WalletTransactionType,
    private status: WalletTransactionStatus,
    private readonly description: string | null,
    private readonly reference: string | null,
    private readonly orderId: string | null,
    private readonly metadata: Record<string, any> | null,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  static create(
    id: string,
    walletId: string,
    amount: number,
    type: WalletTransactionType,
    status: WalletTransactionStatus = WalletTransactionStatus.PENDING,
    description: string | null = null,
    reference: string | null = null,
    orderId: string | null = null,
    metadata: Record<string, any> | null = null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ): WalletTransaction {
    if (amount <= 0) {
      throw new Error('Transaction amount must be positive');
    }
    return new WalletTransaction(
      id,
      walletId,
      amount,
      type,
      status,
      description,
      reference,
      orderId,
      metadata,
      createdAt,
      updatedAt,
    );
  }

  getId(): string {
    return this.id;
  }

  getWalletId(): string {
    return this.walletId;
  }

  getAmount(): number {
    return this.amount;
  }

  getType(): WalletTransactionType {
    return this.type;
  }

  getStatus(): WalletTransactionStatus {
    return this.status;
  }

  getDescription(): string | null {
    return this.description;
  }

  getReference(): string | null {
    return this.reference;
  }

  getOrderId(): string | null {
    return this.orderId;
  }

  getMetadata(): Record<string, any> | null {
    return this.metadata;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  /**
   * Mark transaction as completed
   */
  complete(): void {
    this.status = WalletTransactionStatus.COMPLETED;
  }

  /**
   * Mark transaction as failed
   */
  fail(): void {
    this.status = WalletTransactionStatus.FAILED;
  }

  /**
   * Mark transaction as reversed
   */
  reverse(): void {
    this.status = WalletTransactionStatus.REVERSED;
  }

  /**
   * Check if transaction is completed
   */
  isCompleted(): boolean {
    return this.status === WalletTransactionStatus.COMPLETED;
  }

  /**
   * Check if transaction affects balance positively
   */
  isCredit(): boolean {
    return this.type === WalletTransactionType.CREDIT ||
           this.type === WalletTransactionType.REFUND ||
           this.type === WalletTransactionType.CASHBACK;
  }
}
