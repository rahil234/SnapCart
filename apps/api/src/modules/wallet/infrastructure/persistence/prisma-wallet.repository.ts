import { Injectable } from '@nestjs/common';

import {
  Wallet,
  WalletTransaction,
  WalletTransactionStatus,
  WalletTransactionType,
} from '@/modules/wallet/domain/entities';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { WalletRepository } from '@/modules/wallet/domain/repositories';

@Injectable()
export class PrismaWalletRepository implements WalletRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Wallet | null> {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id },
    });

    if (!wallet) return null;

    return Wallet.create(
      wallet.id,
      wallet.customerId,
      wallet.balance,
      wallet.currency,
      wallet.isActive,
      wallet.createdAt,
      wallet.updatedAt,
    );
  }

  async findByCustomerId(customerId: string): Promise<Wallet | null> {
    const wallet = await this.prisma.wallet.findUnique({
      where: { customerId },
    });

    if (!wallet) return null;

    return Wallet.create(
      wallet.id,
      wallet.customerId,
      wallet.balance,
      wallet.currency,
      wallet.isActive,
      wallet.createdAt,
      wallet.updatedAt,
    );
  }

  async create(customerId: string, currency: string = 'INR'): Promise<Wallet> {
    const wallet = await this.prisma.wallet.create({
      data: {
        customerId,
        currency,
        balance: 0,
        isActive: true,
      },
    });

    return Wallet.create(
      wallet.id,
      wallet.customerId,
      wallet.balance,
      wallet.currency,
      wallet.isActive,
      wallet.createdAt,
      wallet.updatedAt,
    );
  }

  async updateBalance(walletId: string, newBalance: number): Promise<Wallet> {
    const wallet = await this.prisma.wallet.update({
      where: { id: walletId },
      data: { balance: newBalance },
    });

    return Wallet.create(
      wallet.id,
      wallet.customerId,
      wallet.balance,
      wallet.currency,
      wallet.isActive,
      wallet.createdAt,
      wallet.updatedAt,
    );
  }

  async createTransactionWithBalanceUpdate(
    transaction: WalletTransaction,
    newBalance: number,
  ): Promise<WalletTransaction> {
    const result = await this.prisma.$transaction(async (tx) => {
      // Update wallet balance
      await tx.wallet.update({
        where: { id: transaction.getWalletId() },
        data: { balance: newBalance },
      });

      // Create transaction
      return tx.walletTransaction.create({
        data: {
          walletId: transaction.getWalletId(),
          amount: transaction.getAmount(),
          type: transaction.getType(),
          status: transaction.getStatus(),
          description: transaction.getDescription(),
          reference: transaction.getReference(),
          orderId: transaction.getOrderId(),
          metadata: transaction.getMetadata() ?? undefined,
        },
      });
    });

    return WalletTransaction.create(
      result.id,
      result.walletId,
      result.amount,
      result.type as WalletTransactionType,
      result.status as WalletTransactionStatus,
      result.description,
      result.reference,
      result.orderId,
      result.metadata as Record<string, any> | null,
      result.createdAt,
      result.updatedAt,
    );
  }

  async findTransactionsByWalletId(
    walletId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<WalletTransaction[]> {
    const transactions = await this.prisma.walletTransaction.findMany({
      where: { walletId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return transactions.map((t) =>
      WalletTransaction.create(
        t.id,
        t.walletId,
        t.amount,
        t.type as WalletTransactionType,
        t.status as WalletTransactionStatus,
        t.description,
        t.reference,
        t.orderId,
        t.metadata as Record<string, any> | null,
        t.createdAt,
        t.updatedAt,
      ),
    );
  }

  async findTransactionById(id: string): Promise<WalletTransaction | null> {
    const transaction = await this.prisma.walletTransaction.findUnique({
      where: { id },
    });

    if (!transaction) return null;

    return WalletTransaction.create(
      transaction.id,
      transaction.walletId,
      transaction.amount,
      transaction.type as WalletTransactionType,
      transaction.status as WalletTransactionStatus,
      transaction.description,
      transaction.reference,
      transaction.orderId,
      transaction.metadata as Record<string, any> | null,
      transaction.createdAt,
      transaction.updatedAt,
    );
  }

  async findTransactionsByOrderId(
    orderId: string,
  ): Promise<WalletTransaction[]> {
    const transactions = await this.prisma.walletTransaction.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });

    return transactions.map((t) =>
      WalletTransaction.create(
        t.id,
        t.walletId,
        t.amount,
        t.type as WalletTransactionType,
        t.status as WalletTransactionStatus,
        t.description,
        t.reference,
        t.orderId,
        t.metadata as Record<string, any> | null,
        t.createdAt,
        t.updatedAt,
      ),
    );
  }

  async getTransactionCount(walletId: string): Promise<number> {
    return this.prisma.walletTransaction.count({
      where: { walletId },
    });
  }
}
