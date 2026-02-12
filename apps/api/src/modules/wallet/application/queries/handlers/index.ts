import { GetWalletHandler } from './get-wallet.handler';
import { GetWalletTransactionsHandler } from './get-wallet-transactions.handler';

export const WalletQueryHandlers = [
  GetWalletHandler,
  GetWalletTransactionsHandler,
];
