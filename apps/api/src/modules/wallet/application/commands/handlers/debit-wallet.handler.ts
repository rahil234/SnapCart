import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';

import { DebitWalletCommand } from '../debit-wallet.command';
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

export interface DebitWalletResponseDto {
  transactionId: string;
  newBalance: number;
  amount: number;
  orderId: string;
  status: string;
}

@CommandHandler(DebitWalletCommand)
@Injectable()
export class DebitWalletHandler implements ICommandHandler<DebitWalletCommand> {
  constructor(
    @Inject('WalletRepository')
    private readonly walletRepository: WalletRepository,
    @Inject(CUSTOMER_IDENTITY_RESOLVER)
    private readonly customerIdentityResolver: CustomerIdentityResolver,
  ) {}

  async execute(command: DebitWalletCommand): Promise<DebitWalletResponseDto> {
    const { userId, amount, orderId, description } = command;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    // Resolve customer ID from user ID
    const customerId =
      await this.customerIdentityResolver.resolveCustomerIdByUserId(userId);

    // Get wallet
    const wallet = await this.walletRepository.findByCustomerId(customerId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Check if wallet is active
    if (!wallet.getIsActive()) {
      throw new BadRequestException('Wallet is not active');
    }

    // Check sufficient balance
    if (!wallet.hasSufficientBalance(amount)) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    // Calculate new balance
    const newBalance = wallet.getBalance() - amount;

    // Create transaction
    const transaction = WalletTransaction.create(
      uuidv4(),
      wallet.getId(),
      amount,
      WalletTransactionType.DEBIT,
      WalletTransactionStatus.COMPLETED,
      description || `Payment for order ${orderId}`,
      null,
      orderId,
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
      orderId,
      status: savedTransaction.getStatus(),
    };
  }
}
