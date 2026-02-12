import { apiClient } from '@/api/axios';
import { apiConfig } from '@/api/client';
import { WalletApi } from '@/api/generated';
import { handleRequest } from '@/api/utils/handleRequest';

const walletApi = new WalletApi(apiConfig, undefined, apiClient);

export const WalletService = {
  getWallet: () => handleRequest(() => walletApi.walletControllerGetWallet()),

  getTransactions: (limit: number = 20, offset: number = 0) =>
    handleRequest(() =>
      walletApi.walletControllerGetTransactions(limit, offset)
    ),

  addMoney: (amount: number, description?: string, reference?: string) =>
    handleRequest(() =>
      walletApi.walletControllerAddMoney({
        amount,
        description,
        reference,
      })
    ),

  validateBalance: (amount: number) =>
    handleRequest(() =>
      walletApi.walletControllerValidateBalance({
        amount,
      })
    ),
};
