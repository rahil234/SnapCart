import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetWalletTransactionsQuery } from '../get-wallet-transactions.query';
import { WalletRepository } from '../../../domain/repositories/wallet.repository';
import {
  CUSTOMER_IDENTITY_RESOLVER,
  CustomerIdentityResolver,
} from '@/modules/user/application/ports/customer-identity.resolver';

export interface TransactionResponseDto {
  id: string;
  amount: number;
  type: string;
  status: string;
  description: string | null;
  reference: string | null;
  orderId: string | null;
  createdAt: Date;
}

export interface WalletTransactionsResponseDto {
  transactions: TransactionResponseDto[];
  total: number;
  limit: number;
  offset: number;
}

@QueryHandler(GetWalletTransactionsQuery)
@Injectable()
export class GetWalletTransactionsHandler
  implements IQueryHandler<GetWalletTransactionsQuery>
{
  constructor(
    @Inject('WalletRepository')
    private readonly walletRepository: WalletRepository,
    @Inject(CUSTOMER_IDENTITY_RESOLVER)
    private readonly customerIdentityResolver: CustomerIdentityResolver,
  ) {}

  async execute(
    query: GetWalletTransactionsQuery,
  ): Promise<WalletTransactionsResponseDto> {
    const { userId, limit, offset } = query;

    // Resolve customer ID from user ID
    const customerId =
      await this.customerIdentityResolver.resolveCustomerIdByUserId(userId);

    // Find wallet
    const wallet = await this.walletRepository.findByCustomerId(customerId);

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Get transactions
    const transactions = await this.walletRepository.findTransactionsByWalletId(
      wallet.getId(),
      limit,
      offset,
    );

    // Get total count
    const total = await this.walletRepository.getTransactionCount(wallet.getId());

    return {
      transactions: transactions.map((t) => ({
        id: t.getId(),
        amount: t.getAmount(),
        type: t.getType(),
        status: t.getStatus(),
        description: t.getDescription(),
        reference: t.getReference(),
        orderId: t.getOrderId(),
        createdAt: t.getCreatedAt(),
      })),
      total,
      limit,
      offset,
    };
  }
}
