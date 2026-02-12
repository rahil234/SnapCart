import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { SellerRepository } from '@/modules/user/domain/repositories';
import { SellerIdentityPort } from '@/modules/product/application/ports/seller-identity.port';

@Injectable()
export class SellerIdentityAdapter implements SellerIdentityPort {
  constructor(
    @Inject('SellerRepository')
    private readonly sellerRepo: SellerRepository,
  ) {}
  async getSellerProfileId(userId: string): Promise<string> {
    const seller = await this.sellerRepo.findByUserId(userId);
    if (!seller) throw new NotFoundException('Seller not found');
    return seller.id;
  }
}
