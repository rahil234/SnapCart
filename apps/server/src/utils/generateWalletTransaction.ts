import walletModel from '@models/walletTransactionModel';

const createWalletTransaction = async (
  amount: number,
  description: string,
  type: 'credit' | 'debit',
  userId?: string
) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  await walletModel.create({
    userId,
    amount: type === 'credit' ? amount : -amount,
    description,
    type,
  });
};

export default createWalletTransaction;
