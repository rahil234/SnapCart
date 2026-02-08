// import { WalletApi } from '@/api/generated';
import { apiConfig } from '@/api/client';

const walletApi = {};

export const WalletService = {
  getBalance: () => walletApi.walletControllerGetBalance(),
  getTransactions: () => walletApi.walletControllerGetTransactions(),
  addFunds: (amount: number) =>
    walletApi.walletControllerAddFunds({ amount }),
};
