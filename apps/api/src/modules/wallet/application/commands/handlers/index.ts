import { DebitWalletHandler } from './debit-wallet.handler';
import { RefundToWalletHandler } from './refund-to-wallet.handler';
import { AddMoneyToWalletHandler } from './add-money-to-wallet.handler';
import { ValidateWalletBalanceHandler } from './validate-wallet-balance.handler';

export const WalletCommandHandlers = [
  AddMoneyToWalletHandler,
  DebitWalletHandler,
  RefundToWalletHandler,
  ValidateWalletBalanceHandler,
];
