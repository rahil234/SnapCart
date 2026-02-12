import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import {
  CUSTOMER_IDENTITY_RESOLVER,
  CustomerIdentityResolver,
} from '@/modules/user/application/ports/customer-identity.resolver';
import { WalletRepository } from '@/modules/wallet/domain/repositories';
import { ValidateWalletBalanceCommand } from '../validate-wallet-balance.command';

export interface ValidateWalletBalanceResponseDto {
  isValid: boolean;
  currentBalance: number;
  requiredAmount: number;
  shortfall: number;
}

@CommandHandler(ValidateWalletBalanceCommand)
@Injectable()
export class ValidateWalletBalanceHandler implements ICommandHandler<ValidateWalletBalanceCommand> {
  constructor(
    @Inject('WalletRepository')
    private readonly walletRepository: WalletRepository,
    @Inject(CUSTOMER_IDENTITY_RESOLVER)
    private readonly customerIdentityResolver: CustomerIdentityResolver,
  ) {}

  async execute(
    command: ValidateWalletBalanceCommand,
  ): Promise<ValidateWalletBalanceResponseDto> {
    const { userId, amount } = command;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    // Resolve customer ID from user ID
    const customerId =
      await this.customerIdentityResolver.resolveCustomerIdByUserId(userId);

    // Get wallet
    const wallet = await this.walletRepository.findByCustomerId(customerId);

    if (!wallet) {
      return {
        isValid: false,
        currentBalance: 0,
        requiredAmount: amount,
        shortfall: amount,
      };
    }

    // Check if wallet is active
    if (!wallet.getIsActive()) {
      throw new BadRequestException('Wallet is not active');
    }

    const currentBalance = wallet.getBalance();
    const isValid = wallet.hasSufficientBalance(amount);
    const shortfall = isValid ? 0 : amount - currentBalance;

    return {
      isValid,
      currentBalance,
      requiredAmount: amount,
      shortfall,
    };
  }
}
