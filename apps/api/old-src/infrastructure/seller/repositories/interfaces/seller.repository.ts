import type { Seller as PrismaSeller } from '@prisma/client';

import type { Seller as SellerEntity } from '@/domain/seller/entities/seller.entity';

export interface ISellerRepository {
  create(
    data: Omit<PrismaSeller, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<SellerEntity>;

  findById(id: string): Promise<SellerEntity | null>;

  findByEmail(email: string): Promise<SellerEntity | null>;

  findAll(): Promise<SellerEntity[]>;

  update(id: string, data: Partial<PrismaSeller>): Promise<SellerEntity>;

  delete(id: string): Promise<void>;
}
