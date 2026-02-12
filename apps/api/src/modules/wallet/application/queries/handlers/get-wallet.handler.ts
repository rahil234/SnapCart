import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetWalletQuery } from '../get-wallet.query';
import { WalletRepository } from '../../../domain/repositories/wallet.repository';
import {
  CUSTOMER_IDENTITY_RESOLVER,
  CustomerIdentityResolver,
} from '@/modules/user/application/ports/customer-identity.resolver';

export interface WalletResponseDto {
  id: string;
  customerId: string;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@QueryHandler(GetWalletQuery)
@Injectable()
export class GetWalletHandler implements IQueryHandler<GetWalletQuery> {
  constructor(
    @Inject('WalletRepository')
    private readonly walletRepository: WalletRepository,
    @Inject(CUSTOMER_IDENTITY_RESOLVER)
    private readonly customerIdentityResolver: CustomerIdentityResolver,
  ) {}

  async execute(query: GetWalletQuery): Promise<WalletResponseDto> {
    const { userId } = query;

    // Resolve customer ID from user ID
    const customerId =
      await this.customerIdentityResolver.resolveCustomerIdByUserId(userId);

    // Try to find existing wallet
    let wallet = await this.walletRepository.findByCustomerId(customerId);

    // If no wallet exists, create one
    if (!wallet) {
      wallet = await this.walletRepository.create(customerId);
    }

    return {
      id: wallet.getId(),
      customerId: wallet.getCustomerId(),
      balance: wallet.getBalance(),
      currency: wallet.getCurrency(),
      isActive: wallet.getIsActive(),
      createdAt: wallet.getCreatedAt(),
      updatedAt: wallet.getUpdatedAt(),
    };
  }
}
