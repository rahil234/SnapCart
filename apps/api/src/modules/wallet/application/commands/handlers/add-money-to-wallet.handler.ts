import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';

import { AddMoneyToWalletCommand } from '../add-money-to-wallet.command';
import { WalletRepository } from '../../../domain/repositories/wallet.repository';
import {
  WalletTransaction,
  WalletTransactionType,
  WalletTransactionStatus,
} from '../../../domain/entities/wallet-transaction.entity';
import {
  CUSTOMER_IDENTITY_RESOLVER,
  CustomerIdentityResolver,
} from '@/modules/user/application/ports/customer-identity.resolver';

export interface AddMoneyResponseDto {
  transactionId: string;
  newBalance: number;
  amount: number;
  status: string;
}

@CommandHandler(AddMoneyToWalletCommand)
@Injectable()
export class AddMoneyToWalletHandler
  implements ICommandHandler<AddMoneyToWalletCommand>
{
  constructor(
    @Inject('WalletRepository')
    private readonly walletRepository: WalletRepository,
    @Inject(CUSTOMER_IDENTITY_RESOLVER)
    private readonly customerIdentityResolver: CustomerIdentityResolver,
  ) {}

  async execute(command: AddMoneyToWalletCommand): Promise<AddMoneyResponseDto> {
    const { userId, amount, description, reference } = command;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    // Resolve customer ID from user ID
    const customerId =
      await this.customerIdentityResolver.resolveCustomerIdByUserId(userId);

    // Get or create wallet
    let wallet = await this.walletRepository.findByCustomerId(customerId);
    if (!wallet) {
      wallet = await this.walletRepository.create(customerId);
    }

    // Check if wallet is active
    if (!wallet.getIsActive()) {
      throw new BadRequestException('Wallet is not active');
    }

    // Calculate new balance
    const newBalance = wallet.getBalance() + amount;

    // Create transaction
    const transaction = WalletTransaction.create(
      uuidv4(),
      wallet.getId(),
      amount,
      WalletTransactionType.CREDIT,
      WalletTransactionStatus.COMPLETED,
      description || 'Added money to wallet',
      reference || null,
      null,
      null,
    );

    // Save transaction and update balance atomically
    const savedTransaction =
      await this.walletRepository.createTransactionWithBalanceUpdate(
        transaction,
        newBalance,
      );

    return {
      transactionId: savedTransaction.getId(),
      newBalance,
      amount,
      status: savedTransaction.getStatus(),
    };
  }
}
