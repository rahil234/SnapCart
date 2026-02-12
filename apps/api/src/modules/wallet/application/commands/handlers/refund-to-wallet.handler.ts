import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';

import { RefundToWalletCommand } from '../refund-to-wallet.command';
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

export interface RefundToWalletResponseDto {
  transactionId: string;
  newBalance: number;
  amount: number;
  orderId: string;
  status: string;
}

@CommandHandler(RefundToWalletCommand)
@Injectable()
export class RefundToWalletHandler
  implements ICommandHandler<RefundToWalletCommand>
{
  constructor(
    @Inject('WalletRepository')
    private readonly walletRepository: WalletRepository,
    @Inject(CUSTOMER_IDENTITY_RESOLVER)
    private readonly customerIdentityResolver: CustomerIdentityResolver,
  ) {}

  async execute(command: RefundToWalletCommand): Promise<RefundToWalletResponseDto> {
    const { userId, amount, orderId, description } = command;

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
      WalletTransactionType.REFUND,
      WalletTransactionStatus.COMPLETED,
      description || `Refund for order ${orderId}`,
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
