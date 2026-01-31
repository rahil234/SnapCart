import { Seller as PrismaSeller } from '@prisma/client';
import { Seller as SellerEntity } from '@/domain/seller/entities/seller.entity';

export const SellerMapper = {
  toDomain(prismaSeller: PrismaSeller): SellerEntity {
    return new SellerEntity(
      prismaSeller.id,
      prismaSeller.name,
      prismaSeller.email,
      prismaSeller.password,
      prismaSeller.status === 'blocked' || prismaSeller.status === 'deleted' ? 'suspended' : prismaSeller.status as 'active' | 'suspended',
      prismaSeller.createdAt,
      prismaSeller.updatedAt,
    );
  },

  toPrisma(seller: Partial<SellerEntity>): any {
    return {
      name: seller.name,
      email: seller.email,
      password: seller.password,
      status: seller.status,
    };
  },
};
