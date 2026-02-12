export interface Wallet {
  id: string;
  customerId: string;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit' | 'refund' | 'cashback';
  status: 'pending' | 'completed' | 'failed' | 'reversed';
  description: string | null;
  reference: string | null;
  orderId: string | null;
  createdAt: string;
}
