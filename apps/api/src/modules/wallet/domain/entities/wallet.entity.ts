/**
 * Wallet Entity
 * Represents a customer's wallet with balance
 */
export class Wallet {
  private constructor(
    private readonly id: string,
    private readonly customerId: string,
    private balance: number,
    private readonly currency: string,
    private readonly isActive: boolean,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  static create(
    id: string,
    customerId: string,
    balance: number = 0,
    currency: string = 'INR',
    isActive: boolean = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ): Wallet {
    if (balance < 0) {
      throw new Error('Wallet balance cannot be negative');
    }
    return new Wallet(id, customerId, balance, currency, isActive, createdAt, updatedAt);
  }

  getId(): string {
    return this.id;
  }

  getCustomerId(): string {
    return this.customerId;
  }

  getBalance(): number {
    return this.balance;
  }

  getCurrency(): string {
    return this.currency;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  /**
   * Check if wallet has sufficient balance
   */
  hasSufficientBalance(amount: number): boolean {
    return this.isActive && this.balance >= amount;
  }

  /**
   * Credit amount to wallet
   */
  credit(amount: number): void {
    if (amount <= 0) {
      throw new Error('Credit amount must be positive');
    }
    this.balance += amount;
  }

  /**
   * Debit amount from wallet
   */
  debit(amount: number): void {
    if (amount <= 0) {
      throw new Error('Debit amount must be positive');
    }
    if (!this.hasSufficientBalance(amount)) {
      throw new Error('Insufficient wallet balance');
    }
    this.balance -= amount;
  }
}
