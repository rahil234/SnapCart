import { Offer } from '@/modules/offer/domain/entities';

export interface OfferRepository {
  save(offer: Offer): Promise<Offer>;
  update(offer: Offer): Promise<Offer>;
  findById(id: string): Promise<Offer | null>;
  findAll(skip?: number, take?: number): Promise<{ offers: Offer[]; total: number }>;
  findActiveOffers(): Promise<Offer[]>;
  findByProductId(productId: string): Promise<Offer[]>;
  findByCategoryId(categoryId: string): Promise<Offer[]>;
  findApplicableOffers(
    productIds: string[],
    categoryIds: string[],
    sortByPriority?: boolean,
  ): Promise<Offer[]>;
  delete(id: string): Promise<void>;
}
