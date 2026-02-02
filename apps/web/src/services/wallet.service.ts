import { WalletApi } from '@/api/generated';
import { apiConfig } from '@/api/client';

const walletApi = new WalletApi(apiConfig);

export const WalletService = {
  getBalance: () => walletApi.walletControllerGetBalance(),
  getTransactions: () => walletApi.walletControllerGetTransactions(),
  addFunds: (amount: number) =>
    walletApi.walletControllerAddFunds({ amount }),
};
